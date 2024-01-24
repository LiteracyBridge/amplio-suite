<template>
  <div>
    <label class="visually_hidden" for="language_input">
      Select { multiple ? 'multiple' : 'one'} language
    </label>

    <Select
      v-if="getLanguages.length > 0"
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
      :loading="loading || store.loading"
    >
    </Select>
  </div>
</template>

<script setup lang="ts">
import { RequestCacheKeys } from "@/models/constants";
import { useLanguagesStore } from "@/store/languages";
import { Select, SelectOption, Spin } from "ant-design-vue";
import { computed, onMounted, ref, watch } from "vue";
import { useRequest } from "vue-request";

const props = defineProps<{
  options?: string[];
  languages: string | string[];
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

const allOptions = ref([]),
  selectedLanguages = ref([]);

// Download languages
const { loading } = useRequest(store.fetchLanguages, {
  cacheKey: RequestCacheKeys.supported_languages,
  cacheTime: 1000 * 60 * 60 * 24 * 7, // 1 week
  defaultParams: [],
  onSuccess: (data) => {
    store.languages = data;
  },
});

onMounted(() => {
  if (props.options != null) {
    allOptions.value = store.mapLanguageCodesToInfo([...props.options]);
  }

  selectedLanguages.value = [...(props.languages || [])];
});

watch(
  props,
  (newProps, _old) => {
    if (newProps.options != null) {
      allOptions.value = store.mapLanguageCodesToInfo([...newProps.options]);
    }
  },
  { deep: true }
);

const getLanguages = computed(() => {
  return (props.options || []).length > 0 ? allOptions.value : store.languages;
});
</script>
