<template>
  <div :style="{ textAlign: 'left' }">
    <div
      :style="{
        padding: '15px',
        minHeight: '70px',
        boxShadow: scrollTop > 0 ? '0px 5px 6px -5px #000000b3' : 'none'
      }"
    >
      <!-- 标题 -->
      <span :style="{ fontSize: '26px' }">{{ title }}</span>
      <!-- 右上角功能区 -->
      <div :style="{ float: 'right', marginTop: '12px' }">
        <!-- 排序下拉框（当且仅当列表页有数据时显示） -->
        <a-dropdown
          :trigger="['click']"
          v-if="groups.length && selectedSortKey[0]"
        >
          <img
            class="super-icon"
            style="cursor: pointer; margin-right:10px"
            :src="selectedSortKey[0] === 'time' ? timeImage : levelImage"
          />
          <a-menu
            slot="overlay"
            :selectedKeys="selectedSortKey"
            @click="selectedSortKey = [$event.key]"
          >
            <a-menu-item key="time">
              <img
                class="super-icon"
                style="margin-right:15px"
                :src="timeImage"
              />
              按时间排序
            </a-menu-item>
            <a-menu-item key="level">
              <img
                class="super-icon"
                style="margin-right:15px"
                :src="levelImage"
              />
              按优先级排序
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <!-- 更多下拉框 -->
        <a-dropdown :trigger="['click']">
          <a-icon type="more" class="super-icon" />
          <a-menu slot="overlay">
            <a-menu-item key="detail" @click="showDetail = !showDetail">
              <span v-if="showDetail">
                <a-icon
                  type="eye-invisible"
                  style="margin-right: 10px; font-size: 14px;"
                />
                隐藏详情
              </span>
              <span v-else>
                <a-icon
                  type="eye"
                  style="margin-right: 10px; font-size: 14px;"
                />
                显示详情
              </span>
            </a-menu-item>
            <a-menu-item key="sync" @click="$store.dispatch('getPlans')">
              <a-icon
                type="sync"
                style="margin-right: 10px; font-size: 14px;"
              />
              同步任务
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <!-- 创建计划 -->
      <div
        v-if="showCreationGroupKey.indexOf(groupKey) > -1"
        style="padding-top:15px"
      >
        <plan-creation-input style="width:100%" />
      </div>
    </div>
    <!-- 计划列表 -->
    <div v-if="groups.length" style="overflow:hidden">
      <div
        :style="{
          overflowY: 'scroll',
          overflowX: 'hidden',
          maxHeight:
            showCreationGroupKey.indexOf(groupKey) > -1
              ? 'calc(100vh - 180px)'
              : 'calc(100vh - 134px)'
        }"
        @scroll="scrollTop = $event.target.scrollTop"
      >
        <a-collapse v-model="activeKey" :bordered="false" class="plan-collapse">
          <template #expandIcon="props">
            <a-icon
              type="caret-right"
              :rotate="props.isActive ? 90 : 0"
              style="color:#00000060"
            />
          </template>
          <a-collapse-panel :key="group.key" v-for="group in groups">
            <span slot="header" class="collapse-label">
              {{ group.title }}
            </span>
            <span slot="extra" class="collapse-label-right">
              {{ group.options.length }}
            </span>
            <div
              class="checkbox"
              :key="plan.id"
              v-for="plan in group.options"
              :style="{
                backgroundColor: currentPlanId === plan.id ? '#40a9ff24' : ''
              }"
            >
              <!-- 选择框 -->
              <plan-checkbox
                :value="plan.status === 1"
                :level="plan.level"
                :showLevel="true"
                :id="plan.id"
                :emitChange="true"
              />
              <div
                class="checkbox-content"
                @click="() => $store.dispatch('setCurrentPlanId', plan.id)"
              >
                <!-- 标题 -->
                <span class="checkbox-label">
                  {{ plan.title }}
                </span>
                <!-- 右上角 -->
                <div class="checkbox-right">
                  <!-- 提醒的符号 -->
                  <a-icon
                    type="bell"
                    v-if="plan.alarm"
                    style="padding-left: 10px"
                  />
                  <!-- 子任务的符号 -->
                  <a-icon
                    type="ordered-list"
                    v-if="plan.subTasks.length > 0"
                    style="padding-left: 10px"
                  />
                  <!-- 开始日期 -->
                  <span
                    v-if="plan.startDate._isValid"
                    :style="{
                      color: plan.isExpired() ? '#ff4d4f' : '',
                      paddingLeft: '10px'
                    }"
                  >
                    {{ plan.startDate.format("M月D日") }}
                  </span>
                </div>
                <!-- 底部的任务描述 -->
                <div
                  v-if="showDetail && plan.description"
                  class="checkbox-description"
                  :style="{
                    borderBottom:
                      currentPlanId !== plan.id ? '1px solid #ececec' : ''
                  }"
                >
                  {{ plan.description }}
                </div>
              </div>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>
    <div v-else class="plan-empty">
      <img :src="emptyImage" alt="" class="plan-empty-image" />
      <div class="plan-empty-title">没有任务哦，稍微放松下吧</div>
    </div>
  </div>
