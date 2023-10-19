<template>
    <section class="relative min-h-200-px p-6 pt-0">
        <loading v-if="status !== 'success'" class="-ml-6 rounded-b-lg"/>

        <monitor-header
            title="Collections"
            :description="description"
        />

        <div class="min-h-200-px my-5">
            <!-- Separater line between heading and content -->
            <p class="-mx-6 mb-2 px-6 bg-gray-400 text-xl text-left border-2 border-gray-600"/>

            <h2>Talking Book Collection Activity goes here</h2>
        </div>

        <!-- For modal components -->
    </section>
</template>

<script>
import { mapState, mapActions } from 'pinia'

import Loading from '@/components/Loading.vue'
import MonitorHeader from '@/components/MonitorHeader'

export default {
    props: ['programId'],
    computed: {
        ...mapState('programspec', {
            'status': (state)=>state.status,

            'programName': (state)=>state.general.name,
        }),
    },
    components: {
        Loading,
        MonitorHeader,
    },
    data () {
        return {
            description: "Talking Book Collection Activity",
        }
    },
    methods: {
        ...mapActions('ui', [
            'setModal',
            'closeModal'
        ]),
    },

}
</script>
