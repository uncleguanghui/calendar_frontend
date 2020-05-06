<template>
  <div class="page">
    <a-collapse
      v-model="activeKey"
      :bordered="false"
      :style="{ backgroundColor: '#fff' }"
    >
      <a-collapse-panel :key="item.key" v-for="item in data">
        <div slot="header">
          <span>{{ item.title }}</span>
          <span :style="{ float: 'right' }">{{ item.options.length }}</span>
        </div>
        <div
          :style="{ maxHeight: '50px' }"
          :key="plan.id"
          v-for="plan in item.options"
        >
          <a-checkbox>
            <div class="checkbox-content">
              <span class="checkbox-label">{{ plan.title }}</span>
              <div class="checkbox-right">
                {{ plan.endString }}
              </div>
              <div
                v-if="selectedDetailKey === 'show'"
                class="checkbox-description"
              >
                {{ plan.description }}
              </div>
            </div>
          </a-checkbox>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
export default {
  props: {
    // 排序对象
    selectedSortKey: {
      require: true
    },
    // 详情选择情况
    selectedDetailKey: {
      require: true
    }
  },
  data() {
    const headers = {
      level: [
        { key: "highLevel", title: "高优先级" },
        { key: "mediumLevel", title: "中优先级" },
        { key: "lowLevel", title: "低优先级" },
        { key: "noneLevel", title: "无优先级" },
        { key: "finished", title: "已完成" }
      ],
      time: [
        { key: "expired", title: "已过期" },
        { key: "going", title: "进行中" },
        { key: "finished", title: "已完成" }
      ]
    };
    return {
      headers: headers,
      activeKey: headers[this.selectedSortKey]
        .map(obj => obj.key)
        .filter(key => key !== "finished")
    };
  },
  computed: {
    data() {
      const groupPlanData =
        this.$store.state.groupPlanData[this.$router.currentRoute.path] || {};
      const result = this.headers[this.selectedSortKey]
        .map(obj => {
          obj.options = groupPlanData[obj.key];
          return obj;
        })
        .filter(obj => obj.options && obj.options.length > 0);
      return result;
    }
  }
};
</script>

<style scoped>
.checkbox-content {
  display: contents;
}

.checkbox-label {
  font-weight: bold;
}

.checkbox-right {
  right: 15px;
  display: inline-block;
  position: absolute;
}

.checkbox-description {
  font-size: 8px;
  margin-left: 23px;
  line-height: 2;
  border-bottom: 1px solid #ececec;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;
  width: 100%;
  display: block;
  max-width: calc(50vw - 160px);
}
</style>
