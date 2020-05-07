<template>
  <div class="task-page" v-if="task.id">
    <plan-tag :visible.sync="visibleTag" />
    <!-- 标题 -->
    <div class="task-header">
      <a-checkbox />
      <span class="task-header-label">{{ task.title }}</span>
      <!-- 右上角功能区 -->
      <div :style="{ float: 'right' }">
        <a-tooltip
          :title="task && !task.star ? '点击收藏' : '点击取消收藏'"
          trigger="hover"
          placement="bottom"
        >
          <a-avatar
            shape="square"
            :src="task && !task.star ? starImage : unstarImage"
            :size="18"
            :style="{ marginRight: '15px' }"
          />
        </a-tooltip>
        <a-button type="primary">保存</a-button>
      </div>
    </div>
    <!-- 任务标签 -->
    <div class="task-tags">
      <a-icon type="tags" class="taks-icon" />
      <a-tag v-for="tag in task.tags" :key="tag">
        {{ tag }}
      </a-tag>
      <a-tag
        style="background: #fff; borderStyle: dashed;"
        @click="visibleTag = !visibleTag"
      >
        <a-icon type="plus" /> 添加标签
      </a-tag>
    </div>
    <!-- 任务时间 -->
    <div class="task-time">
      <a-icon type="clock-circle" class="taks-icon" />
      <a-checkbox v-model="checkedAllDay">全天</a-checkbox>
      <div :style="{ paddingLeft: '24px' }">
        <div :style="{ paddingBottom: '5px' }">
          <span :style="{ paddingRight: '10px', verticalAlign: 'bottom' }">
            开始
          </span>
          <a-date-picker
            v-model="startDate"
            size="small"
            :disabled-date="disabledStartDate"
            :style="{
              width: '100px',
              verticalAlign: 'bottom'
            }"
            format="MM-DD"
            placeholder="开始"
            @openChange="handleStartOpenChange"
          />
          <a-time-picker
            v-if="!checkedAllDay"
            :style="{
              width: '120px',
              verticalAlign: 'bottom',
              paddingLeft: '10px'
            }"
            size="small"
            use12-hours
            format="h:mm a"
            @change="handleStartTimeChange"
            v-model="startTime"
          />
        </div>
        <div>
          <span :style="{ paddingRight: '10px', verticalAlign: 'bottom' }">
            结束
          </span>
          <a-date-picker
            v-model="endDate"
            size="small"
            :disabled-date="disabledEndDate"
            :style="{ width: '100px', verticalAlign: 'bottom' }"
            format="MM-DD"
            placeholder="结束"
            :open="endOpen"
            @openChange="handleEndOpenChange"
          />
          <a-time-picker
            v-if="!checkedAllDay"
            :style="{
              width: '120px',
              verticalAlign: 'buttom',
              paddingLeft: '10px'
            }"
            size="small"
            use12-hours
            format="h:mm a"
            @change="handleEndTimeChange"
            v-model="endTime"
          />
        </div>
      </div>
      <!-- <a-tabs type="card" @change="callback" v-model="timeTabKey">
        <a-tab-pane key="1" tab="全天">
          Content of Tab Pane 1
        </a-tab-pane>
        <a-tab-pane key="2" tab="分时段">
          <div>
            <span>开始</span>
            <a-date-picker
              v-model="startDate"
              :disabled-date="disabledStartDate"
              :style="{ width: '100px' }"
              format="MM-DD"
              placeholder="开始"
              @openChange="handleStartOpenChange"
            />
            <a-time-picker
              :style="{ width: '120px' }"
              use12-hours
              format="h:mm a"
              @change="handleStartTimeChange"
              v-model="startTime"
            />
          </div>
          <div>
            <span>结束</span>
            <a-date-picker
              v-model="endDate"
              :disabled-date="disabledEndDate"
              :style="{ width: '100px' }"
              format="MM-DD"
              placeholder="结束"
              :open="endOpen"
              @openChange="handleEndOpenChange"
            />
            <a-time-picker
              :style="{ width: '120px' }"
              use12-hours
              format="h:mm a"
              @change="handleEndTimeChange"
              v-model="endTime"
            />
          </div>
        </a-tab-pane>
      </a-tabs> -->
    </div>
    <!-- 提醒 -->
    <div class="task-alarm">
      <a-icon type="bell" class="taks-icon" />
      <span>提醒策略：{{ task.alarmStrategy }}</span>
    </div>
    <!-- 地点 -->
    <div class="task-position">
      <a-icon type="environment" class="taks-icon" />
      <span>地址：{{ task.position }}</span>
    </div>
    <!-- 子任务 -->
    <div class="task-sub-task">
      <a-icon type="ordered-list" class="taks-icon" />
      <div class="task-sub-task-content">
        子任务列表
      </div>
    </div>
    <!-- 描述 -->
    <div class="task-description">
      <a-icon type="file-text" class="taks-icon" />
      <a-textarea
        placeholder="添加任务描述"
        :rows="10"
        v-model="description"
        class="task-description-content"
        :autoSize="{
          minRows: 8,
          maxRows: 18
        }"
      />
    </div>
  </div>
  <div v-else-if="planNum > 0" class="task-empty">
    <img :src="emptyImage" alt="" class="task-empty-image" />
    <div class="task-empty-title">点击标题查看详情</div>
  </div>
