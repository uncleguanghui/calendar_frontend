<template>
  <a-menu
    theme="light"
    mode="vertical"
    v-model="selectedKeys"
    :style="{ lineHeight: '62px', textAlign: 'left' }"
    @click="clickHandle"
  >
    <a-menu-item :key="item.key" v-for="item in $store.state.planSiderMenu">
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
      const data = this.$store.state.groupPlanData[key] || {};
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
