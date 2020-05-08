<template>
  <div class="page">
    <a-row type="flex" justify="space-around">
      <a-col :span="4">
        <div class="logo">
          Logo
        </div>
      </a-col>
      <a-col :span="16">
        <a-menu
          theme="light"
          mode="horizontal"
          :selectedKeys="selectedKeys"
          :style="{ lineHeight: '62px', textAlign: 'left' }"
          @click="clickHandle"
        >
          <a-menu-item :key="item.key" v-for="item in menuItems">
            {{ item.name }}
          </a-menu-item>
        </a-menu>
      </a-col>
      <a-col :span="2">通知</a-col>
      <a-col :span="2">用户</a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { key: "/calendar", name: "日历" },
        { key: "/plan", name: "计划" },
        { key: "/help", name: "帮助" },
        { key: "/about", name: "关于" },
        { key: "/illustration", name: "插画" }
      ],
      selectedKeys: ["/" + this.$router.currentRoute.path.split("/")[1]]
    };
  },
  methods: {
    // 点击跳转
    clickHandle({ key }) {
      const currentKey = "/" + this.$router.currentRoute.path.split("/")[1];
      if (currentKey != key) {
        this.$router.push(key).catch(err => {
          err;
        });
      }
    }
  },
  watch: {
    $route: function(to) {
      const key = "/" + to.path.split("/")[1];
      this.selectedKeys = this.menuItems
        .map(item => item.key)
        .filter(item => item === key);
    }
  }
};
</script>

<style scoped></style>
