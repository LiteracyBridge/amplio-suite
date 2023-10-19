<template>
    <section class="relative min-h-200-px p-6 pt-0">
        <loading v-if="isLoading" class="-ml-6 rounded-b-lg"/>

        <monitor-header
            title="Collections"
            :description="description"
        />

        <div class="min-h-200-px my-5">
            <!-- Separater line between heading and content -->
            <p class="-mx-6 mb-2 px-6 bg-gray-400 text-xl text-left border-2 border-gray-600"/>

            <a-data-table :tableData="tableData" :columnLabels="columnLabels">

            </a-data-table>
        </div>

        <!-- For modal components -->
    </section>
</template>

<script>
import {mapState, mapActions} from 'pinia'

import { getTbStatusBy } from '@/api/generalQueries.api'
import ADataTable from '@/components/ADataTable'
import Loading from '@/components/Loading.vue'
import MonitorHeader from '@/components/MonitorHeader'

export default {
    props: ['programId'],
    created() {
        this.getStatus(this, this.programId);
        // this.tableData = this.deployments
        this.columnLabels = {
            // These get concatenated into "recipient":
            // region: 'Region',
            // district: 'District',
            // communityname: 'Community',
            // groupname: 'Group',
            // agent: 'Agent',
            // language: 'Language',
            recipient: 'Recipient',
            talkingbookid: 'TB ID',
            deployment_num: 'Current Content Deployment',
            deployment_time: 'Date of Last Content Update',
            deployment_user: 'User',
            // collection_num: 'Latest Collection',
            collection_time: 'Date of Last Data Collection',
            collection_user: 'User',
        };
    },

    data() {
        return {
            description: "Talking Book Stats & UF Collection Activity",

            tableData: null,
            columnLabels: null,
            isLoading: true,
        }
    },
    computed: {
        ...mapState('programspec', {
            'status': (state) => state.status,

            'programName': (state) => state.general.name,
        }),
    },
    components: {
        ADataTable,
        Loading,
        MonitorHeader,
    },
    methods: {
        ...mapActions('ui', [
            'setModal',
            'closeModal'
        ]),
        getStatus: async (self, programid) => {
            let status = await getTbStatusBy(programid, 'ByTb');
            // Find which recipient columns have multiple values.
            let needed = [];
            ['region', 'district', 'communityname', 'groupname', 'agent', 'language'].forEach(col => {
                let v = status[0][col];
                if (status.some(row=>row[col]!==v)) {
                    needed.push(col);
                }
            });
            status.forEach(row=>{
                let values = needed.map(col=>(row[col] || '-'));
                row.recipient = values.join('/')
            });
            // self.columnLabels['recipient'] = self.columnLabels['recipient'] + `(${needed.join('/')})`;
            self.tableData = status;
            self.isLoading = false;
        }
    },

}
</script>
