<template>
  <a-layout>
    <a-layout-sider
      width="200"
      :style="{
        background: '#fff',
        height: 'calc(100vh - 64px)',
        left: 0
      }"
      breakpoint="lg"
      collapsedWidth="0"
      @collapse="onCollapse"
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
      <router-view></router-view>
    </a-layout-content>
  </a-layout>
</template>

<script>
import SiderMenu from "@/components/Plan/SiderMenu";

export default {
  data() {
    return {};
  },
  components: { SiderMenu },
  methods: {
    onCollapse(collapsed, type) {
      console.log(collapsed, type);
    }
  }
};
</script>

<style scoped></style>
