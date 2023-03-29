<template>
    <main class="container mx-auto text-center">
        <header class="py-16 text-blue font-semibold">
            <h1 class="text-4xl">
                Hello, <span class="capitalize">{{ user.name }}</span>, welcome to the Amplio Suite!
            </h1>
            <h2 v-if="status === 'success'" class="text-2xl">Select a Program Specification</h2>
            <h2 v-else-if="status === 'error'" class="text-2xl">Error</h2>
            <h2 v-else class="text-2xl">Loading programs...</h2>
        </header>

        <font-awesome-icon
            v-if="!['success', 'error'].includes(status)"
            icon="spinner"
            size="4x"
            pulse
            class="mx-auto w-20 h-20"/>

        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 pb-16">
            <div
                v-for="(programId, index) in programsList"
                :key="index"
                tabindex="0"
                class="p-6 h-full bg-white rounded-lg shadow-box cursor-pointer hover:shadow-hover"
                @click="selectProgram(programId)"
                @keyup.enter="selectProgram(programId)"
                @keyup.space="selectProgram(programId)"
            >
                <img class="mx-auto" src="/img/program.png" alt="">
                <h3 class="py-4 " v-if="showProgramIds">
                    <span class="font-bold">{{ programName(programId) }}</span><br/>
                    <span class="text-sm font-weight-light text-gray-600">{{ programId }}</span>
                </h3>
                <h3 class="py-4 font-bold" v-else>
                    {{ programName(programId) }}
                </h3>
            </div>
        </div>

        <div class="text-left text-sm text-gray-500">
            <v-tooltip text="The Program ID is used by Amplio support personnel, but is not needed for most functions.">
                <input type="checkbox" id="checkbox" v-model="showProgramIds">
                <label for="checkbox"> Also show the "Program ID" of the programs.</label>
            </v-tooltip>
        </div>

    </main>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import VTooltip from '@/components/VTooltip'

export default {
    components: {
        VTooltip,
    },
    computed: {
        ...mapState('programs', [
            'status',
            'programs',
            'programNames',
        ]),
        ...mapState('account', [
            'user'
        ]),
        programsList() {
            // Map from name to programid
            let idsMap = {}
            this.programs.forEach(id=>idsMap[this.programNames[id]] = id);
            // names in sorted order
            let names = Object.values(this.programNames).sort();
            // ids in sorted-name order
            let ids = names.map(name=>idsMap[name]);
            return ids;
        },
    },
    watch: {
        'programs': {
            handler(programs) {
                if (!programs) return
                if (programs.length == 1) this.selectProgram(programs[0])
            },
            immediate: true
        },
        'status': {
            handler(status) {
                if (status === 'error') this.handleLogout()
            }
        }
    },
    created() {
        this.closeNotification()
        this.getProgramsList()
    },
    methods: {
        ...mapActions('ui', [
            'closeNotification'
        ]),
        ...mapActions('programs', [
            'getProgramsList'
        ]),
        ...mapActions('account', [
            'logout'
        ]),
        programName(programId) {
            return this.programNames[programId];
        },
        async selectProgram(programId) {
            this.$router.push(`/programs/${programId}`)
        },
        handleLogout() {
            this.logout()
            this.$router.go()
        }

    },
    data: () => ({
        showProgramIds: false,
    }),
}
</script>
