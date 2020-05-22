<template>
  <a-checkbox
    v-model="checked"
    @change="onChange"
    class="plan-checkbox"
    :style="style"
  />
</template>

<script>
export default {
  name: "",
  props: {
    value: {
      // 初始选择状态
      type: Boolean,
      default: false
    },
    id: String, // 任务ID
    emitChange: {
      // 是否提交改变
      type: Boolean,
      default: false
    },
    showLevel: {
      //是否显示优先级
      type: Boolean,
      default: false
    },
    level: {
      // 优先级
      type: String,
      default: "none",
      validator: function(value) {
        return ["high", "low", "medium", "none"].indexOf(value) > -1;
      }
    }
  },
  data() {
    return {
      checked: this.value,
      levelColor: {
        high: "#f54a45",
        medium: "#ffc107",
        low: "#3476fe",
        none: "#a8a8a8"
      } // 不同优先级的颜色
    };
  },
  methods: {
    onChange() {
      if (this.emitChange) {
        if (!this.id) {
          console.warn("没有传入有效的ID");
        }
        this.$store.dispatch("updatePlan", {
          id: this.id,
          data: { status: this.checked ? 1 : 0 }
        });
      }
      this.$emit("input", this.checked);
    }
  },
  computed: {
    style() {
      if (this.showLevel) {
        if (this.checked) {
          return {
            "--background-color": "#e8e8e8",
            "--border-color": "#e8e8e8"
          };
        } else {
          return {
            "--background-color": this.levelColor[this.level] + "20",
            "--border-color": this.levelColor[this.level] + "90"
          };
        }
      } else {
        if (this.checked) {
          return {
            "--background-color": "#1890ff",
            "--border-color": "#1890ff"
          };
        } else {
          return {
            "--background-color": "#fff",
            "--border-color": "#d9d9d9"
          };
        }
      }
    }
  },
  watch: {
    value(to) {
      this.checked = to;
    }
  }
};
</script>

<style lang="less" scoped>
.plan-checkbox {
  /deep/ .ant-checkbox-inner {
    background-color: var(--background-color);
    border-color: var(--border-color);
  }
  // 取消从未选中到选中的切换过程中的变色
  /deep/ .ant-checkbox-checked::after {
    border-color: var(--border-color);
  }
}
</style>
