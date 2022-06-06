<template>
    <div class="items-center text-left" style="min-height: 200px;">
        <div v-if="contentHidden" class="h-20">

        </div>
        <div v-else>
            <p class="text-xl">Differences from the published Program Specification:</p>
            <p v-if="diffs.length===0">No differences found.</p>
            <div v-else>
                <p v-for="(diff) in diffs" :key="diff">
                    {{ diff }}
                </p>
            </div>
        </div>

    </div>
</template>

<script>

export default {
    name: "ProgramSpecImportForm",
    props: {
        contentHidden: {
            type: Boolean,
            default: false
        },
        diffs: {
            type: Array,
            required: true
        },
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
    height: 100%;
    position: absolute;
    cursor: pointer;
}

/*
.dropTarget:hover {
  background: lightblue; /* when mouse over to the drop zone, change color
}
*/
.dropTarget p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
}
</style>
