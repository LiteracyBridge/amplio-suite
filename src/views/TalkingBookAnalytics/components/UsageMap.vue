<script setup lang="ts">
// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import Map from "ol/Map.js";
import { default as SourceVector } from "ol/source/Vector.js";
import { default as LayerVector } from "ol/layer/Vector.js";
import Point from "ol/geom/Point.js";
import Feature from "ol/Feature.js";
import Style from "ol/style/Style.js";
import Icon from "ol/style/Icon.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import { fromLonLat } from "ol/proj.js";
import "ol/ol.css";
import { onMounted, ref } from "vue";
import type { Recipient } from "@/models/recipient";
import TalkingBook from "@/assets/images/talking-book.png";

const props = defineProps<{
  data: Array<Recipient>;
  centroid: { latitude: number; longitude: number };
}>();
const map = ref();

onMounted(() => {
  map.value = new Map({
    target: "map",
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: fromLonLat([props.centroid.longitude, props.centroid.latitude]),
      zoom: 7,
    }),
    // sources: []
  });

  console.log(props.data);
  const layer = new LayerVector({
    visible: true,
    source: new SourceVector({
      features:
        props.data?.map((d) => {
          const ft = new Feature({
            geometry: new Point(fromLonLat([d.longitude, d.latitude])),
          });
          ft.setStyle(
            new Style({
              geometry: new Point(fromLonLat([d.longitude, d.latitude])),
              image: new Icon({
                // anchor: [0.5, 1],
                scale: 0.13,
                src: TalkingBook,
              }),
            })
          );
          return ft;
        }) ?? [],
    }),
  });
  map.value.addLayer(layer);
});
</script>

<template>
  <div id="map"></div>
</template>

<style scoped>
#map {
  height: 100vh;
}
</style>
