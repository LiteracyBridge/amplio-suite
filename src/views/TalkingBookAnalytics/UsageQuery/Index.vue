<script setup lang="ts">
import { useTalkingBookAnalyticStore } from "@/store/tb_analytics.store";
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
import { groupBy, sumBy, uniqBy } from "lodash";
import { onMounted, ref } from "vue";
import { useAppStore } from "@/store/app.store";
import type { Deployment } from "@/models/deployment";
import { DownOutlined } from "@ant-design/icons-vue";

const store = useTalkingBookAnalyticStore();
const appStore = useAppStore();

const selectedDeployment = ref(undefined);
const query = ref<string>(null);
const columns = ref([]);
const rows = ref<Record<string, any>[]>([]);

const reports = [
  {
    key: "district-cat",
    title: "Usage by Playlist Category",
    query:
      'category AS "Category", SUM(completions) AS "Completions", SUM(played_seconds) AS "Played Seconds"',
    group: "category",
  },
  {
    key: "district",
    title: "Usage by District",
    query: "deploymentnumber,district,sum(completions),sum(played_seconds)",
  },
  {
    key: "msg",
    title: "Usage by Message",
    query: "deploymentnumber,title,sum(completions),sum(played_seconds)",
  },
  {
    key: "msg-in-district",
    title: "Usage by Message in District",
    query: "deploymentnumber,district,title,sum(completions),sum(played_seconds)",
  },
  {
    key: "lang-in-district",
    title: "Usage by Language in District",
    query: "deploymentnumber,district,language,sum(completions),sum(played_seconds)",
  },
  {
    key: "playlist-in-district",
    title: "Usage by Playlist in District",
    query: "deploymentnumber,district,category,sum(completions),sum(played_seconds)",
  },
  { key: "custom", title: "Custom Report", query: null },
];
const modalVisible = ref(false);

async function fetchStats(q: string, group: string) {
  if (selectedDeployment.value == null) {
    return notification.error({
      message: "Error",
      description: "Please select a deployment to view",
    });
  }

  const results = await store.getUsage({
    deployment: selectedDeployment.value,
    columns: q,
    group,
  });

  // Update table
  if (results.length === 0) return;

  columns.value = Object.keys(results[0]).map((k) => ({
    title: k,
    dataIndex: k,
    key: k,
  }));
  rows.value = results;
}

// onMounted(async () => {
//   if (selectedDeployment.value == null) {
//     const count = appStore.deployments.length;
//     if (count > 1) {
//       // await fetchStats(appStore.deployments[count - 1]);
//       // await fetchStats(appStore.deployments[count - 1]);
//     }
//   }
// });
</script>

<template>
  <PageHeader title="Usage Query" sub-title="">
    <template #extra>
      <Dropdown>
        <template #overlay>
          <Menu>
            <MenuItem
              :key="d.deploymentnumber"
              v-for="d in appStore.deployments"
              @click="selectedDeployment = d.deploymentnumber"
            >
              <span>Deployment {{ d.deploymentnumber }}</span>
            </MenuItem>
          </Menu>
        </template>
        <Button>
          Change Deployment
          <DownOutlined />
        </Button>
      </Dropdown>

      <Dropdown>
        <template #overlay>
          <Menu>
            <MenuItem
              :key="r.key"
              v-for="r in reports"
              @click="
                () => {
                  if (r.key == 'custom') {
                    modalVisible = true;
                  } else {
                    query = r.query;
                    fetchStats(r.query, r.group);
                  }
                }
              "
            >
              <span> {{ r.title }}</span>
            </MenuItem>
          </Menu>
        </template>
        <Button>
          Choose Report
          <DownOutlined />
        </Button>
      </Dropdown>
    </template>
    <!--
    <Alert type="info" :closable="true" v-if="selectedDeployment != null">
      <template #message>
        You're viewing talking books installation for
        {{ selectedDeployment }} deployment. The Deployment has been installed to
        {{ summary.installed }} Talking Books in {{ summary.communities }} communities and
        {{ summary.groups }}
        groups.
      </template>
    </Alert> -->
  </PageHeader>


  <Table
    :columns="columns"
    :data-source="rows"
    size="small"
    :loading="store.loading"
    :sticky="true"
    :scroll="{ x: '70%' }"
    :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
    class="ant-table-striped"
  >
  </Table>

  <Modal v-model:open="modalVisible" title="Basic Modal">
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
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
  </Modal>
