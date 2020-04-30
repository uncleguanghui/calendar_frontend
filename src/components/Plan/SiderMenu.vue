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
      <span class="right" v-if="item.num > 0">{{ item.num }}</span>
    </a-menu-item>
  </a-menu>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { key: "/plan/today", icon: "calendar", name: "今天", num: 5 },
        { key: "/plan/recent", icon: "schedule", name: "最近7天", num: 5 },
        { key: "/plan/all", icon: "profile", name: "全部", num: 5 },
        {
          key: "/plan/finished",
          icon: "check-circle",
          name: "已完成",
          num: 0
        }
      ],
      selectedKeys: [
        this.$router.currentRoute.path
          .split("/")
          .slice(0, 3)
          .join("/")
      ]
    };
  },
  methods: {
    // 点击事件
    clickHandle({ key }) {
      const currentKey = this.$router.currentRoute.path
        .split("/")
        .slice(0, 3)
        .join("/");
      if (currentKey != key) {
        this.$router.push(key).catch(err => {
          err;
        });
      }
    }
  }
};
</script>

<style scoped>
.right {
  float: right;
}
</style>
