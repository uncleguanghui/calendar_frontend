<template>
  <a-layout class="layout">
    <!-- 设置背景色为白色，固定在顶部，且宽度上撑满 -->
    <a-layout-header
      :style="{
        position: 'fixed',
        zIndex: 1,
        width: '100%',
        background: '#fff'
      }"
    >
      <Header />
    </a-layout-header>
    <a-layout-content :style="{ marginTop: '64px' }">
      <!-- 设置内容部分的最低高度为全屏高度减去 128px( header 和 footer 各占据了 64px ) -->
      <!-- 这样一来，即使内容部分为空，footer也会在页面最底下 -->
      <div
        :style="{
          padding: '25px',
          minHeight: 'calc(100vh - 128px)'
        }"
      >
        <router-view></router-view>
      </div>
    </a-layout-content>
    <!-- 设置高度为64px，文字居中 -->
    <a-layout-footer :style="{ textAlign: 'center', height: '64px' }">
      <Footer />
    </a-layout-footer>
  </a-layout>
</template>

<script>
import Header from "./Header";
import Footer from "./Footer";

export default {
  data() {
    return {};
  },
  components: { Header, Footer }
};
</script>

<style scoped></style>
