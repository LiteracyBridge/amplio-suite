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
  <div class="row justify-between inline-block">
    <div class="w-2/3">
      <div v-if="isAggregate">
        <select :class="CSS.select">
          <option :value="aggregateCol?.aggregation" selected>
            {{ aggregateCol?.aggregation }}
          </option>
        </select>
      </div>

      <select :class="CSS.select" @change="($e) => handleColumnChange($e, true)">
        <option selected>Choose Column</option>
        <option v-for="(col, idx) in COLUMNS" :value="col.name">
          {{ col.heading }}
        </option>
      </select>

      <div v-if="isNormalize">
        <select :class="CSS.select">
          <option :value="normalizeCol?.aggregation" selected>
            {{ normalizeCol?.aggregation }}
          </option>
        </select>

        <select :class="CSS.select" @change="($e) => handleColumnChange($e, false)">
          <option selected>Choose Column</option>
          <option v-for="col in COLUMNS" :value="col.name">{{ col.heading }}</option>
        </select>
      </div>
    </div>

    <div>
      <select name="" id="options" @change="handleOptionChange">
        <option value="" selected>Options</option>
        <option value="aggregate">Aggregate</option>
        <option value="normalize">Normalize</option>
        <option value="delete">Delete</option>
      </select>
    </div>
  </div>
</template>
