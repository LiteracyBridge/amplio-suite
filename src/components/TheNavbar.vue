<template>
  <header class="py-1 px-10 bg-green">
    <div class="container mx-auto md:flex md:justify-start md:items-center">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <span class="text-3xl tracking-tight text-white">AMPLIO</span>

        <!-- Burger button -->
        <div class="md:hidden">
          <button
            type="button"
            class="block text-gray-500 hover:text-white focus:text-white focus:outline-none"
            @click="isOpen = !isOpen"
          >
            <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path
                v-if="isOpen"
                fill-rule="evenodd"
                d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
              />
              <path
                v-if="!isOpen"
                fill-rule="evenodd"
                d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
              /></svg
            >
          </button>
        </div>
      </div>

      <nav :class="isOpen ? 'block' : 'hidden'" class="ml-10 md:flex">
        <a href="#" class="block px-3 text-xl text-white rounded hover:text-gray-500">
          Products
        </a>
        <a href="#" class="block px-3 text-xl text-white rounded hover:text-gray-500">
          Roadmap
        </a>
        <a href="#" class="block px-3 text-xl text-white rounded hover:text-gray-500">
          Content Library
        </a>
        <a href="#" class="block px-3 text-xl text-white rounded hover:text-gray-500">
          Feedback
        </a>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  data () {
    return {
      isOpen: false
    }
  }
}
</script>
