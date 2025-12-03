<script setup lang="ts">

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
              <img
                alt="Talking Book Loader Image"
                :src="tbHeadset"
                class="inline-block"
                width="220"
              />
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
              <img
                alt="Audacity software logo"
                :src="audacity"
                class="w-full h-full p-14"
              />
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

      <div class="p-4">
  <Card hoverable style="width: 400px; height: 360px">
    <template #cover>
      <div class="flex justify-center">
        <img
          alt="Amplio Companion App"
          src="https://www.amplio.org/_image?href=%2F_astro%2Ftech-main-bg.DaPO2TNW.jpg&w=1920&h=1080&f=webp"
          class="inline-block"
          width="400"
          height="250"
        />
      </div>
    </template>

    <CardMeta title="Amplio Companion App">
      <template #description>
        Official Companion App for Talking Book devices. Install from Google Play.
      </template>
    </CardMeta>

    <CardMeta>
      <template #title>
        <a
          href="https://play.google.com/store/apps/details?id=org.amplio.talkingbook"
          target="_blank"
        >
          <Button class="mt-4" block type="primary">Download</Button>
        </a>
      </template>
    </CardMeta>
  </Card>
</div>

    </div>
  </main>
</template>
