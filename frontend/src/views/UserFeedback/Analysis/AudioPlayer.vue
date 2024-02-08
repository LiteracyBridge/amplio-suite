<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Button, Card, Descriptions, DescriptionsItem } from "ant-design-vue";
import Instructions from "./Instructions.vue";
import { UserFeedbackMessage } from "@/models/uf_message";
// import type { AudioMetadata } from "@/models/analysis";

const props = defineProps<{
  message: UserFeedbackMessage;
}>();

const $emit = defineEmits<{
  (e: "srcError", status: boolean): boolean;
  (e: "next", uuid: string): void;
  (e: "useless", status: boolean): void;
}>();

// const router = useRouter();

const connected = ref(false),
  speed = ref(1),
  fullyLoaded = ref(false),
  loopStart = ref(0),
  loopEnd = ref(0),
  inLoop = ref(false),
  audio = ref(),
  audioDiv = ref(),
  currentAudio = ref();

function loadError() {
  if (props.message.url != "url") {
    if (audio.value.error.code == 4) {
      console.log("missing mp3");
      $emit("srcError", false);
    }
  }
}

function loaded() {
  fullyLoaded.value = true;
}

function increaseSpeed() {
  if (speed.value < 2) {
    speed.value += 0.25;
    currentAudio.value.playbackRate = speed.value;
  }
}

function decreaseSpeed() {
  if (speed.value >= 0.5) {
    speed.value -= 0.25;
    currentAudio.value.playbackRate = speed.value;
  }
}

function playPause() {
  if (fullyLoaded.value) {
    if (currentAudio.value.paused) {
      currentAudio.value.play();
    } else {
      currentAudio.value.pause();
    }
  }
}

function seekForward() {
  if (fullyLoaded.value) {
    currentAudio.value.currentTime += 10;
    if (currentAudio.value.paused) {
      currentAudio.value.play();
    }
  }
}

function seekBackward() {
  if (fullyLoaded.value) {
    currentAudio.value.currentTime -= 10;
    if (currentAudio.value.paused) {
      currentAudio.value.play();
    }
  }
}

function seekQuickRepeat() {
  if (fullyLoaded.value) {
    currentAudio.value.currentTime -= 5;
    if (currentAudio.value.paused) {
      currentAudio.value.play();
    }
  }
}

function readyToLoop() {
  return loopEnd.value > 0; // If we want Start set explictly then add: && this.loopStart>0
}

function checkLoop() {
  //inLoop is used to prevent skipping from multiple timeupdate events
  if (inLoop.value && readyToLoop() && !currentAudio.value.paused) {
    if (currentAudio.value.currentTime > loopEnd.value) {
      inLoop.value = false;
      startLoop(false);
    }
  }
}

function startLoop(setStart: boolean) {
  if (readyToLoop()) {
    if (!setStart) {
      currentAudio.value.currentTime = loopStart.value;
    }
    if (currentAudio.value.paused) {
      currentAudio.value.play();
    }
    inLoop.value = true;
  }
}

function stopLoop() {
  loopStart.value = 0;
  loopEnd.value = 0;
  inLoop.value = false;
}

const checkKey = (e: any) => {
  switch (e.code) {
    case "Space":
    case "KeyP":
      playPause();
      break;
    case "KeyF":
    case "KeyI":
      increaseSpeed();
      console.log("speed:", speed.value);
      break;
    case "KeyS":
    case "KeyM":
      decreaseSpeed();
      console.log("speed:", speed.value);
      break;
    case "ArrowRight":
    case "KeyK":
      console.log("seek fwd");
      seekForward();
      break;
    case "ArrowLeft":
    case "KeyJ":
      console.log("seek back");
      seekBackward();
      break;
    case "Slash":
    case "KeyH":
      seekQuickRepeat();
      break;
    case "BracketLeft":
      loopStart.value = currentAudio.value.currentTime;
      startLoop(true);
      break;
    case "BracketRight":
      loopEnd.value = currentAudio.value.currentTime;
      startLoop(false);
      break;
    case "Backslash":
      stopLoop();
      break;
    case "Backspace":
      // confirm that the audio is useless
      break;
  }
};

function setAudioFocus() {
  audioDiv.value.focus();
}

function getMinSecText(time: number) {
  var min = Math.trunc(time / 60);
  var sec = Math.round(time - min * 60);
  return String(min) + ":" + String(sec).padStart(2, "0");
}

