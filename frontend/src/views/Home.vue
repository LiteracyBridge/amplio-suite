<template>
  <main class="container mx-auto text-center">
    <h1 class="py-20 text-4xl text-blue font-semibold">
      Hello, <span class="capitalize">{{ user.name }}</span
      >, welcome to the Amplio Suite!
    </h1>

    <font-awesome-icon
      v-if="programStatus === 'loading'"
      icon="spinner"
      size="4x"
      pulse
      class="mx-auto w-20 h-20"
    />

    <div v-else class="grid grid-cols-2 lg:grid-cols-3 gap-10">
      <div @click="onProgspecClicked">
        <home-box
          img="/img/plan.png"
          alt="plan and prepare the programs"
          title="1. Program Specification"
        >
          Define your requirements and complete/modify the program specification document.
        </home-box>
      </div>

      <a href="https://dashboard.amplio.org/" target="_blank">
        <home-box
          img="/img/analytics.png"
          alt="Go to the dashboard portal"
          title="2. Analytics Dashboard"
        >
          Monitor user engagement and feedback through the Amplio Dashboard
        </home-box>
      </a>

      <!--        <div @click="onUfSurveyClicked">-->
      <!--            <home-box img="/img/uf-spec.png" alt="Upload or download a user feedback survey spec" title="4. User Feedback Survey Specification">-->
      <!--                Work with your User Feedback survey specification.-->
      <!--            </home-box>-->
      <!--        </div>-->

      <div v-if="isAmplioUser" @click="onMonitoringCenterClicked">
        <home-box
          img="/img/control2.png"
          alt="View the monitoring center"
          title="3. Monitoring Center"
        >
          View progress of deployments in the Monitoring Center.
        </home-box>
      </div>
      <a v-else href="https://amplio.moodlecloud.com/" target="_blank">
        <home-box
          img="/img/learning.png"
          alt="Go to the learning portal"
          title="3. Learning Portal"
        >
          Access learning portal, job aids and community of practice
        </home-box>
      </a>
    </div>

    <p class="mt-10 text-lg">
      <a
        class="underline text-blue"
        href="https://downloads.amplio.org/software/index.html"
      >
        Click here
      </a>
      to download Amplio Software. Go to
      <router-link to="/download" class="underline text-blue">downloads </router-link>
      page to view other supporting applications.
    </p>
  </main>
</template>

<script>
import { mapActions, mapState } from "pinia";

import HomeBox from "@/components/HomeBox.vue";
import { useAccountStore } from "@/store/account";
import { useProgramSpecStore } from "@/store/programspec";

export default {
  props: ["programId"],
  computed: {
    ...mapState(useAccountStore, ["user"]),
    ...mapState(useProgramSpecStore, {
      wizardCompleted: () => true,
      programStatus: (state) => state.status,
    }),
    ...mapState(useAccountStore, ["user"]),
    isAmplioUser() {
      return (
        this.user &&
        this.user.email &&
        this.user.email.toLowerCase().endsWith("@amplio.org")
      );
    },
  },
  components: {
    HomeBox,
  },
  watch: {
    $route() {
      this.fetchSpec({ programId: this.programId });
    },
  },
  created() {
    this.fetchSpec({ programId: this.programId });
  },
  methods: {
    ...mapActions(useProgramSpecStore, ["fetchSpec"]),
    onProgspecClicked(ev) {
      let altKey = ev && ev.altKey;
      let path = "";
      if (this.wizardCompleted || altKey) {
        path = `${this.$route.path}/settings`;
      } else {
        path = `${this.$route.path}/wizard`;
      }
      this.$router.push(path);
    },
    onUfSurveyClicked(ev) {
      let altKey = ev && ev.altKey;
      let path = "";
      if (this.wizardCompleted || altKey) {
        path = `${this.$route.path}/settings`;
      } else {
        path = `${this.$route.path}/wizard`;
      }
      this.$router.push(path);
    },
    onMonitoringCenterClicked(ev) {
      let altKey = ev && ev.altKey;
      let path = `${this.$route.path}/monitor`;
      if (altKey) path = path + "";
      this.$router.push(path);
    },
  },
};
</script>
