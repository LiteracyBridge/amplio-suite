<template>
  <div>
    <label class="visually_hidden" for="language_input">
      Select { multiple ? 'multiple' : 'one'} language
    </label>

    <Select
      id="language_input"
      ref="languages"
      :mode="multiple ? 'multiple' : null"
      :value="languages"
      :options="getLanguages"
      :field-names="{ label: 'name', value: 'code' }"
      :placeholder="placeholder"
      @select="emit('languageSelected', $event)"
      @deselect="emit('languageDeleted', $event)"
      :filter-option="true"
      :option-filter-prop="'name'"
      :show-search="true"
      :loading="store.loading"
    >
    </Select>
  </div>
</template>

<script setup lang="ts">
import { RequestCacheKeys } from "@/models/constants";
import type { Language } from "@/models/language";
import { useLanguagesStore } from "@/store/languages";
import { useProgramSpecStore } from "@/store/programspec";
import { Select, SelectOption, Spin } from "ant-design-vue";
import { computed, onMounted, ref, watch } from "vue";
import { useRequest } from "vue-request";

const props = defineProps<{
  options?: Language[];
  languages?: string | string[];
  labelBy?: string;
  autofocus?: boolean;
  multiple: boolean;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: "languageSelected", value: string): void;
  (e: "languageDeleted", value: string): void;
}>();

const store = useLanguagesStore();

const selectedLanguages = ref([]);

onMounted(async () => {
  await store.fetchLanguages();
  selectedLanguages.value = [...(props.languages || [])];
});

const getLanguages = computed(() => {
  return (props.options || []).length > 0 ? props.options : store.languages;
});
</script>
