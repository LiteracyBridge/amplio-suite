<template>
  <div>
    <label class="visually_hidden" for="language_input">
      Select { multiple ? 'multiple' : 'one'} language
    </label>

    <!-- :value = initially selected values
         :options = set of all selectable values -->
    <Select
      v-if="store.languages.length > 0"
      id="language_input"
      ref="languages"
      :mode="multiple ? 'multiple' : null"
      :value="languages"
      :options="filteredLanguageOptions"
      :field-names="{ label: 'name', value: 'code' }"
      :placeholder="placeholder"
      @select="onLanguageSelected"
      @deselect="onLanguageDeleted"
      @search="onSearch"
      :show-search="true"
    >
      <!-- <SelectOption
        v-for="item in filteredLanguageOptions"
        :value="item.code"
        :label="item.name"
        >{{ item.name }}</SelectOption
      > -->
      <!-- <template slot="option" slot-scope="props">
        <span>{{ props.option.name }}</span>
      </template> -->
    </Select>

    <font-awesome-icon
      v-else
      icon="spinner"
      size="2x"
      pulse
      class="block w-10 h-10 mt-2 text-left"
    />
  </div>
</template>

<script setup lang="ts">
import { useLanguagesStore } from "@/store/languages";
import { Select, SelectOption } from "ant-design-vue";
// import Multiselect from "vue-multiselect";
// import { mapState } from "pinia";
import { computed, onMounted, ref } from "vue";

const props = defineProps<{
  options?: string[];
  languages: string | string[];
  onLanguageSelected: (value: string) => void;
  onLanguageDeleted: (value: string) => void;
  labelBy?: string;
  autofocus?: boolean;
  multiple: boolean;
  placeholder?: string;
}>();

const store = useLanguagesStore();

const allOptions = ref([]),
  filteredLanguageOptions = ref([]),
  selectedLanguages = ref([]);

function onSearch(query: string) {
  query = query.trim().toLowerCase();

  filteredLanguageOptions.value = allOptions.value.filter((lang) =>
    lang.name.toLowerCase().includes(query)
  );
}

/**
 * Map a language code to a dict of {code:language-code, name:language-name, coment:whatever}
 * If a code is not found, return {code:the-code, name:the-code, comment:the-code}
 * @param codes
 * @returns {*}
 */
function mapLanguageCodesToInfo(codes: any[]) {
  const infos = codes.map((lc) => {
    let languageInfo = store.languages.find((languageInfo) => languageInfo.code === lc);
    if (!languageInfo) {
      languageInfo = { code: lc, name: lc, comment: lc };
    }
    return languageInfo;
  });
  return infos;
}

// const selectedLanguages = computed(() => {
//   // List of initially selected languages, expanded to 'supportedLanguages' format, [{code:'en', comment:...}]
//   //   if (props.languages == null) {
//   //     return [];
//   //   }
//   //   let result = [];
//   //   try {
//   //     const languageCodes = Array.isArray(props.languages)
//   //       ? props.languages
//   //       : [props.languages];
//   //     // map from codes to full info.
//   //     result = mapLanguageCodesToInfo(languageCodes);

//   //     if (result.length === 0) {
//   //       result = [];
//   //     }
//   //   } catch (ignored) {
//   //     result = [];
//   //   }
//   return [...(props.languages || [])];
// });

onMounted(() => {
  if (props.options != null) {
    allOptions.value = mapLanguageCodesToInfo(props.options);
    filteredLanguageOptions.value = [...allOptions.value];
  } else {
    allOptions.value = [...store.languages];
    filteredLanguageOptions.value = [...store.languages];
  }

  selectedLanguages.value = [...(props.languages || [])];
});
// export default {
//   props: {
//     options: {
//       // A list of language codes: ['en', 'fr'].
//       type: Array,
//       default: null,
//     },
//     languages: {
//       // The initially selected language codes: ['en']
//       required: true,
//       type: [Array, String],
//     },
//     onLanguageSelected: {
//       required: true,
//       type: Function,
//     },
//     onLanguageDeleted: {
//       required: true,
//       type: Function,
//     },
//     labelBy: {
//       type: String,
//       default: "code",
//     },
//     autofocus: {
//       type: Boolean,
//       default: false,
//     },
//     multiple: {
//       type: Boolean,
//       default: true,
//     },
//     placeholder: {
//       type: String,
//       default: "Type a language to add",
//     },
//   },

//   components: {
//     // Multiselect,
//     Select,
//     SelectOption,
//   },

//   computed: {
// ...mapState(useLanguagesStore, {
//   // List of  [{code:'en', comment:'Popular language', name:'English'}, {code:'zed', comment:'End of the line', name:'Zebra'}]
//   supportedLanguages: (state) => state.languages,
// }),

// selectedLanguages() {
//   // List of initially selected languages, expanded to 'supportedLanguages' format, [{code:'en', comment:...}]
//   if (!this.languages || this.languages === "") {
//     return [];
//   }
//   let result = [];
//   try {
//     const languageCodes = Array.isArray(this.languages)
//       ? this.languages
//       : [this.languages];
//     // map from codes to full info.
//     result = this.mapLanguageCodesToInfo(languageCodes);
//     if (result.len === 0) result = [];
//   } catch (ignored) {
//     result = [];
//   }
//   return result;
// },
//   },

//   watch: {
//     supportedLanguages: {
//       immediate: true,
//       handler() {
//         if (this.supportedLanguages.length === 0) return;
//         if (this.autofocus && this.supportedLanguages.length > 0) {
//           this.$nextTick(() => {
//             this.$refs.languages.$refs.search.focus();
//           });
//         }
//         // Is there an options property? (list of language codes from which user can select)
//         if (this.options) {
//           this.allOptions = this.mapLanguageCodesToInfo(this.options);
//           this.filteredLanguageOptions = [...this.allOptions];
//         } else {
//           this.allOptions = [...this.supportedLanguages];
//           this.filteredLanguageOptions = [...this.supportedLanguages];
//         }
//       },
//     },
//   },

//   data() {
//     return {
//       allOptions: [],
//       filteredLanguageOptions: [],
//     };
//   },

//   methods: {
//     onSearch(query) {
//       query = query.trim().toLowerCase();

//       this.filteredLanguageOptions = this.allOptions.filter((lang) =>
//         lang.name.toLowerCase().includes(query)
//       );
//     },

//     /**
//      * Map a language code to a dict of {code:language-code, name:language-name, coment:whatever}
//      * If a code is not found, return {code:the-code, name:the-code, comment:the-code}
//      * @param codes
//      * @returns {*}
//      */
//     mapLanguageCodesToInfo(codes) {
//       const infos = codes.map((lc) => {
//         let languageInfo = this.supportedLanguages.find(
//           (languageInfo) => languageInfo.code === lc
//         );
//         if (!languageInfo) {
//           languageInfo = { code: lc, name: lc, comment: lc };
//         }
//         return languageInfo;
//       });
//       return infos;
//     },
//   },
// };
</script>
