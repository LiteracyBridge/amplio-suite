<template>
  <header class="py-1 px-10 bg-amplio-green shadow-navbar">
    <div class="container mx-auto md:flex md:justify-start md:items-center">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <router-link :to="`/programs/${programId}`" class="text-white">
          <span class="px-4 text-3xl tracking-tight">AMPLIO</span>
        </router-link>

        <!-- Burger button -->
        <div class="md:hidden">
          <button
            type="button"
            class="block text-white hover:text-gray-500"
            @click="isOpen = !isOpen"
          >
            <Bars v-if="isOpen" class="h-6 w-6" />
            <Close v-else class="h-6 w-6" />
          </button>
        </div>
      </div>

      <nav
        aria-label="Primary"
        :class="isOpen ? 'block' : 'hidden'"
        class="w-full md:ml-5 md:flex md:items-center md:justify-between"
      >
        <div class="inline-flex">
          <DropDown :options="options" class="hidden md:block">
            <span
              class="block px-3 text-xl text-white font-bold rounded hover:text-gray-500"
              >Products</span
            >
          </DropDown>

          <!-- On mobile, hidden the dropdown and show this -->
          <div class="md:hidden">
            <span
              class="block px-3 text-xl text-white font-bold rounded hover:text-gray-500"
              >Products</span
            >
            <div class="ml-8">
              <a
                v-for="(opt, index) in options"
                :key="index"
                :href="opt.link"
                :target="opt.target ? opt.target : '_self'"
                class="block text-base text-white rounded hover:text-gray-500"
                @click="isOpen = false"
              >
                {{ opt.name }}
              </a>
            </div>
          </div>

          <router-link
            v-if="programId"
            :to="{ name: 'roadmap', params: { programId } }"
            class="block px-3 pt-3 md:pt-0 text-xl text-white font-bold rounded hover:text-gray-500"
          >
            Roadmap
          </router-link>
          <a
            target="_blank"
            href="https://forms.gle/DNC5uT9iZFrxCyLH8"
            class="block px-3 pt-3 md:pt-0 text-xl text-white font-bold rounded hover:text-gray-500"
          >
            Feedback
          </a>
        </div>

        <div class="inline-flex items-center" :class="expandWhenActive">
          <!-- <VueMultiselect
            id="programSelector"
            :value="programName"
            :options="programNameList"
            placeholder="Select a program"
            @select="programNameSelected"
            @open="programSelectorOpened"
            @close="programSelectorClosed"
          /> -->

          <span
            tabindex="0"
            class="px-3 text-xl text-white font-bold whitespace-nowrap rounded cursor-pointer hover:text-gray-500"
            @click="handleLogout"
            @keyup.enter="handleLogout"
          >
            Log out
          </span>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
import { mapState, mapActions } from "pinia";
import VueMultiselect from "vue-multiselect";
import { useProgramSpecStore } from "@/store/programspec";
import { useProgramsStore } from "@/store/programs";
import { useLanguagesStore } from "@/store/languages";
import { useCategoriesStore } from "@/store/categories";
import DropDown from "@/components/TheNavbarDropDown.vue";

import Bars from "@/assets/svg/bars.svg";
import Close from "@/assets/svg/close.svg";
import { useAccountStore } from "@/store/account";

export default {
  mounted() {
    // this.getProgramsList();
    // this.fetchLanguages();
    // this.fetchCategories();
  },
  computed: {
    ...mapState(useProgramSpecStore, {
      programId: (state) => state.general.program_id,
      wizardCompleted: () => true, // TODO: figure out how to get to SDG and Listening Model selection.
    }),
    ...mapState(useProgramsStore, ["programs", "programNames"]),
    ...mapState(useAccountStore, ["user"]),
    programNameList() {
      return Object.values(this.programNames).sort();
    },
    options() {
      const isAmplioUser =
        this.user &&
        this.user.email &&
        this.user.email.toLowerCase().endsWith("@amplio.org");
      let items = [];
      // Menu items in order. These first ones are not dependent on having a programId.
      items.push({
        name: "Analytics Dashboard",
        link: "https://dashboard.amplio.org/",
        target: "_blank",
      });
      // Menu items that depend on having a programId
      if (this.programId) {
        items.push({
          name: "Program Specification",
          link: this.wizardCompleted
            ? `/programs/${this.programId}/settings`
            : `/programs/${this.programId}/wizard`,
          tag: "router-link",
        });
        if (isAmplioUser) {
          items.push({
            name: "Monitoring Center",
            link: `/programs/${this.programId}/monitor`,
            tag: "router-link",
          });
        }
        items.push({
          name: "Tableau Analytics",
          link: `/programs/${this.programId}/tableau`,
          tag: "router-link",
        });
      }

      items.push({
        name: "Knowledge Base",
        link: "/kb",
        tag: "kb-link",
      });

      // Items not dependent on a programId
      items.push({
        name: "Software Installation",
        link: "/download",
        tag: "router-link",
      });
      items.push({
        name: "User Feedback Processing",
        link: "https://userfeedback.amplio.org/",
        target: "_blank",
      });

      return items;
    },
    programName() {
      try {
        // Program spec name, fall back to program name, fall back to program id.
        // (Program data is loaded before the full program spec).
        const specName =
          this.$store.state.programspec.general.name ||
          this.$store.state.program.programName ||
          this.$store.state.program.programId;
        console.log(`Spec name: ${specName}, selected name: ${this.selectedName}`);
        return specName || this.selectedName || null;
      } catch (ignored) {
        return null;
      }
    },
  },
  watch: {
    loadedProgramName: {
      immediate: true,
      handler() {
        console.log(`Loaded name: ${this.loadedProgramName}`);
      },
    },
    general: {
      immediate: true,
      handler() {
        console.log(`Spec name: ${this.general?.name}`);
      },
    },
  },
  data() {
    return {
      isOpen: false,
      tableauOption: false,
      expandWhenActive: "",
      selectedName: "",
    };
  },
  components: {
    Bars,
    Close,
    DropDown,
    VueMultiselect,
  },
  methods: {
    ...mapActions(useProgramsStore, ["getProgramsList"]),
    ...mapActions(useLanguagesStore, ["fetchLanguages"]),
    ...mapActions(useCategoriesStore, ["fetchCategories"]),
    ...mapActions(useAccountStore, ["logout"]),
    programSelectorOpened() {
      // The program selector is open, so expand it to truncate less of program names.
      this.expandWhenActive = "flex-auto";
    },
    programSelectorClosed() {
      // The program selector is closed, so shrink it to give more space (and visual appeal) to the menu.
      this.expandWhenActive = "";
    },
    programNameSelected(programName) {
      // A program name was selected. Search for the name and open the corresponding program, by programid.
      for (var idIx in this.programs) {
        let programId = this.programs[idIx];
        if (this.programNames[programId] === programName) {
          let route = `/programs/${programId}`;
          console.log(`router push( ${route} )`);
          this.selectedName = programName;
          this.$router.push(route);
          return;
        }
      }
    },
    handleLogout() {
      this.logout();
      this.$router.go();
    },
  },
  created() {
    let urlParams = new URLSearchParams(window.location.search);
    let tableau = urlParams.get("tableau");
    // Only turn the option on. Refresh the page to turn off.
    if (tableau) this.tableauOption = true;
  },
};
</script>