</template>

<script>
import PlanTag from "./PlanTag";
export default {
  components: { PlanTag },
  data() {
    const publicPath = process.env.BASE_URL;
    return {
      publicPath: publicPath, // public 文件夹的位置
      starImage: publicPath + "icons/" + "收藏.png",
      unstarImage: publicPath + "icons/" + "未收藏.png",
      emptyImage: publicPath + "images/" + "Knowledge.svg",
      visibleTag: false, //标签处理页是否可见
      checkedAllDay: false, //全天选择
      description: "", //任务描述

      // 日期选择
      timeTabKey: "1", //时间标签页的激活key
      startDate: this.$moment(new Date()),
      endDate: this.$moment(new Date()),
      endOpen: false,
      // 时间选择
      startTime: this.$moment(new Date()),
      endTime: this.$moment(new Date())
    };
  },
  methods: {
    callback(key) {
      console.log(key);
    },
    // 日期格式化
    dateFormat(fmt, date) {
      let ret;
      const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
          );
        }
      }
      return fmt;
    },
    disabledStartDate(startDate) {
      const endDate = this.endDate;
      if (!startDate || !endDate) {
        return false;
      }
      return startDate.valueOf() > endDate.valueOf();
    },
    disabledEndDate(endDate) {
      const startDate = this.startDate;
      if (!endDate || !startDate) {
        return false;
      }
      return startDate.valueOf() >= endDate.valueOf();
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    handleStartTimeChange(time) {
      this.startTime = time;
    },
    handleEndTimeChange(time) {
      this.endTime = time;
    }
  },
  watch: {
    task(to) {
      this.timeTabKey = to.allDay ? "1" : "2";
      this.checkedAllDay = to.allDay;
      this.description = to.description;
    }
  },
  computed: {
    task() {
      // 返回被点击的、且在当前路径下也存在的任务
      // 如果任务在别的路径下也有，则在点击别的路径时，继续保留任务。
      const data = this.$store.state.groupPlanData[
        this.$router.currentRoute.path
      ];
      const plans = [
        ...(data.finished || []),
        ...(data.expired || []),
        ...(data.going || [])
      ];
      const results =
        plans.filter(obj => obj.id == this.$store.state.planId) || [];
      const task = results.length ? results[0] : {};
      return task;
    },
    planNum() {
      // 当前页面的任务数量
      const data =
        this.$store.state.groupPlanData[this.$router.currentRoute.path] || {};
      const num =
        (data.finished || []).length +
        (data.expired || []).length +
        (data.going || []).length;
      return num;
    }
  }
};
</script>

<style scoped>
.task-page {
  text-align: left;
  padding: 15px;
}

.task-header-label {
  font-weight: bold;
  font-size: 20px;
  padding: 0 10px;
}

.task-empty {
  position: absolute;
  transform: translate(0, -80%);
  top: 50%;
}

.task-empty-image {
  width: 80%;
}

.task-empty-title {
  color: #767879;
  padding-top: 20px;
}

.taks-icon {
  padding-right: 10px;
}

.task-description,
.task-position,
.task-tags,
.task-time,
.task-alarm,
.task-sub-task,
.task-header {
  margin: 10px 0;
}

/* .task-time {
  display: flex;
} */

.task-sub-task-content {
  display: inline-block;
  width: calc(100% - 40px);
}

.task-description-content {
  width: calc(100% - 40px);
  vertical-align: top;
  border: none;
  padding: 0;
}

.task-description-content:focus {
  border: 1px solid #40a9ff;
}
</style>
