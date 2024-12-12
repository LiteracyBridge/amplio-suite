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
    <div id="builder">
      <div v-for="(_, idx) in columns">
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
#builder {
  padding: 10px 10px 6px;
  border: 1px solid #dcc896;
  background: hsla(45, 80%, 90%, 0.5);
}

#builder > div {
  background: white;
  display: inline
}
</style>
