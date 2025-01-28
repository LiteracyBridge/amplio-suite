<script setup lang="ts">
// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import Map from "ol/Map.js";
import Overlay from "ol/Overlay.js";
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
import { onMounted, ref, type VNodeRef } from "vue";
import type { Recipient } from "@/models/recipient";
import TalkingBook from "@/assets/images/talking-book.png";

const props = defineProps<{
  data: Array<Recipient & {played_minutes: number, played_seconds: number}>;
  centroid: { latitude: number; longitude: number };
}>();
const popup = ref<VNodeRef>();

onMounted(() => {
  const map = new Map({
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

  // Add recipients location as markers to the map
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
          ft.setId(d.id);
          return ft;
        }) ?? [],
    }),
  });
  map.addLayer(layer);

  const container = document.getElementById('ol-popup');
  const closer = document.getElementById('ol-popup-closer');
  const overlay = new Overlay({
    element: container,
    autoPan: true,
    // positioning:
    // autoPanAnimation: {
    //   duration: 250,
    // },
  });
  map.addOverlay(overlay);
  map.on("singleclick", (event) => {
    container.style.visibility = "visible"
    if (map.hasFeatureAtPixel(event.pixel) === true) {
      console.log(event);
      const coordinate = event.coordinate;

      const recipient = props.data.find(r => r.id == map.getFeaturesAtPixel(event.pixel)[0].getId())!

      console.log(map.getFeaturesAtPixel(event.pixel))
      // @ts-ignore
      document.getElementById("ol-popup-content").innerHTML = `<strong>District: </strong> ${recipient.district || 'N/A'} <br/> <strong>Group: </strong> ${recipient.group || 'N/A'}<br /> <strong>Community: </strong> ${recipient.community_name || 'N/A'}<br /> <strong>Talking Books Assigned: </strong>  ${recipient.numtbs || 0} <br/> <strong>Time Played (in seconds): </strong> ${recipient.played_seconds || 0} <br/> <strong>Time Played (in minutes): </strong> ${recipient.played_minutes || 0} <br/> `;
      overlay.setPosition(coordinate);
    } else {
      overlay.setPosition(undefined);
      closer.blur();
    }
  });
});
</script>

<template>
  <div id="map"></div>
  <div
    id="ol-popup"
    class="ol-popup bg-white rounded-lg shadow-lg border-b p-1 justify-between items-center"
  >
    <a
      href="#"
      id="ol-popup-closer"
      class="ol-popup-closer text-black float-end text-lg block mx-2"
      :onclick="($el) =>{$el.target.parentElement.style.visibility = 'hidden';}"
      >x</a
    >
    <div id="ol-popup-content" class="p-2"></div>
    <!-- <div class=" w-1/3">
      <div class="">
        <h3 class="text-lg font-semibold">Modal Title</h3>
        <button class="text-black close-modal" onclick="closeModal()">&times;</button>
      </div>
      <div >
        <p>This is a sample popup modal using Tailwind CSS.</p>
      </div>
      <div class="border-t px-4 py-2 flex justify-end">
        <button class="bg-gray-500 text-white px-4 py-2 rounded mr-2 close-modal" onclick="closeModal()">Close</button>
        <button class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
      </div>
    </div> -->
  </div>
</template>

<style scoped>
#map {
  height: 100vh;
}
</style>
