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
  (event: "save", columns: string, group: string): string;
  (event: "close"): void;
}>();

const columns = ref<{ col: string; group: string }[]>([]);
const visible = ref(props.visible);

function saveQuery() {
  const cols = Array.from(new Set(columns.value.map((i) => i.col))).filter(
    (v) => v != null && v !== ""
  );
  const group = Array.from(new Set(columns.value.map((i) => i.group))).filter(
    (v) => v != null && v !== ""
  );
  visible.value = false;

  emit("save", cols.join(", "), group.join(", "));
  emit("close");
}

function addColumn() {
  columns.value.push({ col: null, group: null });
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
    width="800px"
  >
    <div id="query-body">
      <div class="top-labels">
        <div class="query-label">SELECT</div>
        <button class="add-column-btn"><span class="plus">+</span> Add Column</button>
      </div>

      <div v-for="(_, idx) in columns" class="options-body">
        <ColumnBuilder
          :key="idx"
          @save="
            (q, g) => {
              columns[idx].col = q;
              columns[idx].group = g;
            }
          "
          @delete="columns = columns.splice(idx, 1)"
        />
      </div>
    </div>

    <Button @click="addColumn()" type="primary" ghost class="mt-5">Add Column</Button>
  </Modal>
</template>

<style lang="css" scoped>
#query-body {
  margin: 20px;
  border-radius: 5px;
  border: 2px solid #cec8b0;
  background-color: #fdf7e9;
  padding: 30px;
  display: flex;
  flex-direction: column;
}

.top-labels {
  display: flex;
  justify-content: space-between;
}

.add-column-btn {
  background-color: #5db558;
}

.options-body {
  position: relative;
  padding-left: 20px;
}

.options-body::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 88%;
  background-color: #d0cdc6;
}

</style>
