<template>
  <h3 class="-mx-6 px-6 py-4 bg-gray-400 text-xl text-left border-2 border-gray-600">
    <label class="visually_hidden" for="selectDeplo">Select the deployment</label>
    <select
      id="selectDeplo"
      ref="selectDeplo"
      @change="changeDeployment($event.target.value)"
    >
      <option
        v-for="(deployment, index) in deployments"
        :key="deployment.id"
        :value="deployment.name"
      >
        Deployment {{ index + 1 }}
      </option>
    </select>

    <!-- For modal components -->
    <portal to="modalBody" v-if="isModalOpen">
      <p>Save or discard the change before continue.</p>
    </portal>

    <portal to="modalFooter" v-if="isModalOpen">
      <footer class="flex flex-row-reverse justify-between">
        <v-button @click="handleCloseModal" text="Ok" />
      </footer>
    </portal>
  </h3>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import VButton from '@/components/Button'

export default {
  props: {
    value: {
      type: Object,
      required: true
    },
    dirty: {
      type: Boolean,
      required: true
    },
    programCode: {
      type: String,
      required: true
    },
  },
  computed: {
    ...mapState('deployments', [
      'deployments',
    ]),
  },
  created () {
    this.fetchDeployments(this.programCode)
  },
  watch: {
    deployments: {
      immediate: true,
      handler () {
        if (Object.keys(this.value).length === 0 && this.deployments) {
          this.$emit('input', { ...this.deployments[0] })
        }
      }
    }
  },
  components: {
    VButton,
  },
  data: () => ({
    isModalOpen: false
  }),
  methods: {
    ...mapActions('ui', [
      'setModal',
      'closeModal'
    ]),
    ...mapActions('deployments', [
      'fetchDeployments',
    ]),
    handleOpenModal () {
      this.isModalOpen = true
      this.setModal('Save or discard the change')
    },
    handleCloseModal () {
      this.isModalOpen = false
      this.closeModal()
    },
    changeDeployment(deploymentName) {
      if (this.dirty) {
        this.handleOpenModal()
        this.$refs.selectDeplo.value = this.value.deploymentname
        return
      }

      const deployment = this.deployments.find(deployment => deployment.name === deploymentName)
      this.$emit('input', { ...deployment })
    }
  }
}
</script>
