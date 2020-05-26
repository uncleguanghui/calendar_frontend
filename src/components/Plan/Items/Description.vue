<template>
  <a-textarea
    placeholder="添加任务描述"
    :rows="10"
    v-model="description"
    @change="emitInput"
    class="plan-description-content"
    :autoSize="{
      minRows: 8,
      maxRows: 18
    }"
  />
</template>

<script>
import lodash from "lodash";

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
  },
  methods: {
    // 防抖地向后台提交数据更新
    emitInput: lodash.debounce(function() {
      console.log("防抖5秒，更新任务描述数据");
      this.$emit("input", this.description);
    }, 5000)
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
  background: #fff0;
}

.plan-description-content::placeholder {
  color: #bfbfbf;
}

.plan-description-content:focus {
  border: none;
  box-shadow: none;
}
</style>
