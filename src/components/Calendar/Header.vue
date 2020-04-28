<template>
  <div class="header">
    <a-select
      showSearch
      :value="year"
      :style="{ width: '100px', marginRight: '10px' }"
      @change="changeYear"
    >
      <a-select-option
        :value="year"
        :key="year"
        v-for="year in range(2000, 2030)"
      >
        {{ year + "年" }}
      </a-select-option>
    </a-select>
    <a-select
      showSearch
      :value="month"
      :style="{ width: '80px' }"
      @change="changeMonth"
    >
      <a-select-option
        :value="month"
        :key="month"
        v-for="month in range(1, 13)"
      >
        {{ month + "月" }}
      </a-select-option>
    </a-select>
    <div class="tips">
      <div class="tips-month">
        <a-tooltip title="上个月" trigger="hover" placement="bottom">
          <div class="prev" @click="prevMonth">
            <a-icon type="left" />
          </div>
        </a-tooltip>
        <a-tooltip title="下个月" trigger="hover" placement="bottom">
          <span class="next" @click="nextMonth">
            <a-icon type="right" />
          </span>
        </a-tooltip>
      </div>
      <a-button @click="returnToToday" class="today">今天</a-button>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import "moment/locale/zh-cn";

moment.locale("zh-cn");

export default {
  props: {
    date: {
      required: true
    }
  },
  computed: {
    monthString() {
      return this.date.getFullYear() + "年" + (this.date.getMonth() + 1) + "月";
    }
  },
  watch: {
    date(to) {
      this.year = to.getFullYear();
      this.month = to.getMonth() + 1;
    }
  },
  data() {
    return {
      moment,
      time: undefined,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1
    };
  },
  components: {},
  methods: {
    range(start, end, step = 1) {
      let arr = [];
      for (let i = start; i < end; i++) {
        if (i % step == 0) {
          arr.push(i);
        }
      }
      return arr;
    },
    updateDate() {
      this.$emit("update:date", new Date(this.year, this.month - 1));
    },
    changeYear(year) {
      this.year = year;
      this.updateDate();
    },
    changeMonth(month) {
      this.month = month;
      this.updateDate();
    },
    prevMonth() {
      this.year -= this.month == 1 ? 1 : 0;
      this.month -= this.month == 1 ? -11 : 1;
      this.updateDate();
    },
    nextMonth() {
      this.year += this.month == 12 ? 1 : 0;
      this.month += this.month == 12 ? -11 : 1;
      this.updateDate();
    },
    returnToToday() {
      this.year = new Date().getFullYear();
      this.month = new Date().getMonth() + 1;
      this.updateDate();
    }
  }
};
</script>

<style scoped>
.header {
  height: 60px;
  /* text-align: center; */
  /* vertical-align: middle; */
  padding-top: 15px;
}

.title {
  font-size: 30px;
}

.tips {
  float: right;
  margin-right: 10px;
}

.tips-month {
  display: inline-block;
  margin-right: 10px;
}

.prev,
.next {
  z-index: 2;
  background: #d9d9d9;
  color: #565656;
  display: inline-block;
  height: 32px;
  padding: 0 15px;
  cursor: pointer;
  line-height: 30px;
}

.prev {
  border-radius: 4px 0 0 4px;
}

.next {
  border-radius: 0 4px 4px 0;
}

.prev:hover,
.next:hover {
  color: #fff;
  background: #1890ff;
}

.today:hover {
  color: #fff;
  background: #1890ff;
}

@media screen and (max-width: 640px) {
  .today,
  .next,
  .prev {
    display: none;
  }
}
</style>
