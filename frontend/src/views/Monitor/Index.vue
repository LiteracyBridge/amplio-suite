<template>
  <PageHeader
    title="Talking Book Monitoring Center"
    sub-title="View progress of deployments in the Monitoring Center."
  >
    <template #footer>
      <Tabs v-model:activeKey="activeKey" centered size="large">
        <TabPane key="deployments" tab="Deployments Status">
          <StatusByDepl :program-id="store.programCode"></StatusByDepl>
        </TabPane>

        <TabPane key="collections" tab="Collections Status">
          <StatusByTb :program-id="store.programCode"></StatusByTb>
        </TabPane>
      </Tabs>
    </template>
  </PageHeader>

  <!-- <main class="container mx-auto"> -->
  <!-- <div class="py-6 flex justify-between">
      <h1 class="text-2xl text-blue capitalize">
        {{ programName }} Talking Book Activity
      </h1>
    </div> -->

  <!-- <div class="bg-white rounded-lg shadow-box"> -->
  <!-- <nav aria-label="Program sections" class="flex border-b">
        <router-link
          v-for="(section, index) in sections"
          :key="section"
          :to="`/programs/${programId}/monitor/${section}`"
          :class="[
            $route.path.endsWith(section) ? 'bg-amplio-green text-white' : 'text-black',
            index === 0 ? 'rounded-tl-lg' : '',
          ]"
          class="p-4 text-lg uppercase hover:bg-amplio-green hover:text-white"
        >
          {{ ` ${sectionTitles[section] || section} ` }}
        </router-link>
      </nav> -->

  <!-- <transition :name="transitionName" mode="out-in">
        <router-view />
      </transition> -->
  <!-- <router-view v-slot="{ Component }">
        <transition>
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <footer class="py-6">
      Need help? Contact us on
      <a class="text-blue" href="mailto:support@amplio.org">support@amplio.org</a>
    </footer> -->
  <!-- </main> -->
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app.store";
import { PageHeader, TabPane, Tabs } from "ant-design-vue";
import { ref } from "vue";
import StatusByDepl from "./StatusByDepl.vue";
import StatusByTb from "./StatusByTb.vue";

// export default {
//   name: "Program",
//   props: ["programId"],
// computed: {
//   ...mapState(useProgramSpecStore, ["deployments", "recipients", "general"]),
//   programName() {
//     return this.general.name;
//   },
// },
// data() {

const store = useAppStore();

const activeKey = ref("deployments");
// const theData = ref({
//   sections: ["StatusByDepl", "StatusByTb"],
//   sectionTitles: {
//     StatusByDepl: "Deployments Status",
//     StatusByTb: "Collections Status",
//   },
//   transitionName: "slide-left",
// });
// try {
//     // Add monitoring pages that should only be shown to @amplio.org users.
//     const email = this.$store.state.account.user.email;
//     if (email) {
//         if (email.endsWith('@amplio.org')) {
//             // . . .
//         }
//     }
// } catch (ignored) {
//     console.log('no user')
// }
//   return theData;
// },
// async created() {
//     await this.fetchSpec({programId: this.programId});
// },
//   beforeRouteUpdate(to, from, next) {
//     const sTo = to.path.split("/");
//     const sFrom = from.path.split("/");
//     const toName = sTo[sTo.length - 1];
//     const fromName = sFrom[sFrom.length - 1];

//     this.transitionName =
//       this.sections.indexOf(toName) < this.sections.indexOf(fromName)
//         ? "slide-right"
//         : "slide-left";
//     next();
//   },
//   // beforeRouteLeave(to, from, next) {
//   //     next()
//   // },
//   methods: {
//     ...mapActions(useUIStore, ["setModal", "closeModal"]),
//   },
// };
</script>
