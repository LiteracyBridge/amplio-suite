<script setup lang="ts">
import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import "ol/ol.css";
import { onMounted } from "vue";

onMounted(() => {
  const map = new Map({
    target: "map",
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: [0, 0],
      zoom: 2,
    }),
  });
});
</script>

<template>
  <div id="map"></div>
</template>

<style scoped>
#map {
  height: 180px;
}
</style>
