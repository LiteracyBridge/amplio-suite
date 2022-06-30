<template>
    <main class="container mx-auto">
        <div class="py-6 px-4 flex justify-start">
            <h1 class="text-2xl text-blue">{{ programName }} Analytics</h1>
        </div>

        <div class="mb-4 pb-4 rounded-md shadow-box border-2">
            <div id="vizContainer" class='tableauPlaceholder' style='width: 1200px; height: 795px;'>
                <object class='tableauViz' width='1200' height='795' style='display:none;'>
                    <param name='host_url' value='https://10ay.online.tableau.com/'/>
                    <param name='embed_code_version' value='3'/>
                    <param name='site_root' value='/t/amplio'/>
                    <param name='name' :value="dashboardName"/>
                    <param name='tabs' value='no'/>
                    <param name='toolbar' value='yes'/>
                    <param name='showAppBanner' value='false'/>
                </object>
            </div>
        </div>
    </main>
</template>

<script>
import {mapState, mapActions} from 'vuex'

export default {
    props: ['programId'],
    computed: {
        ...mapState('program', [
            'programName',
        ]),
        dashboardName() {
            if (this.programId === 'ILC-MW-R2R')
                return 'Ready2Read/Dashboard1';
            else if (this.programId === 'LANDESA-LR')
                return 'LandesaLandRightsProjectDashboard2/Dashboard1';
            else
                return 'AmplioDashboard7/Dashboard1';
        }
    },
    components: {},
    data() {
        return {}
    },
    created() {
        let tableauScript = document.createElement('script');
        tableauScript.setAttribute('src', 'https://10ay.online.tableau.com/javascripts/api/viz_v1.js');
        document.head.appendChild(tableauScript);
    },
    methods: {
        ...mapActions('program', [
            'fetchProgram'
        ]),
    },

}
</script>
