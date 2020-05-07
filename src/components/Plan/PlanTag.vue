<template>
  <a-modal
    centered
    :destroyOnClose="false"
    title="标签"
    okText="确定"
    width="400px"
    cancelText="取消"
    :visible="visible"
    @ok="handleCreate"
    @cancel="handleCancel"
  >
    标签处理页
  </a-modal>
</template>

<script>
export default {
  props: {
    visible: {
      require: true,
      type: Boolean
    }
  },
  data() {
    return {};
  },
  methods: {
    handleCreate() {
      this.handleCancel();
    },
    handleCancel() {
      this.$emit("update:visible", false);
    }
  }
};
</script>

<style scoped></style>
