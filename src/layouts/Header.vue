<template>
  <div class="header">
    <div class="left">
      <div class="logo">
        Logo
      </div>
      <a-menu
        class="menu"
        theme="light"
        mode="horizontal"
        :selectedKeys="selectedKeys"
        @click="clickHandle"
      >
        <a-menu-item :key="item.key" v-for="item in menuItems">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </div>
    <div class="right">
      <magic-add style="margin-right: 40px" />
      <span style="padding-right: 40px">通知</span>
      <span>用户</span>
    </div>
  </div>
</template>

<script>
import MagicAdd from "@/components/MagicAdd/MagicAdd";

export default {
  components: { MagicAdd },
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

<style scoped>
.header {
  text-align: left;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  align-items: center;
}

.logo {
  display: inline-block;
  width: 150px;
}

@media screen and (max-width: 500px) {
  .logo {
    display: none;
  }
}

.menu {
  display: inline-block;
  width: calc(100vw - 450px);
  line-height: 62px;
  text-align: left;
  background: #fff0;
}

.right {
  /* flex-grow: 1; */
  /* display: inline-block; */
  position: absolute;
  right: 0;
  width: 300px;
}
</style>
