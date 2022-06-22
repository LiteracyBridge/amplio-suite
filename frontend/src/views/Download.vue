<template>
  <main class="container mx-auto text-center">
    <h1 class="py-20 text-4xl text-blue font-semibold">
      Software Download
    </h1>

    <section class="p-6 bg-white rounded-lg shadow-box">
      <div class="min-h-200-px py-5 text-left">

        <!-- You'd think that we would use an <ol> here. But tailwind, for reasons known only to them, defines
         "ol {list-style:none;}", which, of course, totally eviscerates <ol>. Tailwind's creators complained
         that css is too hard, and that's not wrong, but throwing the baby out with the bath is probably not
         the most effective first step though. But here we are, and we need to manually numbers these
         entries, and manually keep them in order. -->
        <p class="text-2xl font-semibold">
          1. Download and install <a class="underline text-blue" href="https://downloads.amplio.org/software/index.html"  target="_blank">Amplio Software</a>. This installer includes:
        </p>

        <ul class="pl-10 pb-5 text-2xl">
          <!--li class="block">
            < !-- We do not make Java available to the user, and they don't have to do anything, so why show it? -- >
            <span class="inline-flex items-center">
              <font-awesome-icon icon="check" class="w-4 h-4 pr-3 text-gray-500" />
              Java
            </span>
          </li-->
          <li class="block">
            <span class="inline-flex items-center">
              <font-awesome-icon icon="check" class="w-4 h-4 pr-3 text-gray-500" />
              Audio Content Manager
            </span>
          </li>
          <li class="block">
            <span class="inline-flex items-center">
              <font-awesome-icon icon="check" class="w-4 h-4 pr-3 text-gray-500" />
              Talking Book Loader
            </span>
          </li>
        </ul>

        <p class="text-2xl font-semibold pb-5">
          2. Download and install <a class="underline text-blue" href="https://www.audacityteam.org/download/" target="_blank">Audacity</a>
        </p>

        <footer class="mt-10 text-center">
          <v-button
            tag="a"
            href="https://amplio.moodlecloud.com/"
            target="_blank"
            text="Go to step 2: Learning Portal"
            class="py-4 text-xl cursor-pointer"
          />
        </footer>
      </div>
    </section>
  </main>
</template>
