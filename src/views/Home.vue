<template>
  <div class="container mx-auto text-center">

    <h1 class="my-20 text-4xl text-blue font-semibold">
      Welcome to Amplio Jenny!
    </h1>

    <div class="grid grid-cols-3 gap-10">
      <router-link :to="{ name: 'Step-1' }">
        <Box img="/img/plan.png" title="1. Plan and Prepare">
          <p class="text-lg text-justify">
            Define your program specification and complete installation of required tools
          </p>
        </Box>
      </router-link>

      <a href="https://amplio.moodlecloud.com/" target="_blank">
        <Box img="/img/learning.png" title="2. Learning Portal">
          <p class="text-lg text-justify">
            Access learning portal, job aids and community of practice
          </p>
        </Box>
      </a>

      <a href="https://dashboard.amplio.org/" target="_blank">
        <Box img="/img/analytics.png" title="3. Analytics Dashboard">
          <p class="text-lg text-justify">
            Monitor user engagement and feedback through the Amplio Dashboard
          </p>
        </Box>
      </a>
    </div>
  </div>
</template>

<script>
import Box from '@/components/Box'

export default {
  components: {
    Box
  }
}
</script>
