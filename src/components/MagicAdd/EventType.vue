<template>
  <div class="page">
    <a-menu slot="overlay" @click="handleMenuClick">
      <a-menu-item key="scheduler">
        <a-icon type="calendar" />日程
      </a-menu-item>
    </a-menu>
    <scheduler :visible.sync="schedulerVisible" />
  </div>
</template>

<script>
import Scheduler from "./Events/Scheduler";

export default {
  data() {
    return {
      schedulerVisible: false
    };
  },
  components: { Scheduler },
  methods: {
    handleMenuClick({ key }) {
      switch (key) {
        case "scheduler":
          this.schedulerVisible = true;
          break;
      }
    }
  }
};
</script>

<style scoped></style>
