<template>
    <main class="container mx-auto">
        <div class="py-6 px-4 flex justify-start">
            <h1 class="text-2xl text-blue">{{ programName }} Analytics</h1>
        </div>

        <div id="tableauHolder" :class="tableauVisibility">
            <tableau-viz id="tableauViz"
                         toolbar="hidden">
            </tableau-viz>
        </div>
        <div class="py-6 px-4 flex justify-start">
            <h1 class="text-2xl text-blue" :class="messageVisibility">Tableau Analytics for this program are not available at the present time.</h1>
        </div>

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
            return `https://10ay.online.tableau.com/t/amplio/views/${this.programId}/Dashboard1?:showAppBanner=false&:display_count=n&:showVizHome=n&:origin=viz_share_link`;
        },
        tableauVisibility() {
            const gotJwt = !(!this.jwt || this.jwt['error']==="Not found");
            return gotJwt ? '' : 'visually_hidden';
        },
        messageVisibility() {
            // Show when "jwt" is an error message.
            const showMessage = this.jwt && this.jwt.error;
            return showMessage ? '' : 'visually_hidden';
        },
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
    },
    async mounted() {
        this.jwt = null; // hide message while attempting fetch of jwt
        this.jwt = await getTableauJwt(this.programId);
        const viz = document.getElementById("tableauViz");
        viz.token = this.jwt;
        viz.src = this.workbook;
    },
    methods: {
        ...mapActions('program', [
            'fetchProgram'
        ]),
    },

}
</script>
