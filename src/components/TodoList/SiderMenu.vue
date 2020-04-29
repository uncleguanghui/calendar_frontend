<template>
  <a-menu
    theme="light"
    mode="vertical"
    :selectedKeys="[selectedKey]"
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
        { key: "today", icon: "calendar", name: "今天", num: 5 },
        { key: "recent", icon: "schedule", name: "最近7天", num: 5 },
        { key: "all", icon: "profile", name: "全部", num: 5 },
        { key: "finished", icon: "check-circle", name: "已完成", num: 0 },
        { key: "overdue", icon: "exclamation-circle", name: "已过期", num: 5 }
      ],
      selectedKey: "today"
    };
  },
  methods: {
    // 点击事件
    clickHandle({ key }) {
      this.selectedKey = key;
      this.$router.push("/todolist/" + key).catch(err => {
        err;
      });
    }
  },
  mounted() {
    // 跳转到指定条目下
    var key = this.$router.currentRoute.params.pathMatch.split("/")[0];
    if (
      key != this.selectedKey &&
      this.menuItems.filter(item => item.key === key).length
    ) {
      this.clickHandle({ key: key });
    }
  }
};
</script>

<style scoped>
.right {
  float: right;
}
</style>
