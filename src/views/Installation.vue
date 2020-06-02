<template>
  <main class="container mx-auto text-center">
    <h1 class="py-20 text-4xl text-blue font-semibold">
      Software Installation
    </h1>

    <section class="p-6 bg-white rounded-lg shadow-box">
      <div class="min-h-200-px py-5 text-left">
        <p class="text-2xl font-semibold">
          1. Download and install <a class="underline text-blue" href="#">Dropbox</a>
        </p>

        <p class="text-2xl font-semibold pt-5">
          2. Download and install <a class="underline text-blue" href="https://www.audacityteam.org/download/windows/" target="_blank">Audacity</a>
        </p>

        <p class="text-2xl font-semibold pt-5">
          3. Download and install <a class="underline text-blue" href="#">ACM Bundle</a>. This installer includes:
        </p>

        <ul class="pl-10 pt-5 text-2xl">
          <li class="block">
            <span class="inline-flex items-center">
              <font-awesome-icon icon="check" class="w-4 h-4 pr-3 text-gray-500" />
              Java
            </span>
          </li>
          <li class="block">
            <span class="inline-flex items-center">
              <font-awesome-icon icon="check" class="w-4 h-4 pr-3 text-gray-500" />
              Audio content manager
            </span>
          </li>
          <li class="block">
            <span class="inline-flex items-center">
              <font-awesome-icon icon="check" class="w-4 h-4 pr-3 text-gray-500" />
              TB loader
            </span>
          </li>
        </ul>

        <footer class="mt-10 text-center">
          <v-button
            tag="a"
            target="_blank"
            text="Go to step 2: Learning Portal"
            class="text-xl cursor-pointer"
          />
        </footer>
      </div>
    </section>
  </main>
</template>

<script>
import VButton from '@/components/Button'

export default {
 components: {
   VButton
 } 
}
</script>