</template>

<script>
// 样式
// TODO: 对于已完成和已删除的计划，都只看日期分组降序

// 功能
// TODO: 增加按标题排序
// TODO: 默认展开全部（主要目的是看看如何在切换侧边栏时过渡效果不那么强烈）
// TODO: 当详情数据发生变动时，所测对应的数据并没有及时更新（如描述、日期、优先级等）

import PlanCreationInput from "./Items/CreationInput";
import PlanCheckbox from "./Items/Checkbox";

export default {
  components: { PlanCreationInput, PlanCheckbox },
  data() {
    const publicPath = process.env.BASE_URL;
    let defaultActiveKey = [
      "going",
      "expired",
      "nodate",
      "high",
      "medium",
      "low"
    ]; // 默认展开的列，默认不展开已完成和已删除列
    return {
      scrollTop: 0, // 计划列表部分的滚动情况
      currentPlanId: this.$store.state.currentPlanId, // 当前点击的计划ID
      groups: [], // 分组后的计划
      groupKey: "", // 当前选中的分组
      showCreationGroupKey: ["today", "recent", "all"], // 要显示创建计划 input 的分组
      dayNames: ["日", "一", "二", "三", "四", "五", "六"],
      defaultActiveKey: defaultActiveKey, // 默认展开的 key
      activeKey: defaultActiveKey, // 当前展开的 key
      publicPath: publicPath, // public 文件夹的位置
      selectedSortKey: ["time"], // 排序 menu 选中
      showDetail: true, // 是否显示详情
      title: "",
      timeImage: publicPath + "svg/" + "降序-时间.svg",
      levelImage: publicPath + "svg/" + "降序-优先级.svg",
      emptyImage: publicPath + "svg/" + "Relax.svg"
    };
  },
  watch: {
    "$store.state.currentGroupKey": function(to) {
      let planGroupMenu = this.$store.state.planGroupMenu;
      let menu = planGroupMenu[planGroupMenu.map(i => i.key).indexOf(to)];
      this.title = menu ? menu.name : "";
      this.groupKey = to;
    },
    "$store.state.currentPlans": function() {
      this.refreshCurrentGroups();
    },
    "$store.state.currentPlanId": function(to) {
      this.currentPlanId = to;
    },
    selectedSortKey(from, to) {
      if (from[0] !== to[0]) {
        this.refreshCurrentGroups();
        this.activeKey = this.defaultActiveKey; // 刷新展开列
      }
    }
  },
  methods: {
    // 对当前页面需要展示的计划，进行分组
    refreshCurrentGroups() {
      let groups = [];
      let key = this.selectedSortKey[0] || "";
      switch (key) {
        case "time":
          groups = this.sortPlanByTime();
          break;
        case "level":
          groups = this.sortPlanByLevel();
          break;
        default:
          break;
      }
      this.groups = groups;
      console.log("2 成功分组计划列表页");
    },
    onChange(plan) {
      // TODO: 添加完成事件
      console.log(`${plan}已完成`);
    },
    // 对计划进行排序，如果两个都有开始时间，则大的排在后面；如果只有一个有开始时间，则有开始时间的排在前面。
    sortPlan(a, b) {
      if (a.startDate._isValid) {
        if (b.startDate._isValid) {
          return a.startDate - b.startDate;
        } else {
          return -1;
        }
      } else {
        if (b.startDate._isValid) {
          return 1;
        } else {
          return -1;
        }
      }
    },
    // 对计划按照完成状态分组，并按时间排序
    sortPlanByTime() {
      let plans = [...this.$store.state.currentPlans];

      // 分组
      let going = []; // 进行中
      let expired = []; // 已过期
      let finished = []; // 已完成
      let trash = []; // 已删除
      let nodate = []; // 无日期
      for (let plan of plans) {
        if (plan.isDeleted) {
          trash.push(plan);
        } else if (plan.isExpired()) {
          expired.push(plan);
        } else if (plan.isFinished()) {
          finished.push(plan);
        } else if (plan.isGoing()) {
          going.push(plan);
        } else {
          nodate.push(plan);
        }
      }

      // 组内排序
      going.sort(this.sortPlan);
      finished.sort(this.sortPlan);
      expired.sort(this.sortPlan);
      trash.sort(this.sortPlan);
      nodate.sort(this.sortPlan);

      // 按顺序显示
      let group = [];

      if (expired.length) {
        group.push({ options: expired, title: "已过期", key: "expired" });
      }
      if (going.length) {
        group.push({ options: going, title: "进行中", key: "going" });
      }
      if (nodate.length) {
        group.push({ options: nodate, title: "无日期", key: "nodate" });
      }
      if (finished.length) {
        group.push({ options: finished, title: "已完成", key: "finished" });
      }
      if (trash.length) {
        group.push({ options: trash, title: "已删除", key: "trash" });
      }

      return group;
    },
    // 对计划按照优先级分组
    sortPlanByLevel() {
      let plans = [...this.$store.state.currentPlans];

      // 分组
      let highLevel = [];
      let mediumLevel = [];
      let lowLevel = [];
      let noneLevel = [];
      let finished = [];
      let trash = [];
      let nodate = [];
      for (let plan of plans) {
        if (plan.isDeleted) {
          trash.push(plan);
        } else if (plan.isFinished()) {
          finished.push(plan);
        } else if (plan.level === "high") {
          highLevel.push(plan);
        } else if (plan.level === "medium") {
          mediumLevel.push(plan);
        } else if (plan.level === "low") {
          lowLevel.push(plan);
        } else if (plan.level === "none") {
          noneLevel.push(plan);
        } else {
          nodate.push(plan);
        }
      }

      // 组内排序
      highLevel.sort(this.sortPlan);
      mediumLevel.sort(this.sortPlan);
      lowLevel.sort(this.sortPlan);
      noneLevel.sort(this.sortPlan);
      finished.sort(this.sortPlan);
      trash.sort(this.sortPlan);
      nodate.sort(this.sortPlan);

      // 按顺序显示
      let group = [];
      if (highLevel.length) {
        group.push({ options: highLevel, title: "高优先级", key: "high" });
      }
      if (mediumLevel.length) {
        group.push({
          options: mediumLevel,
          title: "中优先级",
          key: "medium"
        });
      }
      if (lowLevel.length) {
        group.push({ options: lowLevel, title: "低优先级", key: "low" });
      }
      if (noneLevel.length) {
        group.push({ options: noneLevel, title: "无优先级", key: "none" });
      }
      if (nodate.length) {
        group.push({ options: nodate, title: "无日期", key: "nodate" });
      }
      if (finished.length) {
        group.push({ options: finished, title: "已完成", key: "finished" });
      }
      if (trash.length) {
        group.push({ options: trash, title: "已删除", key: "trash" });
      }

      return group;
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
                : this.$moment(date).format("M月D日")),
            data: datePlans[date]
          };
        });
    }
  }
};
</script>

