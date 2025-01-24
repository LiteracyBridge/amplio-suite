<script lang="ts" setup>
import {
  Row,
  Col,
  Button,
  Modal,
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
    width="900px"
  >
    <div id="query-body">
      <!-- <div class="top-labels">
        <div class="query-label">SELECT</div>
        <button class="add-column-btn">

        </button>
      </div> -->
      <Row align="middle" class="my-1">
        <Col :span="6"><span class="float-left query-label">SELECT</span></Col>
        <Col :span="18" >
          <Button @click="addColumn()" :inline=true type="primary" ghost class="float-right"
            ><span class="plus mr-1">+</span> Add Column</Button
          ></Col
        >
      </Row>
      <div class="options-body">
        <ColumnBuilder
          v-for="(_, idx) in columns"
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

    <!-- <Button @click="addColumn()" type="primary" ghost class="mt-5"
      >Add Column</Button>
    > -->
  </Modal>
</template>

<style lang="css" scoped>
#query-body {
  margin: 20px;
  border-radius: 5px;
  padding: 30px;
  border: 2px solid #cec8b0;
  background-color: #fdf7e9;
  display: flex;
  flex-direction: column;
}

.top-labels {
  display: flex;
  justify-content: space-between;
}

.query-label {
  background-color: #7191ac;
  color: whitesmoke;
  font-size: 12px;
  font-weight: bold;
  padding: 4px;
  border-radius: 4px;
}
.add-column-btn {
  display: flex;
  align-items: center;
  background-color: #5cb85c;
  color: #fff;
  font-size: 14px;
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* .add-column-btn {
  background-color: #5db558;
} */
.add-column-btn {
  display: flex;
  align-items: center;
  background-color: #5cb85c;
  color: #fff;
  font-size: 14px;
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.options-body {
  position: relative;
  padding-left: 20px;
  margin-left: 10px;
}

.options-body::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 95%;
  background-color: #d0cdc6;
}
</style>
