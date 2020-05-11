<template>
  <div class="plan-page" v-if="plan.id">
    <plan-tag :visible.sync="visibleTag" />
    <!-- 标题 -->
    <div class="plan-header">
      <a-checkbox class="plan-header-checkbox" />
      <a-textarea
        class="plan-header-label"
        v-model="title"
        :maxLength="30"
        :autoSize="true"
        @keydown.enter="handleTitleEnter"
        @change="handleTitleChange"
      />
      <!-- 右上角功能区 -->
      <div :style="{ float: 'right' }">
        <a-tooltip
          :title="!plan.star ? '点击收藏' : '点击取消收藏'"
          trigger="hover"
          placement="bottom"
        >
          <a-avatar
            shape="square"
            :src="!plan.star ? starImage : unstarImage"
            :size="14"
            class="plan-header-star"
            @click="handleStar"
          />
        </a-tooltip>
        <a-button type="primary" size="small">保存</a-button>
      </div>
    </div>
    <!-- 任务标签 -->
    <div class="plan-tags">
      <a-icon type="tags" class="taks-icon" />
      <a-tag v-for="tag in plan.tags" :key="tag">
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
    <div class="plan-time">
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
    </div>
    <!-- 提醒 -->
    <div class="plan-alarm">
      <a-icon type="bell" class="taks-icon" />
      <span>提醒策略：{{ plan.alarmStrategy }}</span>
    </div>
    <!-- 地点 -->
    <div class="plan-position">
      <a-icon type="environment" class="taks-icon" />
      <span>地址：{{ plan.position }}</span>
    </div>
    <!-- 子任务 -->
    <div class="plan-sub-plan">
      <a-icon type="ordered-list" class="taks-icon" />
      <div class="plan-sub-plan-content">
        子任务列表
      </div>
    </div>
    <!-- 描述 -->
    <div class="plan-description">
      <a-icon type="file-text" class="taks-icon" />
      <a-textarea
        placeholder="添加任务描述"
        :rows="10"
        v-model="description"
        class="plan-description-content"
        :autoSize="{
          minRows: 8,
          maxRows: 18
        }"
      />
    </div>
  </div>
  <div v-else-if="$store.state.currentPlans.length > 0" class="plan-empty">
    <img :src="emptyImage" alt="" class="plan-empty-image" />
    <div class="plan-empty-title">点击标题查看详情</div>
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

      // 任务属性
      title: "",
      description: "",

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
    // 更新计划
    updatePlan(data) {
      this.$request({
        url: `/api/plans/${this.plan.id}`,
        method: "put",
        data: data
      }).then(res => {
        // 更新列表里的数据
        let plans = [...this.$store.state.planDataFull];
        let targets = plans.filter(item => item.id === res.data.id);
        let target = targets.length === 1 ? targets[0] : undefined;

        if (target) {
          console.log("更新前", target);
          console.log("更新内容", target);
          for (let key in data) {
            target[key] = res.data[key];
          }
          console.log("更新后", target);
        } else {
          console.log(`未找到目标计划: ${this.plan.id}`);
        }
        this.$store.state.planDataFull = plans;
      });
    },
    // 编辑标题，只有编辑完（type 是 change 而非 input），才更新数据
    handleTitleChange(e) {
      if (e.type === "change") {
        console.log("标题保存：点击外部");
        this.updatePlan({ title: this.title });
      }
    },
    // 标题的回车事件，禁止回车，并且提交更新
    handleTitleEnter(e) {
      if (e.keyCode == 13) {
        console.log("标题保存：回车");
        e.returnValue = false; // 不返回值，也就是说不执行回车了
        e.target.blur(); // 让 input 失去焦点，自动触发 change
      }
    },
    // 收藏/取消收藏
    handleStar() {
      console.log(this.plan.star ? "取消收藏" : "收藏");
      this.updatePlan({ star: !this.plan.star });
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
  computed: {
    plan() {
      // 看看选中的计划是否在当前页，如果不在，则不显示
      let currentPlan = this.$store.state.currentPlan;
      let targets = this.$store.state.currentPlans.filter(
        plan => plan.id === currentPlan.id
      );
      let target = targets.length === 1 ? targets[0] : {};
      console.log("5 在详情页成功获取到最新数据");
      return Object.create(target); // 复制对象
    }
  },
  watch: {
    plan(to) {
      this.timeTabKey = to.allDay ? "1" : "2";

      this.checkedAllDay = to.allDay;
      this.description = to.description;
      this.title = to.title;
    }
  }
};
</script>

<style scoped>
.plan-page {
  text-align: left;
  padding: 15px;
}

.plan-empty {
  position: absolute;
  transform: translate(0, -80%);
  top: 50%;
}

.plan-empty-image {
  width: 80%;
}

.plan-empty-title {
  color: #767879;
  padding-top: 20px;
}

.taks-icon {
  padding-right: 10px;
}

.plan-description,
.plan-position,
.plan-tags,
.plan-time,
.plan-alarm,
.plan-sub-plan,
.plan-header {
  margin: 10px 0;
}

.plan-header-checkbox {
  float: left;
}

.plan-header-label {
  font-weight: bold;
  font-size: 16px;
  display: -webkit-inline-box;
  padding: 0 10px;
  width: calc(100% - 130px);
  margin-left: 10px;
  border: none;
  resize: none;
}

.plan-header-label:focus {
  border-color: none;
  border-right-width: none;
  outline: 0;
  box-shadow: none;
}

.plan-header-star {
  margin: 0 15px 2px 0;
}

.plan-tags {
  line-height: 2;
}

.plan-sub-plan-content {
  display: inline-block;
  width: calc(100% - 40px);
}

.plan-description-content {
  width: calc(100% - 40px);
  vertical-align: top;
  border: none;
  padding: 0;
}

.plan-description-content:focus {
  border: 1px solid #40a9ff;
}
</style>
