<template>
  <a-dropdown :trigger="['click']">
    <a-tooltip
      :title="value !== 'none' ? '修改优先级' : '设置优先级'"
      trigger="hover"
      placement="top"
    >
      <img
        class="super-icon"
        style="cursor: pointer;"
        :src="levelDict[value] ? levelDict[value].src : levelDict['none'].src"
      />
    </a-tooltip>
    <a-menu slot="overlay" v-model="level" selectable>
      <a-menu-item v-for="lv in levels" :key="lv.key">
        <img class="super-icon" :src="lv.src" style="margin-right: 10px" />
        {{ lv.content }}
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
export default {
  props: {
    value: String
  },
  data() {
    let publicPath = process.env.BASE_URL;
    let levels = [
      {
        src: publicPath + "svg/" + "高优先级.svg",
        key: "high",
        content: "高优先级"
      },
      {
        src: publicPath + "svg/" + "中优先级.svg",
        key: "medium",
        content: "中优先级"
      },
      {
        src: publicPath + "svg/" + "低优先级.svg",
        key: "low",
        content: "低优先级"
      },
      {
        src: publicPath + "svg/" + "无优先级.svg",
        key: "none",
        content: "无优先级"
      }
    ];
    let levelDict = {};
    for (let lv of levels) {
      levelDict[lv.key] = lv;
    }
    return {
      level: [this.value],
      levels: levels, // 优先级列表
      levelDict: levelDict // 优先级字典
    };
  },
  watch: {
    value(to) {
      this.level = [to];
    },
    level(to) {
      if (this.value !== to[0]) {
        this.emitInput();
      }
    }
  },
  methods: {
    // 向后台提交数据更新
    emitInput() {
      console.log("更新优先级");
      this.$emit("input", this.level[0]);
    }
  }
};
</script>

<style scoped></style>
