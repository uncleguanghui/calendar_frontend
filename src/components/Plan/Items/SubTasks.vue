<template>
  <div>
    <span>子任务列表：{{ subTasks }}</span>
  </div>
</template>

<script>
export default {
  props: {
    value: Array
  },
  data() {
    return {
      subTasks: this.value
    };
  },
  watch: {
    value(to) {
      this.subTasks = to;
    }
  }
};
</script>

<style scoped></style>
