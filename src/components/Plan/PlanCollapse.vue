<template>
  <div class="page" v-if="data.length > 0">
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
        <div class="checkbox" :key="plan.id" v-for="plan in item.options">
          <a-checkbox @change="() => onChange(plan.id)" />
          <div class="checkbox-content" @click="() => clickHandle(plan.id)">
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
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
  <div v-else class="plan-empty">
    <img :src="emptyImage" alt="" class="plan-empty-image" />
    <div class="plan-empty-title">没有任务哦，稍微放松下吧</div>
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
    const publicPath = process.env.BASE_URL;
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
        .filter(key => key !== "finished"),
      emptyImage: publicPath + "images/" + "Relax.svg"
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
  },
  methods: {
    onChange(planId) {
      // todo: 添加完成事件
      console.log(`${planId}已完成`);
    },
    clickHandle(planId) {
      this.$store.state.planId = planId;
    },
    // 对计划列表 data ，按照列表内元素的日期进行分组
    groupDate(data) {
      // 对进行中的任务，按日期进行分组
      var datePlans = {};
      for (let plan of data) {
        const key = new Date(plan.end).toDateString();
        if (datePlans[key]) {
          datePlans[key].push(plan);
        } else {
          datePlans[key] = [plan];
        }
      }
      // 按日期降序
      return Array.from(
        new Set(data.map(plan => new Date(plan.end).toDateString()))
      )
        .sort((a, b) => new Date(b) - new Date(a))
        .map(date => {
          return {
            title:
              "周" +
              this.dayNames[new Date(date).getDay()] +
              ", " +
              (new Date(date).toDateString() === new Date().toDateString()
                ? "今天"
                : this.$dateFormat("m月d日", new Date(date))),
            data: datePlans[date]
          };
        });
    }
  }
};
</script>

<style scoped>
.plan-empty {
  position: absolute;
  transform: translate(0, -80%);
  top: 50%;
  text-align: center;
}

.plan-empty-image {
  width: 80%;
}

.plan-empty-title {
  color: #767879;
  padding-top: 20px;
}

.checkbox {
  max-height: 50px;
  margin: 10px 0;
}

.checkbox-content {
  display: inline;
  padding-left: 10px;
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
  margin-left: 25px;
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
  max-width: calc(100% - 20px);
}

/* 隐藏下边栏 */
.ant-collapse-borderless > .ant-collapse-item {
  border-bottom: none;
}
.ant-collapse > .ant-collapse-item {
  border-bottom: none;
}
</style>
