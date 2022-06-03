<template>
  <div class="items-center text-left">
    <!--UPLOAD-->
    <form enctype="multipart/form-data" novalidate>
      <div class="dropTarget bg-cyan-100">
        <input type="file"
               @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
               accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
               class="input-file">
        <p v-if="file != null">
          {{ file.name }}
        </p>
        <p v-else>
          Drag your Program Specification file here<br> or click to browse
        </p>
      </div>
    </form>

    <footer class="flex justify-end gap-4 mt-5">
      <VButton
        type="success"
        label="Upload"
        :disabled="!file"
        @click="$emit('ok', file)"
      />
      <VButton
        label="Cancel"
        variant="warning"
        @click="$emit('cancel')"
      />
    </footer>

  </div>
</template>

<script>

import VButton from '@/components/VButton'

export default {
  name: "ProgramSpecImportForm",
  components: {
    VButton,
  },

  data: () => ({
    file: null,
  }),

  methods: {
    filesChange(fieldName, fileList) {
      // file was dropped or selected via 'file open' dialog.
      this.file = (fileList.length===0) ? null : fileList[0];
    },
  },
  mounted() {
    this.file = null;
  },
}
</script>

<style scoped lang="scss">
.dropTarget {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  /*background: lightcyan;*/
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 100px;
  position: absolute;
  cursor: pointer;
}

.dropTarget:hover {
  background: lightblue; /* when mouse over to the drop zone, change color */
}

.dropTarget p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
</style>
