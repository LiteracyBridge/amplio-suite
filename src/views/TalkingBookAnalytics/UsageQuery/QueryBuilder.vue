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

const columns = ref([]);
const modalVisible = ref(false);
</script>

<template>
  <!-- <Modal v-model:open="modalVisible" title="Basic Modal"> -->
  <div>
    <ColumnBuilder />

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
            <input disabled name="builder-basic_group_0_cond" type="radio" value="AND" />
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
  <!-- </Modal> -->
</template>
