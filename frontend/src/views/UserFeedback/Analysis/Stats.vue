<script setup lang="ts">
import { useFeedbackAnalysis } from "@/store/feedback_analysis.store";
import { Row, Col, Statistic, Card } from "ant-design-vue";

const store = useFeedbackAnalysis();
</script>

<template>
  <Card type="inner" >
    <Row justify="space-around">
      <Col :span="6">
        <Statistic
          title="Total Messages"
          :value="store.statistics.total_messages"
          style="margin-right: 50px"
        />
      </Col>
      <Col :span="6">
        <Statistic
          title="Total Analysed"
          :value="store.statistics.total_analysed"
          style="margin-right: 50px"
        />
      </Col>
      <Col :span="6">
        <Statistic
          title="Analysed By You"
          :value="store.statistics.user_feedback"
          style="margin-right: 50px"
        />
      </Col>
      <Col :span="6">
        <Statistic
          title="Useless Messages"
          :value="store.statistics.total_useless"
          style="margin-right: 50px"
        />
      </Col> </Row
  ></Card>
</template>
