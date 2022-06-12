<template>
    <main class="container mx-auto">
        <div class="py-6 px-4 flex justify-start">
            <h1 class="text-2xl text-blue">{{ programName }} Analytics</h1>
        </div>

        <div class="mb-4 pb-4 rounded-md shadow-box border-2">
            <!-- header class="p-4 text-white text-xl text-center font-bold uppercase bg-amplio-green rounded-t-md">
                <h2>Tableau Analytics</h2>
            </header -->

            <div class='tableauPlaceholder' style='width: 1200px; height: 1030px;'>
                <object class='tableauViz' width='1200' height='1030' style='display:none;'>
                    <param name='host_url' value='https%3A%2F%2F10ay.online.tableau.com%2F?:embed=y'/>
                    <param name='embed_code_version' value='3'/>
                    <param name='site_root' value='t&#47;amplio'/>
                    <param name='name' value='Ready2Read&#47;Dashboard1'/>
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
    },
    components: {},
    data() {
        return {}
    },
    created() {
        this.fetchProgram(this.programId)
    },
    methods: {
        ...mapActions('program', [
            'fetchProgram'
        ]),
    },
    mounted() {
        let tableauScript = document.createElement('script');
        tableauScript.setAttribute('src', 'https://10ay.online.tableau.com/javascripts/api/viz_v1.js');
        document.head.appendChild(tableauScript);
    },

}
</script>