</template>

<style scoped>
/* .ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
} */
.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
/* Incredibly over-specified styles for query builder. */

/*!
 * jQuery QueryBuilder 2.5.2
 * Copyright 2014-2018 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (https://opensource.org/licenses/MIT)
 */
.query-builder .rule-container,
.query-builder .rule-placeholder,
.query-builder .rules-group-container {
  position: relative;
  margin: 4px 0;
  border-radius: 5px;
  padding: 5px;
  border: 1px solid #eee;
  background: rgba(255, 255, 255, 0.9);
}

/*.query-builder .error-container,*/
.query-builder .rule-container .rule-filter-container,
.query-builder .rule-container .rule-operator-container,
.query-builder .rule-container .rule-value-container {
  display: inline-block;
  margin: 0 5px 0 0;
  vertical-align: middle;
}

.query-builder .rules-group-container {
  padding: 10px 10px 6px;
  border: 1px solid #dcc896;
  background: rgba(250, 240, 210, 0.5);
}

.query-builder .rules-group-header {
  margin-bottom: 10px;
}

.query-builder .rules-group-header .group-conditions .btn.readonly:not(.active),
.query-builder .rules-group-header .group-conditions input[name$="_cond"] {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  white-space: nowrap;
}

.query-builder .rules-group-header .group-conditions .btn.readonly {
  border-radius: 3px;
}

.query-builder .rules-list {
  list-style: none;
  padding: 0 0 0 15px;
  margin: 0;
}

/*.query-builder .rule-value-container {*/
/*    border-left: 1px solid #ddd;*/
/*    padding-left: 5px*/
/*}*/

/*.query-builder .rule-value-container label {*/
/*    margin-bottom: 0;*/
/*    font-weight: 400*/
/*}*/

/*.query-builder .rule-value-container label.block {*/
/*    display: block*/
/*}*/

/*.query-builder .rule-value-container input[type=number], .query-builder .rule-value-container input[type=text],*/
/*.query-builder .rule-value-container select {*/
/*    padding: 1px*/
/*}*/

/*.query-builder .error-container {*/
/*    display: none;*/
/*    cursor: help;*/
/*    color: red*/
/*}*/

.query-builder .has-error {
  background-color: #fdd;
  border-color: #f99;
}

/*.query-builder .has-error .error-container {*/
/*    display: inline-block !important*/
/*}*/

.query-builder .rules-list > ::after,
.query-builder .rules-list > ::before {
  content: "";
  position: absolute;
  left: -10px;
  width: 10px;
  height: calc(50% + 4px);
  border-color: #ccc;
  border-style: solid;
}

.query-builder .rules-list > ::before {
  top: -4px;
  border-width: 0 0 2px 2px;
}

.query-builder .rules-list > ::after {
  top: 50%;
  border-width: 0 0 0 2px;
}

.query-builder .rules-list > :first-child::before {
  top: -12px;
  height: calc(50% + 14px);
}

.query-builder .rules-list > :last-child::before {
  border-radius: 0 0 0 4px;
}

.query-builder .rules-list > :last-child::after {
  display: none;
}

.query-builder.bt-checkbox-glyphicons
  .checkbox
  input[type="checkbox"]:checked
  + label::after {
  font-family: "Glyphicons Halflings";
  content: "\e013";
}

.query-builder.bt-checkbox-glyphicons .checkbox label::after {
  padding-left: 4px;
  padding-top: 2px;
  font-size: 9px;
}

/*.query-builder .error-container + .tooltip .tooltip-inner {*/
/*    color: #f99 !important*/
/*}*/

/*.query-builder p.filter-description {*/
/*    margin: 5px 0 0 0;*/
/*    background: #d9edf7;*/
/*    border: 1px solid #bce8f1;*/
/*    color: #31708f;*/
/*    border-radius: 5px;*/
/*    padding: 2.5px 5px;*/
/*    font-size: .8em*/
/*}*/

.query-builder .rules-group-header [data-invert] {
  margin-left: 5px;
}

.query-builder .dragging {
  position: fixed;
  opacity: 0.5;
  z-index: 100;
}

.query-builder .dragging::after,
.query-builder .dragging::before {
  display: none;
}

.query-builder .rule-placeholder {
  border: 1px dashed #bbb;
  opacity: 0.7;
}
</style>
