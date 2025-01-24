<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { COLUMNS } from "./usage-query-builder";
import { CSS } from "@/utils";

const emit = defineEmits<{
  (event: "save", col: string, group: string): string;
  (event: "delete"): void;
}>();

const isAggregate = ref(false);
const isNormalize = ref(false);

// First column selected by default, and for aggregate
const aggregateCol = ref<{
  name: string;
  type?: string;
  heading: string;
  aggregation: string;
}>(null);
// Second column selected for normalize
const normalizeCol = ref<{
  name: string;
  type?: string;
  heading: string;
  aggregation: string;
}>(null);

function buildQuery() {
  let q = "";
  let group = null;

  if (isAggregate.value && isNormalize.value) {
    q = `
      (${aggregateCol.value.aggregation.toUpperCase()}(${aggregateCol.value.name})/
      ${normalizeCol.value.aggregation.toUpperCase()}(${normalizeCol.value.name}))
      AS "${aggregateCol.value.heading} / ${normalizeCol.value.heading}"
    `.trim();

    emit("save", q, group);
    return;
  }

  if (isAggregate.value) {
    q = `${aggregateCol.value.aggregation.toUpperCase()}(${
      aggregateCol.value.name
    }) AS "${aggregateCol.value.heading}"`;
  } else {
    group = `"${aggregateCol.value.heading}"`;
    q = `${aggregateCol.value.name} AS ${group}`;
  }

  emit("save", q.trim(), group);
  return q;
}

const handleColumnChange = (e: Event, isAggregate: boolean) => {
  const target = e.target as HTMLSelectElement;
  const col = COLUMNS.find((col) => col.name === target.value);
  if (isAggregate) {
    col.aggregation ??= "count";
    // @ts-ignore
    aggregateCol.value = col;
  } else {
    col.aggregation ??= "count";
    // @ts-ignore
    normalizeCol.value = col;
  }

  buildQuery();
};

const handleOptionChange = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  if (target.value === "aggregate") {
    isAggregate.value = !isAggregate.value;
  }
  if (target.value === "normalize") {
    isNormalize.value = !isNormalize.value;
  }
  if (target.value === "delete") {
    emit("delete");
  }
};

onMounted(() => {
  // select first aggregate col by default
  const col = COLUMNS[0];
  col.aggregation ??= "count";
  // @ts-ignore
  aggregateCol.value = col;
});
</script>

<template>
  <div class="query-row">
    <select class="drop-dwn-1" v-if="isAggregate">
      <option :value="aggregateCol?.aggregation" selected>
        {{ aggregateCol?.aggregation }}
      </option>
    </select>

    <select @change="($e) => handleColumnChange($e, true)" class="drop-dwn-1">
      <option selected>Choose Column</option>
      <option v-for="(col, idx) in COLUMNS" :value="col.name">
        {{ col.heading }}
      </option>
    </select>

    <div v-if="isNormalize">
      <select class="drop-dwn-1">
        <option :value="normalizeCol?.aggregation" selected>
          {{ normalizeCol?.aggregation }}
        </option>
      </select>

      <select
        @change="($e) => handleColumnChange($e, false)"
        class="drop-dwn-1"
      >
        <option selected>Choose Column</option>
        <option v-for="col in COLUMNS" :value="col.name">
          {{ col.heading }}
        </option>
      </select>
    </div>

    <select class="drop-dwn-2" @change="handleOptionChange">
      <option value="" selected>Options</option>
      <option value="aggregate">Aggregate</option>
      <option value="normalize" :disabled="!isAggregate">Normalize</option>
      <option value="delete">Delete</option>
    </select>
  </div>
</template>

<style scoped>
.query-builder {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 900px;
  margin: 0 auto;
}

.query-header {
  background-color: #3979b4;
  color: #fff;
  padding: 10px 15px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px 4px 0 0;
}

/* .query-body {
  margin: 20px;
  border-radius: 5px;
  border: 2px solid #cec8b0;
  background-color: #fdf7e9;
  padding: 30px;
  display: flex;
  flex-direction: column;
} */

.query-row {
  display: flex;
  position: relative;
  align-items: start;
  justify-content: space-between;
  background-color: #fffefc;
  margin: 5px -17px;
  padding: 5px 5px 5px 20px;
}

.query-row::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  width: 20px;
  height: 3px;
  background-color: #d0cdc6;
}

.drop-dwn-1,
.query-row input {
  margin-right: 8px;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background-color: transparent;
}

.drop-dwn-2 {
  background-color: #60bede;
  color: whitesmoke;
  border: none;
  border-radius: 3px;
  padding: 3px;
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

.plus {
  background-color: white;
  border-radius: 50%;
  color: #5db558;
  padding: 2px;
  display: flex;
  font-weight: bolder;
  justify-content: center;
  align-items: center;
  height: 10px;
  width: 10px;
}

.add-column-btn:hover {
  background-color: #4cae4c;
}

.query-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 10px 15px;
  background-color: #f5f5f5;
  border-top: 1px solid #ddd;
  border-radius: 0 0 4px 4px;
}

.footer-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.btn-cancel {
  background-color: #ddd;
  color: #333;
}

.btn-ok {
  background-color: #428bca;
  color: #fff;
}

.footer-btn:hover {
  opacity: 0.9;
}
</style>
