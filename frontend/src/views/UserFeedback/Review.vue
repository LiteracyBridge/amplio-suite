<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAccountStore } from "@/store/account";
import { useFeedbackAnalysis } from "@/store/feedback_analysis.store";
import { useAppStore } from "@/store/app.store";
import { ApiRequest } from "@/api";
import {
  Card,
  Button,
  Form,
  FormItem,
  Space,
  Divider,
  Textarea,
  Modal,
  Tabs,
  TabPane,
  CheckboxGroup,
  RadioGroup,
  Checkbox,
  Radio,
  Empty,
  Select,
  SelectOption,
  notification,
  PageHeader,
  Dropdown,
  MenuItem,
  Table,
  Alert,
  Menu,
  Spin,
} from "ant-design-vue";
import DeploymentsLanguageDropdown from "./components/DeploymentsLanguageDropdown.vue";
import { UserFeedbackMessage } from "@/models/uf_message";

const feedbackStore = useFeedbackAnalysis(),
  store = useAppStore();

const columns = [
  {
    title: "Submission Time",
    key: "submissionTime",
  },
  {
    title: "Filename",
    key: "uuid",
  },
  {
    title: "Feedback",
    key: "feedback",
  },
  {
    title: "Location",
    key: "location",
  },
  {
    title: "Group",
    key: "group",
  },
  {
    title: "Community",
    key: "community",
  },
  {
    title: "District",
    key: "district",
  }
];

// export default {
//   name: "Responses",
//   components: {
//     NavBar,
//     AnalyzeComp,
//     VTooltip,
//   },
// data() {
const allResponses = ref(true),
  // connected = ref(true),
  uuid = ref(""),
  index = ref(0),
  submissionsList = ref<UserFeedbackMessage[]>([]),
  reviewed = ref([]),
  // columns = ref()
  sortTable = ref({
    by: "submissionTime",
    descending: true,
  });
// };
// },
// methods: {
//   ...mutations,
function setAllResponses() {
  allResponses.value = true;
  getSubmissionsList();
}
function goTo(uuid: string, index: number) {
  // uuid = uuid;
  // index = index;
  // reviewed.value.push(submissionsList[index].uuid);
  // allResponses.value = false;
}
function getNext() {
  // index.value += 1;
  // if (index.value < submissionsList.length) {
  //   uuid.value = submissionsList[index.value].uuid;
  //   reviewed.value.push(submissionsList[index.value].uuid);
  // } else {
  //   uuid.value = "";
  // }
}
//  function  setSortByColumn(colId = this.sortTable.by, descending = !this.sortTable.function descending) {
//     console.log("sort:" + colId + " / " + String(descending));
//     if (this.sortTable.by === colId) {
//       this.sortTable.descending = descending;
//     } else {
//       this.sortTable.by = colId;
//       this.sortTable.descending = descending;
//     }
//     const direction = this.sortTable.descending ? -1 : 1;
//     this.submissionsList = this.submissionsList.sort(
//       (a, b) => direction * a[colId].toString().localeCompare(b[colId].toString())
//     );
//   },

// contextChanged() {
//   this.getSubmissionsList();
// },

// updatedProgram(programCode) {
//   this.$router.push({ path: this.$route.path });
// },

async function getSubmissionsList() {
  await feedbackStore
    .fetchSubmittedMessages()
    .then((resp) => (submissionsList.value = resp));

  // const request =
  //   "https://ckz0f72fjf.execute-api.us-west-2.amazonaws.com/default/ufDataService?" +
  //   "email=" +
  //   useAccountStore().email +
  //   "&program=" +
  //   store.programCode +
  //   "&deployment=" +
  //   store.userFeedback.deployment +
  //   "&language=" +
  //   store.userFeedback.language +
  //   "&uuid=all" +
  //   "&timezoneOffset=" +
  //   -new Date().getTimezoneOffset() +
  //   " minutes";
  // // Vue.axios.interceptors.request.use(request => {console.log('Starting Request', JSON.stringify(request, null, 2)) return request });
  // console.log("updateUrl:" + request);
  // ApiRequest.get(request)
  //   .then((response) => {
  //     // if (!this.connected) {
  //     //   this.connected = true;
  //     // }
  //     submissionsList.value = response;
  //     // this.setSortByColumn(this.sortTable.by, this.sortTable.descending);
  //   })
  //   .catch((err) => {
  //     console.log("caught:" + err);
  //     // this.connected = false;
  //   });
}
// },
// computed: {
//   ...getters,
// liveSubmissionsList() {
//   return this.submissionsList;
// },
// deployments() {
//   var program = this.programs.filter((p) => {
//     return p.code == this.context.selectedProgramCode;
//   });
//   return program[0].deployments;
// },
// languages() {
//   var program = this.programs.filter((p) => {
//     return p.code == this.context.selectedProgramCode;
//   });
//   return program[0].languages;
// },
// },
// created() {
//   if (this.$route.query.program) {
//     this.context.selectedProgramCode = this.$route.query.program;
//     this.context.selectedLanguageCode = this.$route.query.language;
//     this.context.selectedDeployment = this.$route.query.deployment;
//   }
// },

