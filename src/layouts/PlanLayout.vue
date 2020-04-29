<template>
  <a-layout>
    <a-layout-sider
      width="200px"
      :style="{
        background: '#fff',
        height: '100vh',
        position: 'fixed',
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
    <a-layout-content>
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
