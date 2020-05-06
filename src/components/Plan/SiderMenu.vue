<template>
  <a-menu
    theme="light"
    mode="vertical"
    v-model="selectedKeys"
    :style="{ lineHeight: '62px', textAlign: 'left' }"
    @click="clickHandle"
  >
    <a-menu-item :key="item.key" v-for="item in menuItems">
      <a-icon :type="item.icon" />
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
      menuItems: [
        { key: "/plan/today", icon: "calendar", name: "今天" },
        { key: "/plan/recent", icon: "schedule", name: "最近7天" },
        { key: "/plan/all", icon: "profile", name: "全部" },
        {
          key: "/plan/finished",
          icon: "check-circle",
          name: "已完成"
        }
      ],
      selectedKeys: [
        this.$router.currentRoute.path
        // .split("/")
        // .slice(0, 3)
        // .join("/")
      ]
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
      const data = this.$store.state.groupPlanData[key];
      const num =
        (data.finished || []).length +
        (data.expired || []).length +
        (data.going || []).length;
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
