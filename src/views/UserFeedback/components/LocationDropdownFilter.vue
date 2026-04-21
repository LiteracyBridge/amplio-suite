<script setup lang="ts">
import {
  Button,
  Dropdown,
  Menu,
  SubMenu,
  MenuItem,
} from "ant-design-vue";
import { DownOutlined, CloseOutlined } from "@ant-design/icons-vue";
import { computed } from "vue";
import type { UserFeedbackMessage } from "@/models/uf_message";


const props = defineProps<{
  messages: UserFeedbackMessage[] | null;
  loading?: boolean;
  selectedLocation: string | null;
}>();

const emit = defineEmits<{
  (e: "change", value: string | null): void;
}>();


const hierarchy = computed(() => {
  const tree = new Map<string, Map<string, Map<string, Set<string>>>>();

  for (const m of props.messages || []) {
    const r = (m as any).recipient;
    if (!r) continue;

    const region = r.region?.trim() || "";
    const district = r.district?.trim() || "";
    const community = r.community_name?.trim() || "";
    // const group = r.group_name?.trim() || "";

    if (!region) continue; // skip records with no region

    if (!tree.has(region)) tree.set(region, new Map());
    const regionMap = tree.get(region)!;

    if (district) {
      if (!regionMap.has(district)) regionMap.set(district, new Map());
      const districtMap = regionMap.get(district)!;

    }
  }

  return tree;
});


function select(type: string, value: string) {
  emit("change", `${type}::${value}`);
}

function clear(e: MouseEvent) {
  e.stopPropagation(); 
  emit("change", null);
}

const buttonLabel = computed(() => {
  if (!props.selectedLocation) return "Filter by Location";

  const [type, value] = props.selectedLocation.split("::");
  const prefixMap: Record<string, string> = {
    region: "Region",
    district: "District",
    community: "Community",
    // group: "Group",
  };
  return `${prefixMap[type] ?? type}: ${value}`;
});

const hasSelection = computed(() => !!props.selectedLocation);
</script>

<template>
  <Dropdown :disabled="loading">
    <template #overlay>
      <Menu>
        <!-- Region label -->
        <MenuItem disabled style="color: #888; font-size: 11px; font-weight: 600; text-transform: uppercase; cursor: default;">
           Regions
        </MenuItem>

        <!-- Region -->
        <template v-for="[region, districtMap] in hierarchy" :key="region">

          <MenuItem
            v-if="districtMap.size === 0"
            @click="select('region', region)"
          >
            {{ region }}
          </MenuItem>

          <SubMenu v-else :key="region">
            <template #title>
              <span @click.stop="select('region', region)">{{ region }}</span>
            </template>

            <!-- District label -->
            <MenuItem disabled style="color: #888; font-size: 11px; font-weight: 600; text-transform: uppercase; cursor: default;">
               Districts
            </MenuItem>

            <!-- District -->
            <template v-for="[district, communityMap] in districtMap" :key="district">

              <MenuItem
                v-if="communityMap.size === 0"
                @click="select('district', district)"
              >
                {{ district }}
              </MenuItem>

              <SubMenu v-else :key="district">
                <template #title>
                  <span @click.stop="select('district', district)">{{ district }}</span>
                </template>

                <!-- Community label -->
                <MenuItem disabled style="color: #888; font-size: 11px; font-weight: 600; text-transform: uppercase; cursor: default;">
                   Communities
                </MenuItem>

                <!-- Community -->
                <template v-for="[community, groupSet] in communityMap" :key="community">

                  <MenuItem
                    v-if="groupSet.size === 0"
                    @click="select('community', community)"
                  >
                    {{ community }}
                  </MenuItem>

                  <SubMenu v-else :key="community">
                    <template #title>
                      <span @click.stop="select('community', community)">{{ community }}</span>
                    </template>

                  </SubMenu>
                </template>
              </SubMenu>

            </template>
          </SubMenu>

        </template>
      </Menu>
    </template>

    <!-- Trigger button -->
    <Button :loading="loading">
      {{ buttonLabel }}
      <CloseOutlined v-if="hasSelection" @click="clear" style="margin-left: 4px" />
      <DownOutlined v-else />
    </Button>
  </Dropdown>
</template>