<style lang="less" scoped>
.plan-collapse {
  background-color: #ffffff00;
  // overflow-y: scroll;
  // overflow-x: hidden;

  /deep/ .ant-collapse-header {
    padding: 0;
  }

  /deep/ .ant-collapse-item {
    padding: 15px 0 0 0;
  }

  /deep/ .ant-collapse-content {
    width: 100%;
  }

  /deep/ .ant-collapse-content-box {
    padding: 0;
  }
}

.collapse-label {
  padding-left: 40px;
  font-size: 10px;
  color: #00000080;
}

.collapse-label-right {
  padding-right: 16px;
  font-size: 10px;
  color: #00000080;
}

.plan-empty {
  position: absolute;
  transform: translate(0, -80%);
  top: 50%;
  text-align: center;
  margin-top: 100px;
}

.plan-empty-image {
  width: 80%;
}

.plan-empty-title {
  color: #767879;
  padding-top: 20px;
}

.checkbox {
  padding: 3px 16px;
  cursor: pointer;
}

.checkbox-content {
  display: inline;
  padding-left: 10px;
}

.checkbox-right {
  font-size: 12px;
  right: 15px;
  padding-top: 5px;
  float: right;
  color: #00000070;
}

.checkbox-label,
.checkbox-description {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;
  width: 100%;
  display: inline-block;
}

.checkbox-description {
  font-size: 8px;
  color: #00000080;
  margin-left: 21px;
  line-height: 1;
  max-width: calc(100% - 21px);
  padding: 5px 0 5px 5px;
}

.checkbox-label {
  font-weight: bold;
  max-width: calc(100% - 130px);
  top: 5px;
  position: relative;
}

/* 隐藏下边栏 */
.ant-collapse-borderless > .ant-collapse-item {
  border-bottom: none;
}
.ant-collapse > .ant-collapse-item {
  border-bottom: none;
}
</style>
