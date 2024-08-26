<script lang="ts" setup>
import { Button, Input, PageHeader, Table } from "ant-design-vue";

function onChange(pagination: any, filters: any, sorter: any, extra: any) {
  console.log('params', pagination, filters, sorter, extra);
}

/**const { loading, data: tableData, run: fetchData } = useRequest(store.getTbStatusBy, {
  defaultParams: ["ByDepl"],
});*/

// TODO: fetch the checkout data from the backend

const columns = [
    {
        title: "ACM Name",
        key: "acm_name",
    },
    {
        title: "Status",
        key: "status",
    },
    {
        title: "Checked Out Date",
        key: "checked_out_date",
    },
    {
        title: "Checked Out By",
        key: "checked_out_by",
    },
    {
        title: "Computer Name",
        key: "computer_name",
    },
    {
        title: "Last Checkin Date",
        key: "last_checkin_date",
    },
    {
        title: "Last Filename",
        key: "last_filename",
    },
    {
        title: "Last Checkin Name",
        key: "last_checkin_name",
    },
]

const dataSource = [
    {
        acm_name: 'DEMO',
        status: 'CHECKED_IN',
        checked_out_date: '2022-10-11',
        checked_out_by: 'emmanuel@amplio.org',
        computer_name: 'bingies',
        last_checkin_date: '2022-10-11 07:09:06',
        last_filename: 'db6.zip',
        last_checkin_name: 'emmanuel@amplio.org',
    },
    {
        acm_name: 'DEMO-DL',
        status: 'CHECKED_IN',
        checked_out_date: '2022-10-11',
        checked_out_by: 'emmanuel@amplio.org',
        computer_name: 'bingies',
        last_checkin_date: '2022-10-11 07:09:06',
        last_filename: 'db6.zip',
        last_checkin_name: 'emmanuel@amplio.org',
    },
    {
        acm_name: 'ACM-TEST',
        status: 'CHECKED_IN',
        checked_out_date: '2022-10-11',
        checked_out_by: 'emmanuel@amplio.org',
        computer_name: 'bingies',
        last_checkin_date: '2022-10-11 07:09:06',
        last_filename: 'db6.zip',
        last_checkin_name: 'emmanuel@amplio.org',
    },
]
</script>

<template>
    <PageHeader title="ACMs" sub-title="ACM Checkout"></PageHeader>

    <Table :columns="columns" :data-source="dataSource" @change="onChange">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'acm_name'">
                {{ record.acm_name }}
            </template>
            <template v-if="column.key === 'status'">
                {{ record.status }}
            </template>
            <template v-if="column.key === 'checked_out_date'">
                {{ record.checked_out_date }}
            </template>
            <template v-if="column.key === 'checked_out_by'">
                {{ record.checked_out_by }}
            </template>
            <template v-if="column.key === 'computer_name'">
                {{ record.computer_name }}
            </template>
            <template v-if="column.key === 'last_checkin_date'">
                {{ record.last_checkin_date }}
            </template>
            <template v-if="column.key === 'last_filename'">
                {{ record.last_filename }}
            </template>
            <template v-if="column.key === 'last_checkin_name'">
                {{ record.last_checkin_name }}
            </template>
        </template>
    </Table>
</template>
