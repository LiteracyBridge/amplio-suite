<template>
  <header class="py-1 px-10 bg-green shadow-navbar">
    <div class="container mx-auto md:flex md:justify-start md:items-center">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <router-link :to="`/programs/${programCode}`" class="text-white">
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

      <nav aria-label="Primary" :class="isOpen ? 'block' : 'hidden'" class="w-full md:ml-5 md:flex md:items-center md:justify-between">
        <div class="inline-flex">
          <DropDown :options="options" class="hidden md:block">
            <span class="block px-3 text-xl text-white font-bold rounded hover:text-gray-500">Products</span>
          </DropDown>

          <!-- On mobile, hidden the dropdown and show this -->
          <div class="md:hidden">
            <span class="block px-3 text-xl text-white font-bold rounded hover:text-gray-500">Products</span>
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
            :to="{ name: 'roadmap', params: { programCode } }"
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

        <div class="inline-flex items-center">
          <multiselect
            id="programSelector"
            :value="programCode"
            :options="programs"
            placeholder="Select a program"
            @select="selectProgramCode"
          />

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
import { mapState, mapActions } from 'vuex'
import Multiselect from 'vue-multiselect'

import DropDown from '@/components/TheNavbarDropDown'

import Bars from '@/assets/svg/bars.svg'
import Close from '@/assets/svg/close.svg'

export default {
  mounted () {
    this.getAllPrograms()
  },
  computed: {
    ...mapState('program', [
      'programCode'
    ]),
    ...mapState('programs', [
      'programs'
    ]),
  },
  data () {
    return {
      isOpen: false,
      options: [
        { name: 'Analytics Dashboard', link: 'https://dashboard.amplio.org/', target: '_blank' },
        { name: 'Learning Portal', link: 'https://amplio.moodlecloud.com/', target: '_blank' },
        { name: 'Software Installation', link: '/download', tag: 'router-link' }
      ]
    }
  },
  components: {
    Bars,
    Close,
    DropDown,
    Multiselect,
  },
  methods: {
    ...mapActions('programs', [
      'getAllPrograms'
    ]),
    ...mapActions('account', [
      'logout'
    ]),
    async selectProgramCode (programCode) {
      this.$router.push(`/programs/${programCode}`)
    },
    handleLogout () {
      this.logout()
      this.$router.go()
    }
  }
}
</script>
