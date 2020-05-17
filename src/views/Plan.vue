<template>
  <a-layout>
    <a-layout-sider
      width="200"
      :style="{
        background: '#fff',
        height: 'calc(100vh - 64px)',
        left: 0,
        borderRight: '1px solid #e8e8e8'
      }"
      breakpoint="lg"
      collapsedWidth="0"
    >
      <sider-Menu
        :style="{
          height: '100%'
        }"
      />
    </a-layout-sider>
    <a-layout-content
      :style="{
        background: '#fff',
        position: 'relative'
      }"
    >
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
    </a-layout-content>
  </a-layout>
</template>

<script>
import SiderMenu from "@/components/Plan/SiderMenu";
import PlanList from "@/components/Plan/PlanList";
import PlanDetail from "@/components/Plan/PlanDetail";

export default {
  data() {
    return {};
  },
  components: { SiderMenu, PlanList, PlanDetail },
  mounted() {
    this.$store.dispatch("getPlans");
    this.$store.dispatch("getTags");
  }
};
</script>

<style scoped></style>
