<script setup lang="ts">
import type { Survey } from "@/models/survey";
import { Card, CardMeta } from "ant-design-vue";

const props = defineProps<{
  survey: Survey;
}>();

const $emit = defineEmits<{
  (e: "click", survey: Survey): void;
}>();
</script>

<template>
  <Card
    :hoverable="true"
    type="inner"
    size="small"
    class="inline"
    @click="$emit('click', survey)"
  >
    <CardMeta :title="survey.name" :description="survey.description"> </CardMeta>

    <div class="mt-4">
      <span>Deployment: </span>{{ survey.deployment.deployment }}
      <br />
      <p><span>Language: </span>{{ survey.language }}</p>
      <p><span>Questions: </span>{{ survey.questions?.length || 0 }}</p>
    </div>
  </Card>
</template>
