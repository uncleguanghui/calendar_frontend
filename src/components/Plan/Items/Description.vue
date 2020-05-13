<template>
  <a-textarea
    placeholder="添加任务描述"
    :rows="10"
    v-model="description"
    class="plan-description-content"
    :autoSize="{
      minRows: 8,
      maxRows: 18
    }"
  />
</template>

<script>
export default {
  props: {
    value: String
  },
  data() {
    return {
      description: this.value
    };
  },
  watch: {
    value(to) {
      this.description = to;
    }
  }
};
</script>

<style scoped>
.plan-description-content {
  width: 100%;
  outline: none;
  vertical-align: top;
  border: none;
  padding: 0;
  resize: none;
}

.plan-description-content:focus {
  border: 1px solid #40a9ff;
}
</style>
