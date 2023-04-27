import mutations from './mutations'
import actions from './actions'

export const getDefaultGeneral = () => ({
        program_id: "TEST",
        name: "My Test Program",
        country: "United States of America",
        region: ["WA"],
        languages: ["en"],
        deployments_count: 1,
        deployments_length: "one_year",
        deployments_first: "2021-11-27",
        listening_models: ["Other"],
        feedback_frequency: "annually",
        sustainable_development_goals: [1],
        direct_beneficiaries_map: {
            male: "Number of Male",
            female: "Number of Female",
            youth: "Number of Youth"
        },
        direct_beneficiaries_additional_map: {},
        tableau_id: null
    });


export const getDefaultState = () => {
    const defaultState = {
        changed: false,
        status: "",
        programId: "",
        deployments: [],
        recipients: [],
        general: {},

        filterText: '',
        sortTable: {
            by: 'region',
            descending: true
        },

    };
    return defaultState;
};

export default {
    namespaced: true,

    state: getDefaultState(),
    mutations,
    actions,

    getters: {
        labelUsed: (state) => {
            const labels = new Set()
            state.recipients.forEach(recipient => {
                const keys = Object.keys(recipient.direct_beneficiaries_additional);
                keys.forEach(label => labels.add(label));
            })

            return Array.from(labels)
        },

        directBeneficiariesLabels: state => {
            const keys = Object.keys(state.general.direct_beneficiaries_map);
            return keys.map(key => ({key, value: state.general.direct_beneficiaries_map[key]}));
        },
        directBeneficiariesAdditionalLabels: state => {
            const keys= Object.keys(state.general.direct_beneficiaries_additional_map);
            return keys.map(key => ({key, value: state.general.direct_beneficiaries_additional_map[key]}));
        },

        filteredRecipients: (state) => {
            let recipients = [...state.recipients]

            // Sort
            const column = state.sortTable.by
            const direction = state.sortTable.descending ? 1 : -1
            recipients = recipients.sort((a, b) =>
                direction * a[column].toString().localeCompare(b[column].toString())
            )

            // Filter
            let text = state.filterText
            recipients = recipients.filter(reci =>
                Object.values(reci)
                    .filter(val => val !== null)
                    .some(val => val.toString().toLowerCase().includes(text.toLowerCase()))
            )

            // return recipients.slice(0, state.recipientsToShow)
            return recipients;
        },

        newRecipient: () => {
            let newRecipient = {
                recipientid: null,

                communityname: '',
                groupname: '',
                region: '',
                district: '',
                numtbs: null,
                supportentity: '',
                language: '',
                agent: '',
                numhouseholds: 0,
                group_size: 0,
                deployments: [],
                listening_model: '',
                agent_gender: '',
                direct_beneficiaries: null,
                direct_beneficiaries_additional: {},
                indirect_beneficiaries: null,
                variant: '',
                component: '',
            };
            return newRecipient;
        }

    },
}
