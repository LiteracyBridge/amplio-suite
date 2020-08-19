<template>
  <h3 class="-mx-6 px-6 py-4 bg-gray-400 text-xl text-left border-2 border-gray-600">
    <select
      ref="selectDeplo"
      @change="changeDeployment($event.target.value)"
    >
      <option
        v-for="item in deployments"
        :key="item.deployment"
        :value="item.deploymentname"
      >
        Deployment {{ item.deployment }}
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
import { mapState, mapGetters, mapActions } from 'vuex'

import VButton from '@/components/Button'

export default {
  props: {
    onChange: {
      type: Function,
      required: true
    },
    dirty: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapState('deployments', {
      deployments: state => state.items
    }),
    ...mapGetters('uiSettings', [
      'selectedDeployment'
    ]),
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
    ...mapActions('uiSettings', [
      'setDeploymentIndex'
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
        this.$refs.selectDeplo.value = this.selectedDeployment.deploymentname
        return
      }

      const index = this.deployments
        .map(item => item.deploymentname)
        .indexOf(deploymentName)

      this.setDeploymentIndex(index)
      this.onChange(deploymentName)
    }
  }
}
</script>
