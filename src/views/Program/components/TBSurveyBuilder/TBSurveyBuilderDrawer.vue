<template>
  <Drawer
    :open="open"
    :width="'92vw'"
    placement="right"
    :closable="false"
    :body-style="{ padding: '0px', height: '100%', display: 'flex', flexDirection: 'column' }"
    class="tb-survey-drawer"
  >
    <!-- Drawer Header / Toolbar -->
    <div class="px-6 py-3 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm z-10">
      <div class="flex items-center space-x-3">
        <div class="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
          <ClusterOutlined class="text-lg" />
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h2 class="text-base font-bold text-gray-800 m-0">Talking Book Survey Builder</h2>
            <Tag color="purple">Amplio TB Custom Survey</Tag>
          </div>
          <p class="text-xs text-gray-400 m-0">
            Playlist: <strong class="text-gray-700">{{ playlist.title || "Untitled Playlist" }}</strong>
            ({{ questions.length }} questions)
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <Button @click="handleAutoLayout">
          <ApartmentOutlined /> Auto Layout
        </Button>

        <Button type="primary" :ghost="true" @click="handleAddQuestion">
          <PlusOutlined /> Add Question
        </Button>

        <Button @click="isYamlModalOpen = true">
          <FileTextOutlined /> View YAML
        </Button>

        <Divider type="vertical" />

        <Button @click="$emit('close')">Cancel</Button>

        <Button type="primary" @click="handleSaveSurvey">
          <CheckOutlined /> Save Survey
        </Button>
      </div>
    </div>

    <!-- Main Workspace: Flow Canvas + Question Inspector -->
    <div class="flex-1 flex overflow-hidden relative">
      <TBSurveyCanvas
        ref="canvasRef"
        v-model:nodes="nodes"
        v-model:edges="edges"
        :selected-question-id="selectedQuestion?.id ?? null"
        @select-question="handleSelectQuestion"
        @delete-question="handleDeleteQuestion"
        @connect-branch="handleConnectBranch"
        @disconnect-branch="handleDisconnectBranch"
      />

      <!-- Question Inspector -->
      <QuestionInspector
        :question="selectedQuestion"
        :all-questions="questions"
        @close="selectedQuestion = null"
        @update-prompt="handleUpdatePrompt"
        @update-action="handleUpdateAction"
        @delete-question="handleDeleteQuestion"
      />
    </div>

    <!-- YAML Modal -->
    <TBSurveyYamlModal
      :open="isYamlModalOpen"
      :yaml-content="currentYaml"
      @close="isYamlModalOpen = false"
    />
  </Drawer>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from "vue";
import { Drawer, Button, Tag, Divider, message } from "ant-design-vue";
import {
  ClusterOutlined,
  ApartmentOutlined,
  PlusOutlined,
  FileTextOutlined,
  CheckOutlined,
} from "@ant-design/icons-vue";
import type { Node, Edge } from "@vue-flow/core";
import TBSurveyCanvas from "./TBSurveyCanvas.vue";
import QuestionInspector from "./QuestionInspector.vue";
import TBSurveyYamlModal from "./TBSurveyYamlModal.vue";
import {
  type HardwareButton,
  type SurveyQuestionData,
  type TBSurveyHeader,
  playlistToGraph,
  surveyToYaml,
  createDefaultActions,
  getButtonHandleId,
} from "./tb-survey.utils";
import type { Playlist } from "@/models/playlist";
import type { Deployment } from "@/models/deployment";
import { useProgramSpecStore } from "@/store/programspec";

const props = defineProps<{
  open: boolean;
  playlist: Playlist;
  deployment: Deployment;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const store = useProgramSpecStore();
const canvasRef = ref<InstanceType<typeof TBSurveyCanvas> | null>(null);

const nodes = ref<Node[]>([]);
const edges = ref<Edge[]>([]);

const questions = ref<SurveyQuestionData[]>([]);
const selectedQuestion = ref<SurveyQuestionData | null>(null);
const isYamlModalOpen = ref(false);

const surveyHeader = ref<TBSurveyHeader>({
  name: "",
  prolog: "Welcome to the talking book satisfaction survey",
  epilog: "Thank you for your participation",
  confirmExit: "s1confirm",
});

const currentYaml = computed(() => {
  return surveyToYaml(surveyHeader.value, questions.value);
});

// Initialize graph when drawer opens
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && props.playlist) {
      initSurveyGraph();
    }
  },
  { immediate: true }
);

function initSurveyGraph() {
  const graph = playlistToGraph(props.playlist);
  surveyHeader.value = graph.header;

  questions.value = graph.nodes
    .filter((n) => n.type === "question")
    .map((n) => n.data as SurveyQuestionData);

  selectedQuestion.value = questions.value.length > 0 ? questions.value[0] : null;

  nodes.value = graph.nodes;
  edges.value = graph.edges;

  nextTick(() => {
    if (canvasRef.value) {
      canvasRef.value.autoLayout();
    }
  });
}

function handleAutoLayout() {
  if (canvasRef.value) {
    canvasRef.value.autoLayout();
  }
}

function handleSelectQuestion(qData: SurveyQuestionData | null) {
  selectedQuestion.value = qData;
}