onMounted(() => {
  getSubmissionsList();
});
// mounted() {
// this.getSubmissionsList();
//   },
// };
</script>

<template>
  <PageHeader title="User Feedback Review" sub-title="Analyse user feedback messages">
    <template #extra>
      <DeploymentsLanguageDropdown @change="getSubmissionsList()" />
    </template>

    <Alert type="info" :closable="true">
      <template #message>
        <span>
          Reviewing user feedback for
          <span class="font-bold text-lg">{{ store.programName }}</span
          >, deployment
          <span class="font-bold text-lg">{{ store.userFeedback.deployment }}</span>
          and language
          <span class="font-bold text-lg">{{ store.userFeedback.language }}</span>
        </span>
      </template>
    </Alert>
  </PageHeader>

  <Table
    :columns="columns"
    :data-source="submissionsList"
    :loading="feedbackStore.loading"
  >
    <!-- <template #title>
      <div class="flex justify-between">
        <TypographyTitle :level="5"> Talking Book Deployment Activity </TypographyTitle>

        <Button type="primary" @click="fetchData('ByDepl')" :ghost="true">
          <ReloadOutlined /> Refresh Data
        </Button>
      </div>
    </template> -->
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'submissionTime'">
        {{ record.submissionTime }}
      </template>

      <template v-if="column.key === 'uuid'">
        {{ record.message_uuid }}
      </template>

      <template v-if="column.key === 'feedback'">
        {{ record.is_useless ? 'No' : 'False' }}
      </template>

      <template v-if="column.key === 'group'">
        {{ record.recipient.group_name }}
      </template>

      <template v-if="column.key === 'community'">
        {{ record.recipient.community_name }}
      </template>

      <template v-if="column.key === 'district'">
         {{ record.recipient.district }}, {{ record.recipient.region }}
      </template>

    </template>
  </Table>

  <div>
    <div v-if="allResponses" class="grid grid-cols-10">
      <!-- <div class="row-start-1 row-end-2 col-span-full">
        <nav-bar @contextChanged="contextChanged" :allResponsesLink="!allResponses" />
      </div> -->
      <div
        class="row-start-2 col-start-3 col-span-6 pl-8 justify-self-start text-3xl text-gray-600"
        style="font-weight: bold"
      >
        All Responses
      </div>
      <div class="row-start-3 col-start-3 col-span-6 justify-self-stretch">
        <table class="table-fixed overflow-x-auto" style="border: 2px solid #ddd">
          <thead>
            <tr>
              <th v-for="col in columns" :key="col.key">
                {{ col.title }}
                <!-- <v-tooltip
                  :width="150"
                  :text="`Sort ${sortTable.descending ? 'Ascending' : 'Descending'}`"
                >
                  <button
                    @click="setSortByColumn(col.key)"
                    @keyup.enter="setSortByColumn(col.key)"
                    @keyup.space="setSortByColumn(col.key)"
                    class="flex gap-2"
                    style="white-space: nowrap"
                  >
                    {{ col.label }}
                    <font-awesome-icon
                      v-if="sortTable.by === col.key"
                      :icon="sortTable.descending ? 'chevron-down' : 'chevron-up'"
                    />
                  </button>
                </v-tooltip> -->
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- <tr
              v-for="(submission, index) in submissionsList"
              :key="submission.uuid"
              :class="
                (index % 2 === 0 ? '' : 'bg-gray-200 ') +
                (reviewed.includes(submission.uuid) ? 'font-normal' : 'font-semibold')
              "
              class="hover:bg-gray-400 cursor-pointer"
              @click="goTo(submission.uuid, index)"
            >
              <td
                v-for="col in columns"
                :key="`${index}-${col.key}`"
                class="text-center px-4 py-2 border-b"
              >
                {{ submission[col.key] }}
              </td>
            </tr> -->
          </tbody>
        </table>
      </div>
    </div>

    <div v-else-if="!allResponses">
      <analyze-comp :nextUUID="uuid" @all="setAllResponses" @next="getNext" />
    </div>
  </div>
</template>

<style scoped>
/* table thead th {
  white-space: nowrap;
  @apply px-4 py-2 text-green border-b;
} */
</style>
