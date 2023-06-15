<template>
    <div class="items-center text-left" style="min-height: 200px;">
        <div v-if="contentHidden" class="h-20">

        </div>
        <div v-else>
            <p>Preparing to download the UF Questionnaire for <span class="outline-box">{{ programName }}</span>
                ({{ programId }}), deployment number <span class="outline-box">{{ deploymentNumber }}</span>,
                <span class="outline-box">{{ languageName }}</span> language.</p>
        </div>

    </div>
</template>

<script>

export default {
    name: "UfQuestionnaireDownload",
    props: {
        programName: {
            type: String,
        },
        programId: {
            type: String,
        },
        deploymentNumber: {
            type: Number,
        },
        languageName: {
            type: String,
        },
        contentHidden: {
            type: Boolean,
            default: false
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
