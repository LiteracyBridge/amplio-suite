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
const emit = defineEmits<(event: "save", query: string) => string>();

const columns = ref<string[]>([]);
const modalVisible = ref(false);

function saveQuery() {
  const arr = Array.from(new Set(columns.value));
  emit("save", arr.join(", "));
}

function addColumn() {
  columns.value.push(null);
  console.log(columns.value);
}
</script>

<template>
  <Modal
    v-model:open="props.visible"
    :mask-closable="false"
    @ok="saveQuery"
    ok-text="Save"
  >
    <template #title>
      <Button @click="addColumn()">Add Column</Button>
    </template>

    <div>
      <div v-for="(_, idx) in columns">
        <ColumnBuilder :key="idx" @save-query="(q) => (columns[idx] = q)" />
      </div>

      <div class="query-builder form-inline" id="builder-basic">
        <div class="rules-group-container rules-group-header">
          <div class="btn-group pull-right group-actions">
            <button
              class="btn btn-xs btn-success"
              data-add="group"
              id="add-column"
              type="button"
            >
              <i class="glyphicon glyphicon-plus-sign"></i> Add Column
            </button>
          </div>
          <div class="btn-group group-conditions">
            <label class="btn btn-xs btn-primary active disabled">
              <input
                disabled
                name="builder-basic_group_0_cond"
                type="radio"
                value="AND"
              />
              SELECT
            </label>
            <!--<div class="error-container" data-toggle="tooltip"><i
                            class="glyphicon glyphicon-warning-sign"></i>
                    </div>-->
          </div>
          <div class="rules-list" id="columns-list"></div>
        </div>

        <!-- div>
                <p> SELECT DISTINCT <span id="query-display-query"></span> FROM usage-info;</p>
                <p> Strings: <span id="query-display-strings"></span></p>
                <p> Toolips: <span id="query-display-tooltips"></span></p>
            </div -->
      </div>
    </div>
  </Modal>
</template>
