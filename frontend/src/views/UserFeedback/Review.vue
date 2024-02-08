<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAccountStore } from "@/store/account";
import { useFeedbackAnalysis } from "@/store/feedback_analysis.store";
import { useAppStore } from "@/store/app.store";
import { ApiRequest } from "@/api";

const store = useFeedbackAnalysis(),
  appStore = useAppStore();

const columns = [
  {
    label: "Submission Time",
    key: "submissionTime",
    class: "text-center px-4 py-2 border-b",
  },
  {
    label: "Filename",
    key: "uuid",
    class: "text-center px-4 py-2 border-b",
  },
  {
    label: "Feedback",
    key: "feedback",
    class: "text-center px-4 py-2 border-b",
  },
  {
    label: "Location",
    key: "location",
    class: "text-center px-4 py-2 border-b",
  },
  {
    label: "Group",
    key: "group",
    class: "text-center px-4 py-2 border-b",
  },
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
  connected = ref(true),
  uuid = ref(""),
  index = ref(0),
  submissionsList = ref<any>([]),
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
  uuid = uuid;
  index = index;
  reviewed.value.push(submissionsList[index].uuid);
  allResponses.value = false;
}
function getNext() {
  index.value += 1;
  if (index.value < submissionsList.length) {
    uuid.value = submissionsList[index.value].uuid;
    reviewed.value.push(submissionsList[index.value].uuid);
  } else {
    uuid.value = "";
  }
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

function getSubmissionsList() {
  const request =
    "https://ckz0f72fjf.execute-api.us-west-2.amazonaws.com/default/ufDataService?" +
    "email=" +
    useAccountStore().email +
    "&program=" +
    appStore.programCode +
    "&deployment=" +
    appStore.userFeedback.deployment +
    "&language=" +
    appStore.userFeedback.language +
    "&uuid=all" +
    "&timezoneOffset=" +
    -new Date().getTimezoneOffset() +
    " minutes";
  // Vue.axios.interceptors.request.use(request => {console.log('Starting Request', JSON.stringify(request, null, 2)) return request });
  console.log("updateUrl:" + request);
  ApiRequest.get(request)
    .then((response) => {
      // if (!this.connected) {
      //   this.connected = true;
      // }
      submissionsList.value = response;
      // this.setSortByColumn(this.sortTable.by, this.sortTable.descending);
    })
    .catch((err) => {
      console.log("caught:" + err);
      // this.connected = false;
    });
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
              <th :class="col.class" v-for="col in columns" :key="col.key">
                    {{ col.label }}
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
            <tr
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
            </tr>
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
