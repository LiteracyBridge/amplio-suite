<script setup lang="ts">
import { computed } from "vue";
import { useFeedbackAnalysis } from "@/store/feedback_analysis.store";
import { Row, Col, Statistic, Card, Progress, Tooltip } from "ant-design-vue";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons-vue";

const store = useFeedbackAnalysis();

const notAnalysed = computed(() =>
  Math.max(
    (store.statistics.total_messages || 0) -
      (store.statistics.total_analysed || 0) -
      (store.statistics.total_useless || 0),
    0,
  ),
);

</script>

<template>
  <Card type="inner" size="small" class="stats-card">
    <template #title>
      <span class="stats-card__title">
        <FileTextOutlined /> Feedback Analysis Stats
      </span>
    </template>

    <Row :gutter="[12, 16]">
      <Col :span="12">
        <Statistic title="Total" :value="store.statistics.total_messages">
          <template #prefix>
            <FileTextOutlined style="color: #1677ff" />
          </template>
        </Statistic>
      </Col>

      <Col :span="12">
        <Tooltip title="Messages reviewed so far, valid or useless">
          <Statistic
            title="Valid/Analysed"
            :value="store.statistics.total_analysed"
            :value-style="{ color: '#52c41a' }"
          >
            <template #prefix>
              <CheckCircleOutlined style="color: #52c41a" />
            </template>
          </Statistic>
        </Tooltip>
      </Col>

      <Col :span="12">
        <Tooltip title="Messages still waiting to be reviewed">
          <Statistic
            title="Not Yet Analysed"
            :value="notAnalysed"
            :value-style="{ color: '#fa8c16' }"
          >
            <template #prefix>
              <ClockCircleOutlined style="color: #fa8c16" />
            </template>
          </Statistic>
        </Tooltip>
      </Col>

      <Col :span="12">
        <Statistic
          title="Useless"
          :value="store.statistics.total_useless"
          :value-style="{ color: '#ff4d4f' }"
        >
          <template #prefix>
            <CloseCircleOutlined style="color: #ff4d4f" />
          </template>
        </Statistic>
      </Col>

      <Col :span="12">
        <Statistic
          title="Analysed By You"
          :value="store.statistics.by_current_user"
          :value-style="{ color: '#722ed1' }"
        >
          <template #prefix>
            <UserOutlined style="color: #722ed1" />
          </template>
        </Statistic>
      </Col>
    </Row>
  </Card>
</template>

<style scoped>
.stats-card__title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

:deep(.ant-statistic-title) {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

:deep(.ant-statistic-content) {
  font-size: 20px;
  font-weight: 600;
}
</style>