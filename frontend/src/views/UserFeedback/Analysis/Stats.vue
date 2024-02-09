<script setup lang="ts">
import { useFeedbackAnalysis } from "@/store/feedback_analysis.store";
import { Row, Col, Statistic, Card } from "ant-design-vue";

const store = useFeedbackAnalysis();
</script>

<template>
  <Card type="inner" >
    <Row justify="space-around">
      <Col :span="4">
        <Statistic
          title="Total Messages"
          :value="store.statistics.total_messages"
          style="margin-right: 50px"
        />
      </Col>
      <Col :span="4">
        <Statistic
          title="Total Analysed"
          :value="store.statistics.total_analysed + store.statistics.total_useless"
          style="margin-right: 50px"
        />
      </Col>
      <Col :span="4">
        <Statistic
          title="Valid Messages"
          :value="store.statistics.total_analysed"
          style="margin-right: 50px"
        />
      </Col>
      <Col :span="4">
        <Statistic
          title="Analysed By You"
          :value="store.statistics.by_current_user"
          style="margin-right: 50px"
        />
      </Col>
      <Col :span="4">
        <Statistic
          title="Useless Messages"
          :value="store.statistics.total_useless"
          style="margin-right: 50px"
        />
      </Col> </Row
  ></Card>
</template>