function handleUpdatePrompt({ id, prompt }: { id: string; prompt: string }) {
  const q = questions.value.find((item) => item.id === id);
  if (!q) return;
  q.prompt = prompt;

  // Update corresponding message in playlist
  const msg = (props.playlist.messages || []).find((m) => m._id === q.messageId);
  if (msg) {
    store.setMessageOrPlaylistTitle(prompt, msg);
  }

  // Update node data in nodes array
  const node = nodes.value.find((n) => n.id === id);
  if (node) {
    node.data = { ...q };
  }
}

function handleUpdateAction({
  id,
  button,
  config,
}: {
  id: string;
  button: HardwareButton;
  config: any;
}) {
  const q = questions.value.find((item) => item.id === id);
  if (!q) return;

  q.actions[button] = config;

  const targetId = config?.targetQuestionId;
  const buttonHandle = getButtonHandleId(button);

  // Find existing edge from this button handle
  const existingIdx = edges.value.findIndex(
    (e) => e.source === id && e.sourceHandle === buttonHandle
  );

  if (targetId && targetId !== "next") {
    const targetLabel = targetId === "epilog" ? "exit" : targetId;
    const newEdge: Edge = {
      id: `edge-${id}-${buttonHandle}-${targetId}`,
      source: id,
      sourceHandle: buttonHandle,
      target: targetId,
      targetHandle: targetId === "epilog" ? "epilog-in" : "target",
      label: `${button} -> go(${targetLabel})`,
      animated: true,
      style: { stroke: "#8b5cf6", strokeWidth: 2 },
    };

    if (existingIdx > -1) {
      edges.value.splice(existingIdx, 1, newEdge);
    } else {
      edges.value.push(newEdge);
    }
  } else if (existingIdx > -1) {
    edges.value.splice(existingIdx, 1);
  }

  // Update node data in nodes array
  const node = nodes.value.find((n) => n.id === id);
  if (node) {
    node.data = { ...q };
  }
}

function handleConnectBranch({
  sourceId,
  button,
  targetId,
}: {
  sourceId: string;
  button: HardwareButton;
  targetId: string;
}) {
  const q = questions.value.find((item) => item.id === sourceId);
  if (!q) return;

  if (!q.actions[button]) {
    q.actions[button] = {
      button,
      responseValue: button === "Tree" ? "Yes" : button === "Table" ? "No" : "No response",
      targetQuestionId: targetId,
    };
  } else {
    q.actions[button]!.targetQuestionId = targetId;
  }

  const node = nodes.value.find((n) => n.id === sourceId);
  if (node) {
    node.data = { ...q };
  }
}

function handleDisconnectBranch({
  sourceId,
  button,
}: {
  sourceId: string;
  button: HardwareButton;
}) {
  const q = questions.value.find((item) => item.id === sourceId);
  if (!q || !q.actions[button]) return;

  q.actions[button]!.targetQuestionId = undefined;

  const node = nodes.value.find((n) => n.id === sourceId);
  if (node) {
    node.data = { ...q };
  }
}

function handleAddQuestion() {
  // Add message to playlist in store
  store.addMessage(props.playlist);
  const newMsg = props.playlist.messages[props.playlist.messages.length - 1];

  const newIndex = questions.value.length + 1;
  const qId = `q${newIndex}`;

  const newQuestionData: SurveyQuestionData = {
    id: qId,
    messageId: newMsg._id,
    prompt: newMsg.title || `Question ${newIndex}`,
    position: newIndex,
    actions: createDefaultActions(),
  };

  questions.value.push(newQuestionData);

  nodes.value.push({
    id: qId,
    type: "question",
    position: { x: 320, y: 220 + (newIndex - 1) * 260 },
    data: newQuestionData,
    deletable: true,
  });

  selectedQuestion.value = newQuestionData;

  nextTick(() => {
    handleAutoLayout();
  });
}

function handleDeleteQuestion(questionId: string) {
  const qIndex = questions.value.findIndex((item) => item.id === questionId);
  if (qIndex === -1) return;

  const q = questions.value[qIndex];

  // Remove corresponding message from playlist in store
  const msg = (props.playlist.messages || []).find((m) => m._id === q.messageId);
  if (msg) {
    store.removeMessage(msg, props.playlist);
  }

  // Remove question from questions list
  questions.value.splice(qIndex, 1);

  // Remove node and connected edges from arrays
  nodes.value = nodes.value.filter((n) => n.id !== questionId);
  edges.value = edges.value.filter((e) => e.source !== questionId && e.target !== questionId);

  if (selectedQuestion.value?.id === questionId) {
    selectedQuestion.value = questions.value.length > 0 ? questions.value[0] : null;
  }

  nextTick(() => {
    handleAutoLayout();
  });
}

function handleSaveSurvey() {
  const yaml = surveyToYaml(surveyHeader.value, questions.value);
  props.playlist.survey_yaml = yaml;
  props.playlist.is_survey = true;
  store.changed = true;

  message.success("Survey specification generated and saved to playlist in memory!");
  emit("close");
}
</script>

<style>
.tb-survey-drawer .ant-drawer-body {
  padding: 0;
  overflow: hidden;
}
</style>
