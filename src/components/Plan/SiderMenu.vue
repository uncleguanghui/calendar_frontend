<template>
  <a-menu
    theme="light"
    mode="vertical"
    v-model="selectedKeys"
    :style="{ lineHeight: '62px', textAlign: 'left' }"
    @click="clickHandle"
  >
    <a-menu-item
      :key="item.key"
      v-for="item in $store.state.planSiderMenu"
      :style="item.style"
    >
      <a-icon :type="item.icon" :style="{ color: item.color }" />
      {{ item.name }}
      <span class="right" v-if="planNum(item.key) > 0">
        {{ planNum(item.key) }}
      </span>
    </a-menu-item>
  </a-menu>
</template>

<script>
export default {
  data() {
    return {
      selectedKeys: [this.$router.currentRoute.path]
    };
  },
  methods: {
    // 点击事件
    clickHandle({ key }) {
      const currentKey = this.$router.currentRoute.path;
      if (currentKey != key) {
        this.$router.push(key).catch(err => {
          err;
        });
      }
    },
    planNum(key) {
      let num = 0;
      switch (key) {
        case "/plan/today":
          num = this.$store.state.planDataToday.length;
          break;
        case "/plan/recent":
          num = this.$store.state.planDataRecent.length;
          break;
        case "/plan/star":
          num = this.$store.state.planDataStar.length;
          break;
        case "/plan/finished":
          num = this.$store.state.planDataFinished.length;
          break;
        case "/plan/all":
          num = this.$store.state.planDataAll.length;
          break;
        case "/plan/trash":
          num = this.$store.state.planDataTrash.length;
          break;
        default:
          break;
      }
      return num;
    }
  }
};
</script>

<style scoped>
.right {
  float: right;
}
</style>
