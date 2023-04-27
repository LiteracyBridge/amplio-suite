<template>
    <section class="relative min-h-200-px p-6 pt-0">
        <loading v-if="status !== 'success'" class="-ml-6 rounded-b-lg"/>

        <!-- This is the common header, with program name, this panel's title, and save & discard buttons -->
        <program-header
            class="mb-4"
            title="Recipients"
            :changed="hasChanges"
            :canSave="canSave"
            :description="description"
            :onSaveChanges="onSaveChanges"
            :onDiscardChanges="onDiscardChanges"
        />

        <!-- Separater line between heading and content -->
        <p class="-mx-6 mb-2 px-6 bg-gray-400 text-xl text-left border-2 border-gray-600"/>

        <header class="w-full inline-flex items-center justify-between">
            <h2 class="visually_hidden">Recipients</h2>

            <VButton
                tag="span"
                label="+ Add Recipient"
                @click="addNewRecipient"
            />

            <div class="inline-flex">
                <form v-on:submit.prevent="fetchRecipients(programId)">
                    <v-input
                        type="text"
                        name="filterColumns"
                        placeholder="Filter columns"
                        iconRight="search"
                        mx="mx-2"
                        :value="filterText"
                        @input="setFilterText($event.target.value)"
                    />
                </form>
                <VButton
                    tag="span"
                    label="Reset Filter"
                    :disabled="!tableIsFilter"
                    @click="resetFilters"
                />
            </div>
        </header>

        <!--    <div v-if="status !== 'loading' && filteredRecipients.length === 0">-->
        <!--      <p>Add recipients here.</p>-->
        <!--    </div>-->

        <div v-if="filteredRecipients.length > 0" class="block pt-2 overflow-x-auto">
            <table class="w-full table-auto overflow-x-auto">
                <thead>
                <tr>
                    <th v-for="col in columns" :key="col.key" class="text-left border-2">
                        <v-tooltip :width="150" :text="`Sort ${sortTable.descending ? 'Ascending' : 'Descending'}`">
                            <button
                                class="flex gap-2"
                                style="white-space: nowrap;"
                                @click="setSortByColumn(col.key)"
                                @keyup.enter="setSortByColumn(col.key)"
                                @keyup.space="setSortByColumn(col.key)"
                            >
                                {{ col.label }}
                                <font-awesome-icon
                                    v-if="sortTable.by === col.key"
                                    :icon="sortTable.descending ? 'chevron-down' : 'chevron-up'"
                                />
                            </button>
                        </v-tooltip>
                    </th>
                    <th class="px-4 py-2 text-amplio-green border-b text-left border-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="(recipient, index) in filteredRecipients"
                    :key="recipient.recipientid"
                    :class="index % 2 === 0 ? '' : 'bg-gray-200'"
                    class="hover:bg-gray-400"
                    @dblclick="editRecipient(recipient, index)"
                >
                    <td
                        v-for="col in columns"
                        :key="`${index}-${col.key}`"
                        class="px-4 py-2 border-b"
                    >
                        {{ recipient[col.key] }}
                    </td>
                    <td class="px-4 border-b">
                        <div class="flex gap-1">
                            <v-tooltip :width="100" :text="`Edit`">
                                <VButton
                                    iconL="edit"
                                    :ariaLabel="`Edit recipient ${recipient.recipientid}`"
                                    @click="editRecipient(recipient)"
                                />
                            </v-tooltip>
                            <v-tooltip :width="100" :text="`Duplicate`">
                                <VButton
                                    iconL="copy"
                                    :ariaLabel="`Duplicate recipient ${recipient.recipientid}`"
                                    @click="duplicateRecipient(recipient)"
                                />
                            </v-tooltip>
                            <!-- <VButton
                              variant="warning"
                              iconL="trash-alt"
                              :ariaLabel="`Delete recipient ${recipient.id}`"
                              @click="onClickDelete(recipient.id)"
                            /> -->
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <!-- Edit modal -->
        <portal to="modalBody" v-if="showModal.edit">
            <program-recipients-form
                :recipient="recipientInEdit"
                :isDuplicateRecipient="isDuplicateRecipient"
                :invalidBeneficiaries="invalidBeneficiaries"
                @changed="onRecipientEdited"
            />
        </portal>

        <portal to="modalFooter" v-if="showModal.edit">
            <footer v-if="recipientInEdit" class="flex justify-end gap-4">
                <VButton
                    label="Cancel" variant="warning" @click="onCancelEdit"
                />
                <VButton
                    type="success" label="OK" :disabled="!recipientEdited || isDuplicateRecipient || invalidBeneficiaries"
                    @click="onAcceptEdit"
                />
                <!--        <VButton-->
                <!--          v-if="selectedRecipient.id" label="Close" variant="success" :disabled="recipientEdited" @click="onCloseModal"-->
                <!--        />-->
            </footer>
        </portal>

        <!-- Delete modal -->
        <portal to="modalBody" v-if="showModal.delete">
            <p class="text-xl">This recipient will be deleted.</p>
        </portal>

        <portal to="modalFooter" v-if="showModal.delete">
            <footer class="flex flex-row-reverse justify-between pt-20">
                <VButton
                    label="Confirm"
                    variant="warning"
                    @click="confirmDeleteRecipient"
                />
                <VButton
                    label="Cancel"
                    @click="onCloseModal"
                />
            </footer>
        </portal>

        <!-- Mandatory fields modal -->
        <portal to="modalBody" v-if="showModal.mandatory">
            <p class="text-xl">Please complete all of the mandatory fields.</p>
        </portal>

        <portal to="modalFooter" v-if="showModal.mandatory">
            <footer class="flex flex-row-reverse justify-between pt-20">
                <VButton
                    label="Close"
                    @click="onClickEdit(selectedRecipientId)"
                />
            </footer>
        </portal>
    </section>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'

