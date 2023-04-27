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

<!--suppress CssUnusedSymbol -->
<style scoped>
/* Used to show/hide the TableauViz component. */
.noTableau {
    display: none ;
}
</style>

<script>
import {mapState} from 'vuex'
import {getTableauJwt} from '@/api/tableau.api'


export default {
    props: ['programId'],
    computed: {
        ...mapState('programspec', {
            programName: (state)=>state.general.name,
        }),
        workbook() {
            return `https://10ay.online.tableau.com/t/amplio/views/${this.programId}/Dashboard1?:showAppBanner=false&:display_count=n&:showVizHome=n&:origin=viz_share_link`;
        },
        tableauVisibility() {
            const gotJwt = !(!this.jwt || this.jwt['error']==="Not found");
            // 'visually_hidden' leaves the TableauWiz in a state from which it never recovers, so it never appears.
            // Instead, use the traditional "display: none;" style.
            return gotJwt ? '' : 'noTableau';
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

}
</script>
