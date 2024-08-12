<script setup lang="ts">
import VButton from "@/components/VButton.vue";
import { CardMeta, Card, PageHeader, Button, notification } from "ant-design-vue";
import tbLoaderIcon from "@/assets/images/tb-loader.png";
import acmIcon from "@/assets/images/splash-acm.jpg";
import tbHeadset from "@/assets/images/tb-headset.png";
import audacity from "@/assets/images/audacity.png";
import axios from "axios";

async function getTBLoaderAppLatestVersion() {
  try {
    const response = await axios.get(
      "https://api.github.com/repos/LiteracyBridge/acm/releases/latest",
      { headers: { "Content-Type": "application/json", Authorization: undefined } }
    );
    const latestRelease = response.data;
    const downloadUrl = latestRelease.assets[0].browser_download_url;
    window.open(downloadUrl, "_blank");

    notification.success({
      message: "Download Started",
      description: "The download should start shortly.",
    });
  } catch (error) {
    console.error("Error retrieving latest release:", error);
  }
}
</script>

<template>
  <PageHeader
    title="Software Download"
    sub-title="Download and install the software you need"
  >
  </PageHeader>

  <main class="container mx-auto">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div class="p-4">
        <Card hoverable style="width: 400px; height: 360px">
          <template #cover>
            <a href="https://downloads.amplio.org/software/index.html" target="_blank">
              <div class="flex justify-between">
                <img
                  alt="Audio Content Manager Image"
                  :src="acmIcon"
                  class="w-1/2 inline pr-1"
                />
                <img
                  alt="Talking Book Loader Image"
                  :src="tbLoaderIcon"
                  class="w-1/2 inline pl-1"
                />
              </div>
            </a>
          </template>
          <CardMeta title="Amplio Software">
            <template #description>
              This installer includes Audio Content Manager and Talking Book Loader
              software.
            </template>
          </CardMeta>

          <CardMeta>
            <template #title>
              <a href="https://downloads.amplio.org/software/index.html" target="_blank">
                <Button class="mt-4" block type="primary">Download</Button>
              </a>
            </template>
          </CardMeta>
        </Card>
      </div>

      <div class="p-4">
        <Card hoverable style="width: 400px; height: 360px">
          <template #cover>
            <div class="flex justify-center">
              <img alt="Talking Book Loader Image" :src="tbHeadset" class="inline-block" width="220">
            </div>
          </template>
          <CardMeta title="Talking Book Loader Android">
            <template #description>
              Android version of the Talking Book Loader software.
            </template>
          </CardMeta>

          <CardMeta>
            <template #title>
              <Button
                class="mt-4"
                @click="getTBLoaderAppLatestVersion()"
                block
                type="primary"
                >Download</Button
              >
            </template>
          </CardMeta>
        </Card>
      </div>

      <div class="p-4">
        <Card hoverable style="width: 400px; height: 360px">
          <template #cover>
            <div class="flex justify-center">
              <img alt="Audacity software logo" :src="audacity" class="w-full h-full p-14">
            </div>
          </template>
          <CardMeta title="Audacity">
            <template #description>
              Audacity is a free, open-source, cross-platform audio software.
            </template>
          </CardMeta>

          <CardMeta>
            <template #title>
              <a href="https://www.audacityteam.org/download/" target="_blank">
                <Button class="mt-4" block type="primary">Download</Button>
              </a>
            </template>
          </CardMeta>
        </Card>
      </div>
    </div>

    <h1 class="py-20 text-4xl text-blue font-semibold">Software Download</h1>

    <section class="p-6 bg-white rounded-lg shadow-box">
      <div class="min-h-200-px py-5 text-left">
        <!-- You'd think that we would use an <ol> here. But tailwind, for reasons known only to them, defines
         "ol {list-style:none;}", which, of course, totally eviscerates <ol>. Tailwind's creators complained
         that css is too hard, and that's not wrong, but throwing the baby out with the bath is probably not
         the most effective first step though. But here we are, and we need to manually numbers these
         entries, and manually keep them in order. -->
        <p class="text-2xl font-semibold">
          1. Download and install
          <a
            class="underline text-blue"
            href="https://downloads.amplio.org/software/index.html"
            target="_blank"
            >Amplio Software</a
          >. This installer includes:
        </p>

        <ul class="pl-10 pb-5 text-2xl">
          <!--li class="block">
            < !-- We do not make Java available to the user, and they don't have to do anything, so why show it? -- >
            <span class="inline-flex items-center">
              <font-awesome-icon icon="check" class="w-4 h-4 pr-3 text-gray-500" />
              Java
            </span>
          </li-->
          <li class="block">
            <span class="inline-flex items-center">
              <font-awesome-icon icon="check" class="w-4 h-4 pr-3 text-gray-500" />
              Audio Content Manager
            </span>
          </li>
          <li class="block">
            <span class="inline-flex items-center">
              <font-awesome-icon icon="check" class="w-4 h-4 pr-3 text-gray-500" />
              Talking Book Loader
            </span>
          </li>
        </ul>

        <p class="text-2xl font-semibold pb-5">
          2. Download and install
          <a
            class="underline text-blue"
            href="https://www.audacityteam.org/download/"
            target="_blank"
            >Audacity</a
          >
        </p>

        <footer class="mt-10 text-center">
          <VButton
            tag="a"
            href="https://amplio.moodlecloud.com/"
            target="_blank"
            text="Go to step 2: Learning Portal"
            class="py-4 text-xl cursor-pointer"
          />
        </footer>
      </div>
    </section>
  </main>
</template>
