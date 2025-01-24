<script setup lang="ts">
import { useAccountStore } from "@/store/account";
import { useAppStore } from "@/store/app.store";
import { PageHeader, Alert, Row, Col, Card, Statistic } from "ant-design-vue";

const app = useAppStore(),
  userStore = useAccountStore();
</script>

<template>
  <PageHeader title="Dashboard"> </PageHeader>

  <Card type="inner" size="small">
    <Row>
      <Col :span="4">
        <Statistic title="Programs" :value="(userStore.programs || []).length" />
      </Col>
    </Row>
  </Card>

  <!-- <a-card title="Card Title">
    <a-card-grid style="width: 25%; text-align: center">Content</a-card-grid>
    <a-card-grid style="width: 25%; text-align: center" :hoverable="false">Content</a-card-grid>
    <a-card-grid style="width: 25%; text-align: center">Content</a-card-grid>
    <a-card-grid style="width: 25%; text-align: center">Content</a-card-grid>
    <a-card-grid style="width: 25%; text-align: center">Content</a-card-grid>
    <a-card-grid style="width: 25%; text-align: center">Content</a-card-grid>
    <a-card-grid style="width: 25%; text-align: center">Content</a-card-grid>
    <a-card-grid style="width: 25%; text-align: center">Content</a-card-grid>
  </a-card>
   -->
  <!-- <Alert type="warning">
    <template #message> {{ app.programName }} is currently active </template>
  </Alert> -->
</template>
