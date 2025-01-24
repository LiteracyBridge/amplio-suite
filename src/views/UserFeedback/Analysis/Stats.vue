<script setup lang="ts">
import { useFeedbackAnalysis } from "@/store/feedback_analysis.store";
import { Row, Col, Statistic, Card } from "ant-design-vue";

const store = useFeedbackAnalysis();
</script>

<template>
  <Card type="inner" size="small">
    <Row :gutter="4">
      <Col :span="12">
        <Statistic title="Total" :value="store.statistics.total_messages" />
      </Col>
      <!-- <Col :span="12">
        <Statistic
          title="Analysed"
          :value="store.statistics.total_analysed"
        />
      </Col> -->
      <Col :span="12">
        <Statistic title="Valid/Analysed" :value="store.statistics.total_analysed" />
      </Col>
    </Row>
    <Row :gutter="4">
      <Col :span="12">
        <Statistic title="Useless" :value="store.statistics.total_useless" />
      </Col>
    </Row>
    <Row :gutter="4">
      <Col :span="12">
        <Statistic title="Analysed By You" :value="store.statistics.by_current_user" />
      </Col> </Row
  ></Card>
</template>
