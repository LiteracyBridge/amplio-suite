<template>
  <Box
    next="Step-2"
    title="Let’s start by getting your program details. If your
    program details change later, you can always update the program
    specification to match your requirements."
  >
    <p id="programName" class="text-2xl font-semibold">
      What is your program name?
    </p>
    <input
      type="text"
      aria-labelledby="programName"
      placeholder="Enter Program Name"
      class="mt-2 px-5 py-1 text-base rounded border border-solid border-gray-500"
    >
  </Box>
</template>

<script>
import Box from '@/components/SetupBox'

export default {
  components: {
    Box
  }
}
</script>
