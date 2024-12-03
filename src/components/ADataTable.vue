/*eslint disable */
<template>
    <div class="">

        <div class="grid" :style="gridColsStyle">
            <div v-for="label in tableColumnLabels" :key="label" class="text-left font-bold border break-words px-2">
                {{label}}
            </div>

            <template v-for="row in tableDataRows" class="text-left">
                <div v-for="(col) in tableColumnKeys" :key="row[col]" class="border break-words px-1">{{row[col]}}</div>

            </template>

        </div>

    </div>
</template>

<script>


export default {
    props: {
        tableData: {
            type: Array, // of objects
            required: true
        },
        columnLabels: {
            type: Object,
            required: false,
            default: null
        },
    },

    computed: {
        tableDataRows() {
            return this.tableData;
        },
        tableColumnKeys() {
            return this.columnLabels ? Object.keys(this.columnLabels) : Object.keys(this.tableData[0]);
        },
        tableColumnLabels() {
            const getLabels = (obj) => {
                return Object.keys(obj).map(k=>obj[k])
            }
            return this.columnLabels ? getLabels(this.columnLabels) : getLabels(this.tableData)
        },
        numColumns() {
            return this.tableColumnKeys.length;
        },
        gridColsStyle() {
            return `grid-template-columns: repeat(${this.numColumns}, auto)`; // minmax(0, 1fr));`
        }

    },


}

</script>
