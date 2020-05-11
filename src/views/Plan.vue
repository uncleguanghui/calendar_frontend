<template>
  <div class="page">
    <a-row type="flex" justify="space-around">
      <a-col
        :span="12"
        :style="{
          borderRight: '1px solid #e8e8e8',
          height: 'calc(100vh - 64px)'
        }"
      >
        <plan-list />
      </a-col>
      <a-col :span="12">
        <plan-detail />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import PlanList from "@/components/Plan/PlanList";
import PlanDetail from "@/components/Plan/PlanDetail";

export default {
  data() {
    return {};
  },
  components: { PlanList, PlanDetail }
};
</script>

<style scoped></style>
