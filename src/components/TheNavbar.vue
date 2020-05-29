<template>
  <header class="py-1 px-10 bg-green shadow-navbar">
    <div class="container mx-auto md:flex md:justify-start md:items-center">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/" class="text-white focus-dashed">
          <span class="px-4 text-3xl tracking-tight">AMPLIO</span>
        </router-link>

        <!-- Burger button -->
        <div class="md:hidden">
          <button
            type="button"
            class="block text-white hover:text-gray-500 focus-dashed"
            @click="isOpen = !isOpen"
          >
            <Bars v-if="isOpen" class="h-6 w-6" />
            <Close v-else class="h-6 w-6" />
          </button>
        </div>
      </div>

      <nav :class="isOpen ? 'block' : 'hidden'" class="ml-5 md:flex">
        <DropDown :options="options" class="hidden md:block">
          <span class="block px-3 text-xl text-white rounded hover:text-gray-500">Products</span>
        </DropDown>

        <!-- On mobile, hidden the dropdown and show this -->
        <div class="md:hidden">
          <span class="block px-3 text-xl text-white rounded hover:text-gray-500">Products</span>
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

        <a href="#" class="block px-3 pt-3 md:pt-0 text-xl text-white rounded hover:text-gray-500 focus-dashed">
          Roadmap
        </a>
        <a href="#" class="block px-3 pt-3 md:pt-0 text-xl text-white rounded hover:text-gray-500 focus-dashed">
          Content Library
        </a>
        <a href="#" class="block px-3 pt-3 md:pt-0 text-xl text-white rounded hover:text-gray-500 focus-dashed">
          Feedback
        </a>
      </nav>
    </div>
  </header>
</template>

<script>
import DropDown from '@/components/TheNavbarDropDown'

import Bars from '@/assets/svg/bars.svg'
import Close from '@/assets/svg/close.svg'

export default {
  data () {
    return {
      isOpen: false,
      options: [
        { name: 'Learning Portal', link: 'https://amplio.moodlecloud.com/', target: '_blank' },
        { name: 'Analytics Dashboard', link: 'https://dashboard.amplio.org/', target: '_blank' },
        { name: 'Applications & Tools', link: '#' }
      ]
    }
  },
  components: {
    Bars,
    Close,
    DropDown
  }
}
</script>
