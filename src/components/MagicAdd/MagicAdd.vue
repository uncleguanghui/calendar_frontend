<template>
  <a-dropdown type="primary">
    <event-type slot="overlay" />
    <a-button style="margin-left: 8px">
      创建
      <a-icon type="down" />
    </a-button>
  </a-dropdown>
</template>

<script>
import EventType from "./EventType";

export default {
  components: { EventType },
  data() {
    return {};
  },
  methods: {
    handleButtonClick(e) {
      console.log("click left button", e);
    },
    handleMenuClick(e) {
      console.log("click", e);
    }
  }
};
</script>

<style scoped></style>
