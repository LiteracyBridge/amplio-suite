<script setup lang="ts">
import { Button, Modal } from "ant-design-vue";
import { ref } from "vue";

const showModal = ref(false);
</script>

<template>
  <div>
    <Button @click="showModal = true" type="primary" :ghost="true">Instructions</Button>

    <Modal
      v-model:open="showModal"
      @close="showModal = false"
      width="60vw"
      title="Instructions"
    >
      <template #footer>
        <Button type="primary" @click="showModal = false"> Close </Button>
      </template>

      <div>
        <!-- <h1>Instructions</h1> -->
        <p>This page is composed of two parts: an audio player and a data entry form.</p>
        <h2>Controlling the Audio Player</h2>
        <p>
          A new audio file is loaded each time the page is refreshed or the form is
          submitted. Use the following keys to play/pause, quickly move forward and
          backward, change speed, and loop a section of audio to help with transcription:
        </p>
        <table>
          <tr>
            <th>Play/Pause:</th>
            <td><span class="keybig">P</span></td>
            <th>Faster</th>
            <td><span class="keybig">F</span></td>
            <th>Slower</th>
            <td><span class="keybig">S</span></td>
          </tr>
          <tr>
            <th>Ahead 10s:</th>
            <td><span class="keybig">&#8594;</span></td>
            <th>Back 10s:</th>
            <td><span class="keybig">&#8592;</span></td>
            <th>Back 5s:</th>
            <td><span class="keybig">/</span></td>
          </tr>
          <tr>
            <th>Set Loop Start</th>
            <td><span class="keybig"> [ </span></td>
            <th>Set Loop End</th>
            <td><span class="keybig"> ] </span></td>
            <th>Stop Loop</th>
            <td><span class="keybig"> \ </span></td>
          </tr>
        </table>
        <h2>Moving Around the Form</h2>
        <p>You can also use the keyboard to move around, enter, and submit your data.</p>
        <table>
          <tr>
            <th>Control Audio Player:</th>
            <td><span class="keybig">{esc}</span></td>
            <th>Next Quetion:</th>
            <td><span class="keybig">{tab}</span></td>
            <th>Prev Question:</th>
            <td><span class="keybig">{shift}</span> <span class="keybig">{tab}</span></td>
          </tr>
          <tr>
            <th>Click a Button:</th>
            <td>
              <span class="keybig">{space}</span> or <span class="keybig">{enter}</span>
            </td>
            <th>Choose Option:</th>
            <td><span class="keybig">{up/down}</span></td>
            <th>Select a Box:</th>
            <td>
              <span class="keybig">{tab}</span> and <span class="keybig">{space}</span>
            </td>
          </tr>
        </table>
      </div>
      <!-- </transition> -->
    </Modal>
  </div>
</template>

<style scoped></style>
