<template>
  <div class="page">
    <a-card :bordered="false">
      <div :style="{ backgroundColor: '#fff' }">
        <div class="card-image">
          <img :src="getWeatherImage(weatherList[0]['天气'])" width="100%" />
        </div>
        <div class="card-wave">
          <wave />
        </div>
        <div class="card-info">
          <div class="title">{{ weatherList[0]["天气"] || "未知" }}</div>
          <div class="description">{{ weatherList[0]["城市"] || "未知" }}</div>
          <div class="temperature">{{ weatherList[0]["温度"] || "？℃" }}</div>
        </div>
      </div>
      <a-card-grid
        class="card-grid"
        :key="result['日期']"
        v-for="result in weatherList"
      >
        <div class="sub-title">{{ result["名称"] }}</div>
        <div class="sub-icon">
          <a-avatar shape="square" :src="getWeatherIcon(result['天气'])" />
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
      default: () => new Date()
    }
  },
  watch: {
    date() {
      // 重新获取天气数据
      this.getWeatherData();
    }
  },
  mounted() {
    this.getWeatherData();
  },
  data() {
    return {
      publicPath: process.env.BASE_URL, // public 文件夹的位置
      dayNames: ["日", "一", "二", "三", "四", "五", "六"],
      weatherList: [{}, {}, {}, {}, {}] // 近5天的天气
    };
  },
  methods: {
    // 天气格式化
    getWeatherData() {
      const todayString = this.dateFormat("Y-mm-dd", new Date());
      const dateString = this.dateFormat("Y-mm-dd", this.date);

      this.$request({
        url: "/api/weather/5days",
        method: "get",
        params: {
          date: dateString
        }
      }).then(res => {
        this.weatherList = res.data.map(item => {
          const ws = item["天气"].split("/");
          item["天气"] = ws[0] === ws[1] ? ws[0] : item["天气"];
          item["名称"] =
            item["日期"] === dateString
              ? dateString == todayString
                ? "今天"
                : "当天"
              : "周" + this.dayNames[new Date(item["日期"]).getDay()];
          item["温度"] = item["温度"].split("/")[0].replace("℃", "") + "°";
          return item;
        });
      });
    },
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
    // 根据天气名称获取背景图片
    getWeatherImage(weather) {
      if (weather) {
        return this.publicPath + "images/" + "image(11).jpg";
      } else {
        return this.publicPath + "images/" + "image(11).jpg";
      }
    },
    // 根据天气名称获取图标
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
  max-height: 400px;
  overflow: hidden;
  border-radius: 10px;
}

.card-info {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -30%);
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
