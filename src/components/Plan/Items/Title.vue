<template>
  <a-textarea
    class="plan-header-label"
    v-model="title"
    :maxLength="30"
    :autoSize="true"
    @keydown.enter="handleTitleEnter"
    @change="emitInput"
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
      title: this.value
    };
  },
  methods: {
    // 防抖地向后台提交数据更新
    emitInput: lodash.debounce(function() {
      console.log("防抖5秒，更新标题数据");
      this.$emit("input", this.title);
    }, 5000),
    // 标题的回车事件，禁止回车，并且提交更新
    handleTitleEnter(e) {
      if (e.keyCode == 13) {
        console.log("阻止标题回车");
        e.returnValue = false; // 不返回值，也就是说不执行回车了
        e.target.blur(); // 让 input 失去焦点，自动触发 change
      }
    }
  },
  watch: {
    value(to) {
      this.title = to;
    }
  }
};
</script>

<style scoped>
.plan-header-label {
  font-weight: bold;
  font-size: 16px;
  display: -webkit-inline-box;
  padding: 0 10px;
  border: none;
  resize: none;
}

.plan-header-label:focus {
  border-color: none;
  border-right-width: none;
  outline: 0;
  box-shadow: none;
}
</style>
