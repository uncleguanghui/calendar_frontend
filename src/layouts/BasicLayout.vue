<template>
  <div class="page">
    <Header></Header>
    <SiderMenu></SiderMenu>
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "./Header";
import Footer from "./Footer";
import SiderMenu from "./SiderMenu";

export default {
  data() {
    return {};
  },
  components: { Header, Footer, SiderMenu }
};
</script>

<style scoped></style>
