<template>
  <div class="page">
    <a-card :bordered="false">
      <div :style="{ backgroundColor: '#fff' }">
        <div class="card-image">
          <img :src="cityTodayInfo.weatherImage" width="100%" />
        </div>
        <div class="card-wave">
          <wave />
        </div>
        <div class="card-info">
          <div class="title">{{ cityTodayInfo.weather }}</div>
          <div class="description">{{ cityTodayInfo.cityName }}</div>
          <div class="temperature">{{ cityTodayInfo.temperature }}</div>
        </div>
      </div>
      <a-card-grid
        class="card-grid"
        :key="result.day"
        v-for="result in nextWeathers()"
      >
        <div class="sub-title">{{ result.day }}</div>
        <div class="sub-icon">
          <a-avatar :src="getWeatherIcon(result['天气'])" />
        </div>
        <div class="sub-weather">{{ result["天气"] }}</div>
      </a-card-grid>
    </a-card>
  </div>
</template>

<script>
import Wave from "./Wave";

export default {
  components: { Wave },
  props: {
    date: {
      required: true
    }
  },
  data() {
    return {
      publicPath: process.env.BASE_URL, // public 文件夹的位置
      dayNames: ["日", "一", "二", "三", "四", "五", "六"]
    };
  },
  methods: {
    // 天气格式化
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
    getWeatherImage(weather) {
      if (weather) {
        return this.publicPath + "images/" + "image(11).jpg";
      } else {
        return this.publicPath + "images/" + "image(11).jpg";
      }
    },
    // 根据名称获取图标
    getWeatherIcon(weather) {
      if (!weather) {
        return this.publicPath + "weather/" + "未知.png";
      }

      // 对于被匹配的天气字符串 weather ，逐字查找天气图标字典 weatherDict ，直到找到匹配结果
      var iconList = [];
      for (let key of weather) {
        if (this.$store.state.weatherDict[key]) {
          iconList = this.$store.state.weatherDict[key];
          break;
        }
      }

      var target;
      if (iconList.length) {
        // 看匹配到的天气图标列表 iconList，根据图标名称 ，获取各图标名称在被匹配的天气字符串 weather 中的位置
        var iconIndex = {};
        for (let icon of iconList) {
          const iconName = icon.split(".")[0];
          const index = weather.indexOf(iconName);
          if (index >= 0) {
            iconIndex[index] = iconIndex[index]
              ? [...iconIndex[index], icon]
              : [icon];
          }
        }

        // 从位置0开始查找，看看是否有对应的可选图标，如果有则取第一个图标，如果没有，则用匹配到的天气图标列表 iconList 的第一个
        target = iconList[0];
        for (let index = 0; index < weather.length; index++) {
          if (index in iconIndex) {
            target = iconIndex[index][0];
            break;
          }
        }
      } else {
        // 如果匹配不到结果，则返回未知，并在控制台中打印天气名
        console.log(weather);
        target = "未知.png";
      }
      return this.publicPath + "weather/" + target;
    },
    // 从某天开始获取之后的N天
    nextDates(date, days) {
      var dates = [];
      for (let day = 0; day < days; day++) {
        var dt = new Date(date);
        dt.setDate(date.getDate() + day);
        dates = [...dates, dt];
      }
      return dates;
    },
    // 获取某天开始之后的N天的天气
    nextWeathers(days = 5) {
      const keyToday = this.dateFormat("Y-mm-dd", new Date());
      const ds = this.nextDates(this.date, days);
      var results = [];
      for (const [index, d] of ds.entries()) {
        // 获取当日的天气详情
        const key = this.dateFormat("Y-mm-dd", d);
        var info =
          this.$store.state.weatherFuture[key] ||
          this.$store.state.weatherHistory[key] ||
          {};
        info.day =
          index == 0
            ? key == keyToday
              ? "今天"
              : "当天"
            : "周" + this.dayNames[d.getDay()]; // 设日期title
        results = [...results, info];
      }

      return results;
    }
  },
  computed: {
    cityTodayInfo() {
      const key = this.dateFormat("Y-mm-dd", this.date);
      const t = this.$store.state.weatherFuture[key] ||
        this.$store.state.weatherHistory[key] || {
          温度: "？℃",
          天气: "未知"
        };
      return {
        temperature: t
          ? t["温度"].split("/")[0].replace("℃", "") + "°"
          : "未知",
        cityName: "上海市",
        weather: t["天气"],
        weatherImage: this.getWeatherImage(t["天气"])
      };
    }
  }
};
</script>

<style scoped>
.page {
  padding-top: 15px;
  min-width: 200px;
}

.title {
  font-size: 32px;
  line-height: 1;
  padding: 20px 0 5px 0;
}

.description {
  font-size: 12px;
}

.temperature {
  font-size: 64px;
}

.card-image {
  width: 100%;
  max-height: 300px;
  overflow: hidden;
  border-radius: 10px;
}

.card-info {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translate(-50%, 0px);
  color: #fff;
}

.card-wave {
  position: absolute;
  left: calc(50% - 1px);
  top: 100%;
  transform: translate(-50%, -150px);
  margin: 0;
  width: 101%;
  height: 50px;
}

.card-grid {
  width: 20%;
  min-height: 110px;
  text-align: center;
  padding: 10px 0;
  box-shadow: 0 0 0 0;
  background-color: #fff;
}

.sub-icon {
  padding: 10px 0;
}

.sub-weather {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;
  width: 100%;
}
</style>
