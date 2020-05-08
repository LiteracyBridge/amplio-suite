<template>
  <div class="container mx-auto text-center">
    <div class="grid grid-cols-3 gap-10">
      <Box img="/img/plan.png" title="1. Plan and Prepare">
        <p class="text-justify">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled it
          to make a type specimen book
        </p>
      </Box>

      <Box img="/img/learning.png" title="2. Learning Portal">
        <p class="text-justify">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled it
          to make a type specimen book
        </p>
      </Box>

      <Box img="/img/analytics.png" title="3. Analytics Dashboard">
        <p class="text-justify">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled it
          to make a type specimen book
        </p>
      </Box>
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
