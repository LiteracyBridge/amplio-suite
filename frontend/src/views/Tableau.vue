<template>
    <main class="container mx-auto">
        <div class="py-6 px-4 flex justify-start">
            <h1 class="text-2xl text-blue">{{ programName }} Analytics</h1>
        </div>

        <tableau-viz id="tableauViz"
                     toolbar="hidden">
        </tableau-viz>

    </main>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {getTableauJwt} from '@/api/tableau.api'


export default {
    props: ['programId'],
    computed: {
        ...mapState('program', [
            'programName',
        ]),
        workbook() {
            let url = `https://10ay.online.tableau.com/t/amplio/views/${this.programId}/Dashboard1?:showAppBanner=false&:display_count=n&:showVizHome=n&:origin=viz_share_link`;
            console.log(`URL for Tableau Viz: ${url}`);
            return url;
        }
    },
    components: {},
    data() {
        return {
            jwt: null,
        }
    },
    created() {
        let tableauScript = document.createElement('script');
        tableauScript.setAttribute('type', 'module');
        tableauScript.setAttribute('src', 'https://online.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js');
        document.head.appendChild(tableauScript);
        console.log('loaded tableau-viz');
    },
    async mounted() {
        this.jwt = await getTableauJwt(this.programId);
        const viz = document.getElementById("tableauViz");
        viz.token = this.jwt;
        viz.src = this.workbook;
        console.log(`Tableau mounted. URL: ${this.workbook}`);
    },
    methods: {
        ...mapActions('program', [
            'fetchProgram'
        ]),
    },

}
</script>
