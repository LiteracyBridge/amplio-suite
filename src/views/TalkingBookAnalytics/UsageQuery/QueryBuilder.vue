<script lang="ts" setup>
import {
  Tag,
  Row,
  Tooltip,
  Table,
  PageHeader,
  Divider,
  Button,
  Dropdown,
  MenuItem,
  Alert,
  Menu,
  Modal,
  notification,
} from "ant-design-vue";
import { ref } from "vue";
import ColumnBuilder from "./ColumnBuilder.vue";

const props = defineProps<{
  visible?: boolean;
}>();

const emit = defineEmits<{
  (event: "save", query: string): string;
  (event: "close"): void;
}>();

const columns = ref<string[]>([]);
const visible = ref(props.visible);

function saveQuery() {
  const arr = Array.from(new Set(columns.value)).filter((v) => v != null);
  visible.value = false;

  emit("save", arr.join(", "));
  emit("close");
}

function addColumn() {
  columns.value.push(null);
  console.log(columns.value);
}
</script>

<template>
  <Modal
    v-model:open="visible"
    :mask-closable="false"
    @ok="saveQuery"
    ok-text="Save"
    @cancel="
      visible = false;
      emit('close');
    "
    title="Edit Query"
  >
    <div>
      <div v-for="(_, idx) in columns">
        <ColumnBuilder
          :key="idx"
          @save="(q) => (columns[idx] = q)"
          @delete="columns = columns.splice(idx, 1)"
        />
      </div>
    </div>

    <Button @click="addColumn()" type="primary" ghost class="mt-5">Add Column</Button>
  </Modal>
</template>
