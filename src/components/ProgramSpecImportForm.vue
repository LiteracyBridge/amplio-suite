<template>
    <div class="items-center text-left">
        <p>Choose the spreadsheet to upload here. Next, you'll see the differences from the current Program
            Specification. You will have an opportunity to approve or cancel the import.</p>
        <!--Choose file to upload-->
        <form enctype="multipart/form-data" novalidate class="mt-2">
            <div class="dropTarget">
                <input type="file"
                       @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                       accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                       class="input-file h-full">
                <div v-if="file != null">
                    <p v-if="contentHidden"></p>
                    <p v-else>{{ file.name }}</p>
                </div>
                <p v-else>
                    Drag your Program Specification file here<br> or click to browse
                </p>
            </div>
        </form>
    </div>
</template>

<script>

export default {
    name: "ProgramSpecImportForm",
    props: ['contentHidden'],

    data: () => ({
        file: null,
    }),

    methods: {
        filesChange(fieldName, fileList) {
            // file was dropped or selected via 'file open' dialog.
            this.file = (fileList.length === 0) ? null : fileList[0];
            this.$emit('onFileSelected', this.file);
        },
    },
}
</script>

<style scoped>
.dropTarget {
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: #fff7ed; /* bg-orange-50 */
    color: dimgray;
    /*padding: 10px 10px;*/
    min-height: 200px; /* minimum height */
    position: relative;
    cursor: pointer;
}

.input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 100%;
    position: absolute;
    cursor: pointer;
}

.dropTarget:hover {
    background-color: #ffedd5; /* bg-orange-100 when mouse over to the drop zone, change color */
}

.dropTarget p {
    font-size: 1.5em;
    text-align: center;
    padding: 50px 0;
}
</style>
