<template>
  <div class="h-full w-full relative bg-gray-50 flex-1">
    <VueFlow
      id="tb-survey-flow"
      v-model:nodes="nodes"
      v-model:edges="edges"
      :default-zoom="0.85"
      :min-zoom="0.2"
      :max-zoom="2"
      :fit-view-on-init="true"
      class="h-full w-full"
      @connect="handleConnect"
      @edges-change="handleEdgesChange"
      @node-click="handleNodeClick"
      @pane-click="handlePaneClick"
    >
      <Background pattern-color="#cbd5e1" :gap="20" />
      <Controls :show-interactive="false" position="bottom-left" />

      <!-- Custom Nodes -->
      <template #node-prolog="nodeProps">
        <PrologNode v-bind="nodeProps" />
      </template>

      <template #node-question="nodeProps">
        <QuestionNode
          v-bind="nodeProps"
          @delete-question="handleDeleteQuestion"
        />
      </template>

      <template #node-epilog="nodeProps">
        <EpilogNode v-bind="nodeProps" />
      </template>
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { VueFlow, useVueFlow, type Connection, type EdgeChange, type Node, type Edge } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { Controls } from "@vue-flow/controls";

import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import "@vue-flow/controls/dist/style.css";

import PrologNode from "./nodes/PrologNode.vue";
import QuestionNode from "./nodes/QuestionNode.vue";
import EpilogNode from "./nodes/EpilogNode.vue";
import {
  type HardwareButton,
  type SurveyQuestionData,
  calculateHierarchicalLayout,
  getButtonFromHandleId,
  getButtonHandleId,
} from "./tb-survey.utils";

const props = defineProps<{
  selectedQuestionId: string | null;
}>();

const nodes = defineModel<Node[]>("nodes", { required: true });
const edges = defineModel<Edge[]>("edges", { required: true });

const emit = defineEmits<{
  (e: "select-question", question: SurveyQuestionData | null): void;
  (e: "delete-question", questionId: string): void;
  (e: "connect-branch", payload: { sourceId: string; button: HardwareButton; targetId: string }): void;
  (e: "disconnect-branch", payload: { sourceId: string; button: HardwareButton }): void;
}>();

const { fitView } = useVueFlow({ id: "tb-survey-flow" });

function handleNodeClick(event: { node: any }) {
  if (event.node.type === "question") {
    emit("select-question", event.node.data as SurveyQuestionData);
  } else {
    emit("select-question", null);
  }
}

function handlePaneClick() {
  emit("select-question", null);
}

function handleDeleteQuestion(questionId: string) {
  emit("delete-question", questionId);
}

function handleConnect(params: Connection) {
  if (!params.source || !params.target) return;

  const buttonName = getButtonFromHandleId(params.sourceHandle);
  const targetLabel = params.target === "epilog" ? "exit" : params.target;
  const edgeLabel = buttonName ? `${buttonName} -> go(${targetLabel})` : undefined;
  const handleId = params.sourceHandle || (buttonName ? getButtonHandleId(buttonName) : undefined);

  // Check if an edge from this source handle already exists and replace it
  const existingIdx = edges.value.findIndex(
    (e) => e.source === params.source && e.sourceHandle === handleId
  );

  const newEdge: Edge = {
    id: `edge-${params.source}-${handleId}-${params.target}`,
    source: params.source,
    sourceHandle: handleId,
    target: params.target,
    targetHandle: params.target === "epilog" ? "epilog-in" : "target",
    label: edgeLabel,
    animated: true,
    style: { stroke: "#8b5cf6", strokeWidth: 2 },
  };

  if (existingIdx > -1) {
    edges.value.splice(existingIdx, 1, newEdge);
  } else {
    edges.value.push(newEdge);
  }

  if (buttonName) {
    emit("connect-branch", {
      sourceId: params.source,
      button: buttonName,
      targetId: params.target,
    });
  }
}

function handleEdgesChange(changes: EdgeChange[]) {
  changes.forEach((change) => {
    if (change.type === "remove") {
      const removedEdge = edges.value.find((e) => e.id === change.id);
      if (removedEdge) {
        const buttonName = getButtonFromHandleId(removedEdge.sourceHandle);
        if (buttonName) {
          emit("disconnect-branch", {
            sourceId: removedEdge.source,
            button: buttonName,
          });
        }
      }
    }
  });
}

function autoLayout() {
  nodes.value = calculateHierarchicalLayout(nodes.value, edges.value);
  setTimeout(() => {
    fitView({ padding: 0.15, duration: 400 });
  }, 50);
}

defineExpose({
  autoLayout,
  fitView: () => fitView({ padding: 0.15, duration: 400 }),
});
</script>

<style>
.vue-flow__edge-path {
  stroke-linecap: round;
}
.vue-flow__edge-text {
  font-size: 10px;
  font-weight: 600;
  fill: #6b21a8;
}
.vue-flow__edge-textbg {
  fill: #faf5ff;
  rx: 4;
  ry: 4;
}
</style>
