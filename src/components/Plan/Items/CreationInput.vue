<template>
  <a-input
    v-model="title"
    placeholder="添加一个今天的任务，回车保存"
    class="create-input"
    @keydown.enter="handleCreate"
  >
    <span slot="suffix">
      <plan-level class="create-icon" style="margin: 0 5px" v-model="level" />
      <plan-time
        class="create-icon"
        style="margin: 0 5px"
        v-model="time"
        :showIcon="true"
      />
    </span>
  </a-input>
</template>

<script>
import PlanLevel from "./Level";
import PlanTime from "./Time";

export default {
  props: {},
  data() {
    return {
      title: "",
      level: "none",
      time: ""
    };
  },
  components: { PlanLevel, PlanTime },
  methods: {
    // 创建一个任务
    handleCreate() {
      if (this.title) {
        let today = this.$moment().format("Y-MM-DD HH:mm:ss");
        let res = this.time.split("__");

        let newPlan = {
          title: this.title,
          level: this.level,
          allDay: res.length > 1 ? res[0] === "true" : true,
          start: res.length > 1 ? res[1] : today,
          end: res.length > 2 ? res[2] : null
        };
        this.$store.dispatch("createPlan", newPlan);

        // 重置
        this.title = "";
        this.level = "none";
        this.title = "";
      }
    }
  }
};
</script>

<style lang="less" scoped>
.create-input {
  /deep/ .ant-input {
    background: #f2f2f2;
  }

  /deep/ .ant-input::placeholder {
    font-size: 10px;
    color: #b7b7b7;
  }
}
</style>
