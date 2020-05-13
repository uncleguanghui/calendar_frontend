<template>
  <div>
    <span>提醒策略：{{ alarm }}</span>
  </div>
</template>

<script>
export default {
  props: {
    value: String
  },
  data() {
    return {
      alarm: this.value
    };
  },
  watch: {
    value(to) {
      this.alarm = to;
    }
  }
};
</script>

<style scoped></style>
