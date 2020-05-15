<template>
  <a-dropdown v-if="showDropdown" :trigger="['click']">
    <a-tooltip
      :title="value !== 'none' ? '修改优先级' : '设置优先级'"
      trigger="hover"
      placement="top"
    >
      <a-avatar
        class="pointer-icon"
        shape="square"
        :src="levelDict[value] ? levelDict[value].src : levelDict['none'].src"
        :size="20"
      />
    </a-tooltip>
    <a-menu slot="overlay" v-model="level" selectable>
      <a-menu-item v-for="lv in levels" :key="lv.key">
        <a-avatar
          shape="square"
          :src="lv.src"
          :size="20"
          style="margin-right: 10px"
        />
        {{ lv.content }}
      </a-menu-item>
    </a-menu>
  </a-dropdown>
  <a-avatar
    v-else
    class="level-icon"
    shape="square"
    :src="levelDict[value] ? levelDict[value].src : levelDict['none'].src"
    :size="20"
  />
</template>

<script>
export default {
  props: {
    value: String,
    showDropdown: {
      type: Boolean,
      default: true
    }
  },
  data() {
    let publicPath = process.env.BASE_URL;
    let levels = [
      {
        src: publicPath + "icons/" + "高优先级.png",
        key: "high",
        content: "高优先级"
      },
      {
        src: publicPath + "icons/" + "中优先级.png",
        key: "medium",
        content: "中优先级"
      },
      {
        src: publicPath + "icons/" + "低优先级.png",
        key: "low",
        content: "低优先级"
      },
      {
        src: publicPath + "icons/" + "无优先级.png",
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

<style scoped>
.pointer-icon {
  cursor: pointer;
}
</style>
