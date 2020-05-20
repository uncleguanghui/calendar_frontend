<template>
  <a-dropdown :trigger="['click']">
    <a-button type="primary">
      快速创建
      <a-icon type="down" />
    </a-button>
    <div
      slot="overlay"
      :style="{
        width: '210px',
        border: '1px solid #e8e8e8',
        padding: '10px',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
      }"
    >
      <a-card
        class="main-card"
        :headStyle="{
          padding: '0 0 5px 10px',
          border: 'none',
          minHeight: '20px'
        }"
        :bodyStyle="{ padding: '0' }"
      >
        <div slot="title" class="card-title">计划</div>
        <a-card-grid class="card-item" @click="planVisible = true">
          <a-icon class="card-icon" :component="svgPlan" />
          <span class="card-text">计划</span>
          <!-- <plan v-model="planVisible" /> -->
        </a-card-grid>
        <a-card-grid class="card-item" @click="inventoryVisible = true">
          <a-icon class="card-icon" :component="svgInventory" />
          <span class="card-text">清单</span>
          <!-- <inventory v-model="inventoryVisible" /> -->
        </a-card-grid>
        <a-card-grid class="card-item" @click="courseVisible = true">
          <a-icon class="card-icon" :component="svgCourse" />
          <span class="card-text">课程</span>
          <course v-model="courseVisible" />
        </a-card-grid>
      </a-card>
      <a-card
        class="main-card"
        :headStyle="{
          padding: '10px 0 0 10px',
          border: 'none',
          minHeight: '20px'
        }"
        :bodyStyle="{ padding: '0' }"
      >
        <div slot="title" class="card-title">提醒</div>
        <a-card-grid class="card-item" @click="reminderVisible = true">
          <a-icon class="card-icon" :component="svgReminder" />
          <span class="card-text">提醒</span>
          <reminder v-model="reminderVisible" />
        </a-card-grid>
        <a-card-grid class="card-item" @click="commemorationVisible = true">
          <a-icon class="card-icon" :component="svgCommemoration" />
          <span class="card-text">纪念</span>
          <commemoration v-model="commemorationVisible" />
        </a-card-grid>
        <a-card-grid class="card-item" @click="birthdayVisible = true">
          <a-icon class="card-icon" :component="svgBirthday" />
          <span class="card-text">生日</span>
          <birthday v-model="birthdayVisible" />
        </a-card-grid>
      </a-card>
    </div>
  </a-dropdown>
</template>

<script>
import svgPlan from "../../../public/svg/计划.svg";
// import Plan from "./Event/Plan";

import svgInventory from "../../../public/svg/清单.svg";
// import Inventory from "./Event/Inventory";

import svgCourse from "../../../public/svg/课程.svg";
import Course from "./Event/Course";

import svgReminder from "../../../public/svg/提醒.svg";
import Reminder from "./Event/Reminder";

import svgCommemoration from "../../../public/svg/纪念.svg";
import Commemoration from "./Event/Commemoration";

import svgBirthday from "../../../public/svg/生日.svg";
import Birthday from "./Event/Birthday";

export default {
  components: {
    // Plan,
    // Inventory,
    Course,
    Commemoration,
    Reminder,
    Birthday
  },
  data() {
    return {
      svgPlan,
      planVisible: false,

      svgInventory,
      inventoryVisible: false,

      svgCourse,
      courseVisible: false,

      svgReminder,
      reminderVisible: false,

      svgCommemoration,
      commemorationVisible: false,

      svgBirthday,
      birthdayVisible: false
    };
  },
  methods: {
    handleButtonClick(e) {
      console.log("click left button", e);
    },
    handleMenuClick(e) {
      console.log("click", e);
    }
  }
};
</script>

<style lang="less" scoped>
.main-card {
  border: none;

  /deep/ .ant-card-head-title {
    padding: 0;
  }
}

.card-item {
  width: 33%;
  text-align: center;
  padding: 10px 0 0 0;
  box-shadow: none;
  cursor: pointer;
}

.card-item:hover {
  background: #e6f7ff;
}

.card-title {
  padding: 0;
  font-size: 14px;
}

.card-icon {
  font-size: 24px;
}

.card-text {
  font-size: 8px;
  color: #a6a8a8;
  display: block;
}
</style>