function getUUID() {
  if (props.message) return props.message?.message_uuid;
}

onMounted(() => {
  currentAudio.value = audio.value;
  //   if (this.$route.path == "/analyze" || this.$route.path == "/review") {
  fullyLoaded.value = false;
  audio.value.load();
  setAudioFocus();
  //   }
});

// const audioUrl = computed(() => {
//   return props.audioMetadata.url;
// });

const loopRangeText = computed(() => {
  var s = "";
  if (loopStart.value || loopEnd.value) {
    s = "Start: " + getMinSecText(loopStart.value) + "   ";
    if (loopEnd.value > 0) {
      s += "End: " + getMinSecText(loopEnd.value);
    }
  }
  return s;
});

function markAsUseless() {
  $emit("useless", true);
}
</script>

<template>
  <Card title="Audio Player" type="inner">
    <template #extra>
      <Instructions />
    </template>

    <!-- <Descriptions title="" v-if="audioMetadata.url != ''" size="small">
      <DescriptionsItem v-if="audioMetadata.title" label="Last message">
        {{ audioMetadata.title }}</DescriptionsItem
      >
      <DescriptionsItem label="Location">
        {{ audioMetadata.community }}, {{ audioMetadata.district }},
        {{ audioMetadata.region }}
      </DescriptionsItem>
      <DescriptionsItem label="Model">
        {{ audioMetadata.listening_model }}
      </DescriptionsItem>
      <DescriptionsItem label="Group">
        {{ audioMetadata.group }}
      </DescriptionsItem>
      <DescriptionsItem label="ID">
        {{ getUUID() }}
      </DescriptionsItem>
    </Descriptions> -->

    <table>
      <tr>
        <td style="padding: 10px">
          <div class="audioMetadata my-4">
            <div v-if="message?.content_metadata?.title">
              <span style="font-weight: bold">Last message:</span>
              {{ message?.content_metadata?.title }}
            </div>
            <div v-else><br /></div>
            <div v-if="message.url != ''">
              <!-- for some reason this v-if has to be in this second-level div; otherwise, the audio key controls do not work.-->
              <span style="font-weight: bold">Location:</span>
              {{ message.recipient.community_name }}, {{ message.recipient.district }},
              {{ message.recipient.region }}
              <span class="ml-3" style="font-weight: bold"> Model:</span>
              {{ message.recipient.listening_model }}
              <span class="ml-3" style="font-weight: bold"> Group:</span>
              {{ message.recipient.group_name }}
              <span class="ml-3" style="font-weight: bold"> ID:</span>
              {{ getUUID() }}
            </div>
          </div>
          <div
            tabindex="0"
            class="flex justify-center noFocusOutline"
            ref="audioDiv"
            @keypress.space.prevent
            @keydown="checkKey"
          >
            <audio
              ref="audio"
              @timeupdate="checkLoop"
              @error="loadError"
              @canplaythrough="loaded"
              tabindex="-1"
              controls
              preload="auto"
              autoplay
              :src="message.url"
            >
              Your browser doesn't support the HTML5 audio element.
            </audio>
          </div>
          <div v-if="message.url != ''" class="audiometadata">
            <span style="font-weight: bold">Speed:</span
            ><span class="mr-3"> {{ speed }}</span>
            <span v-if="readyToLoop()" style="font-weight: bold"> Looping </span
            ><span>{{ loopRangeText }}</span>
          </div>
          <div v-if="message.url != '' && !fullyLoaded">Loading...</div>
        </td>
      </tr>
      <tr style="vertical-align: bottom">
        <td>
          <div class="flex items-end justify-between my-4 mx-3">
            <!-- <span> ID: {{ getUUID() }}</span> -->
            <span></span>
            <Button type="primary" :danger="true" @click="markAsUseless()"
              >Not Feedback</Button
            >

            <span>
              <!-- above was previously v-if="message.submission"-->
              <Button type="primary" @click="$emit('next', getUUID())">Skip</Button>
            </span>
          </div>
        </td>
      </tr>
    </table>
  </Card>
</template>

<style scoped>
/* body {
  overflow-x: hidden;
}
.audioMetadata {
  font-size: 0.8em;
}
.noFocusOutline {
  outline: 0px solid transparent;
}
table {
  border-spacing: 3px;
}
td {
  text-align: center;
}
th {
  text-align: right;
} */
</style>