import VInput from '@/components/VInput'
import VButton from '@/components/VButton'
import Loading from '@/components/Loading'
import VTooltip from '@/components/VTooltip'
import ProgramRecipientsForm from '@/components/ProgramRecipientsForm'
import {EventBus} from '@/event-bus'
import ProgramHeader from '@/components/ProgramHeader.vue';

const columns = [
    {label: 'Region/State', key: 'region'},
    {label: 'District/County', key: 'district'},
    {label: 'Community', key: 'communityname'},
    {label: 'Group', key: 'groupname'},
    {label: 'Agent', key: 'agent'},
    {label: 'Language', key: 'language'},
    {label: '# TBs', key: 'numtbs'}
]

export default {
    props: ['programId'],
    computed: {
        ...mapState('programspec', [
            'status',
            'changed',

            'sortTable',
            'filterText',

            'recipients',
        ]),
        ...mapGetters('programspec', [
            'filteredRecipients',
        ]),
        hasChanges() {
            return this.changed;
        },
        canSave() {
            return this.changed;
        },
        selectedRecipient() {
            return this.recipients.find(recipient => recipient.recipientid === this.selectedRecipientId)
        },
        tableIsFilter() {
            return this.sortTable.by !== '' || this.filterText !== ''
        },
        isRecipientInEditValid() {
            // nothing selected; can't be valid
            if (!this.recipientInEdit) return null

            const requiredFields = [
                'region', 'district', 'communityname',
                'language',
                // 'listeningModel', 'numTbs',
                // 'deployments', 'directBeneficiaries'
            ]

            const partial = requiredFields.map(field => {
                const value = this.recipientInEdit[field]
                if (typeof value === 'string' || value instanceof String) return value !== ''
                else if (typeof value === 'number') return value >= 0
                else if (Array.isArray(value)) return value.length > 0
            })

            return partial.every(Boolean)
        },
        isDuplicateRecipient() {
            // All the recipients are from the current program, so don't have a "program" property.
            // Construct a concatenation of country-region-district-communityname-groupname-agent-language
            function key(recipient) {
                return `${recipient.country}-${recipient.region}-${recipient.district}-` +
                    `${recipient.communityname}-${recipient.groupname}-${recipient.agent}-${recipient.language}`;
            }

            if (!this.recipientInEdit) return null

            const thisKey = key(this.recipientInEdit);
            // If the key matches any recipient with a different recipientid, then it is a duplicate recipient.
            let isDuplicate = false;
            this.recipients.forEach((recip) => {
                if (key(recip) === thisKey && recip.recipientid !== this.recipientInEdit.recipientid) isDuplicate = true;
            });

            if (isDuplicate) console.log(`Duplicate recipient properties: ${thisKey}`);
            return isDuplicate;
        },
        invalidBeneficiaries() {
            if (!this.recipientInEdit) return null
            let invalid = false;
            // are any of the "direct beneficiaries additional" greater than "direct beneficiaries"?
            Object.keys(this.recipientInEdit.direct_beneficiaries_additional).forEach(key => {
                let val = this.recipientInEdit.direct_beneficiaries_additional[key];
                if (val > this.recipientInEdit.direct_beneficiaries) {
                    invalid = true;
                    // console.log(`direct beneficiaries additional [ ${key} ] (${val}) is greater than direct beneficiaries (${this.recipientInEdit.direct_beneficiaries})`);
                }
            });
            // const values = Object.values(this.recipientInEdit.direct_beneficiaries_additional)
            //   .map(val => val > this.recipientInEdit.direct_beneficiaries)

            // Is either of these properties greater than "direct beneficiaries"?
            const keys = ['numhouseholds', 'group_size']
            keys.forEach(key => {
                let val = this.recipientInEdit[key];
                if (val > this.recipientInEdit.direct_beneficiaries) {
                    invalid = true;
                    // console.log(`beneficiaries inferred from [ ${key} ] (${val}) is greater than direct beneficiaries (${this.recipientInEdit.direct_beneficiaries})`);
                }
            })

            return invalid;
        },
    },

    components: {
        ProgramHeader,
        VInput,
        VButton,
        Loading,
        VTooltip,
        ProgramRecipientsForm,
    },

    created() {
        this.ensureSpec({programId: this.programId})

        EventBus.$on('handleEscape', this.handleModalEscape)
    },

    beforeDestroy() {
        EventBus.$off('handleEscape', this.handleModalEscape)
    },

    data: () => ({
        selectedRecipientId: null,
        recipientInEdit: null,
        recipientEdited: false,
        description: "Add and edit recipients here.",
        columns,
        showModal: {
            edit: false,
            delete: false,
            mandatory: false
        },
    }),

    methods: {
        ...mapActions('ui', [
            'setModal',
            'closeModal'
        ]),
        ...mapActions('languages', [
            'fetchLanguages',
        ]),
        ...mapActions('programspec', [
            'ensureSpec',
            'fetchSpec',
            'updateSpec',

            'setSortByColumn',
            'setFilterText',
            'resetFilters',

            'updateRecipient',
        ]),
        ...mapGetters('programspec', [
            'newRecipient',
        ]),

        onSaveChanges() {
            console.log("onSaveChanges");
            this.updateSpec();
        },

        onDiscardChanges() {
            console.log("onDiscardChanges")
            this.fetchSpec({programId: this.programId});
        },

        editRecipient(recipient) {
            let recip = Object.keys(recipient).map(k => `${k}:${recipient[k]}`).join(', ')
            console.log(`Edit ${recip}`);
            this.recipientInEdit = JSON.parse(JSON.stringify(recipient));
            this.onOpenModal('edit', 'Recipient Details')
        },
        duplicateRecipient(recipient) {
            let recip = Object.keys(recipient).map(k => `${k}:${recipient[k]}`).join(', ')
            console.log(`Duplicate ${recip}`);
            this.recipientInEdit = JSON.parse(JSON.stringify(recipient));
            this.recipientInEdit.recipientid = null;
            this.onOpenModal('edit', 'Duplicated Recipient Details')
        },
        addNewRecipient() {
            this.recipientInEdit = this.newRecipient();
            console.log(`new recipient: ${this.recipientInEdit}`);
            this.onOpenModal('edit', 'New Recipient Details')
        },

        onRecipientEdited(value) {
            this.recipientEdited = value;
        },

        onAcceptEdit() {
            this.onCloseModal()
            if (this.isRecipientInEditValid) {
                this.updateRecipient({recipient: this.recipientInEdit});
                this.recipientInEdit = null;
            } else {
                this.onOpenModal('mandatory', 'Required Fields')
            }
        },
        onCancelEdit() {
            this.onCloseModal()
            this.recipientInEdit = null;
        },
        onOpenModal(modal, title) {
            this.recipientEdited = false;
            this.showModal[modal] = true
            this.setModal(title)
        },
        onCloseModal() {
            this.recipientEdited = false;
            this.showModal.edit = false
            this.showModal.delete = false
            this.showModal.mandatory = false
            this.closeModal()
        },

        handleModalEscape() {
            this.onCloseModal();
            this.recipientInEdit = null;
        }
    },
}
</script>
