// 获取接下来5天的天气
const weather = {
  "2020-04-01": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200401.html",
    天气: "多云/多云",
    温度: "17℃/10℃",
    风向风力: "北风 3-4级/北风 3-4级"
  },
  "2020-04-02": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200402.html",
    天气: "晴/阴",
    温度: "17℃/10℃",
    风向风力: "东风 3-4级/东风 3-4级"
  },
  "2020-04-03": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200403.html",
    天气: "阴/阴",
    温度: "17℃/11℃",
    风向风力: "东北风 3-4级/东北风 3-4级"
  },
  "2020-04-04": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200404.html",
    天气: "多云/多云",
    温度: "21℃/10℃",
    风向风力: "东北风 3-4级/东北风 3-4级"
  },
  "2020-04-05": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200405.html",
    天气: "多云/多云",
    温度: "16℃/9℃",
    风向风力: "东北风 3-4级/东北风 3-4级"
  },
  "2020-04-06": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200406.html",
    天气: "多云/多云",
    温度: "16℃/10℃",
    风向风力: "东风 1-2级/东风 1-2级"
  },
  "2020-04-07": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200407.html",
    天气: "晴/晴",
    温度: "20℃/11℃",
    风向风力: "东北风 1-2级/东北风 1-2级"
  },
  "2020-04-08": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200408.html",
    天气: "阴/阴",
    温度: "22℃/12℃",
    风向风力: "东风 3-4级/东风 3-4级"
  },
  "2020-04-09": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200409.html",
    天气: "晴/晴",
    温度: "21℃/13℃",
    风向风力: "东南风 3-4级/东南风 3-4级"
  },
  "2020-04-10": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200410.html",
    天气: "阴/小雨",
    温度: "20℃/13℃",
    风向风力: "东风 4-5级/东风 4-5级"
  },
  "2020-04-11": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200411.html",
    天气: "小雨/阴",
    温度: "13℃/9℃",
    风向风力: "东北风 4-5级/东北风 4-5级"
  },
  "2020-04-12": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200412.html",
    天气: "小雨/晴",
    温度: "20℃/10℃",
    风向风力: "西北风 4-5级/西北风 4-5级"
  },
  "2020-04-13": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200413.html",
    天气: "晴/阴",
    温度: "19℃/10℃",
    风向风力: "北风 4-5级/北风 4-5级"
  },
  "2020-04-14": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200414.html",
    天气: "多云/阴",
    温度: "21℃/13℃",
    风向风力: "南风 1-2级/南风 1-2级"
  },
  "2020-04-15": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200415.html",
    天气: "多云/多云",
    温度: "23℃/16℃",
    风向风力: "西南风 3-4级/西南风 3-4级"
  },
  "2020-04-16": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200416.html",
    天气: "阴/中雨",
    温度: "26℃/16℃",
    风向风力: "南风 4-5级/南风 4-5级"
  },
  "2020-04-17": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200417.html",
    天气: "小雨/阴",
    温度: "20℃/15℃",
    风向风力: "西南风 1-2级/西南风 1-2级"
  },
  "2020-04-18": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200418.html",
    天气: "小雨/中雨",
    温度: "19℃/13℃",
    风向风力: "东南风 1-2级/东南风 1-2级"
  },
  "2020-04-19": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200419.html",
    天气: "小雨/阴",
    温度: "17℃/11℃",
    风向风力: "西北风 5-6级/西北风 5-6级"
  },
  "2020-04-20": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200420.html",
    天气: "多云/小雨",
    温度: "22℃/13℃",
    风向风力: "西风 1-2级/西风 1-2级"
  },
  "2020-04-21": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200421.html",
    天气: "阴/阴",
    温度: "16℃/10℃",
    风向风力: "东北风 1-2级/东北风 1-2级"
  },
  "2020-04-22": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200422.html",
    天气: "晴/多云",
    温度: "19℃/12℃",
    风向风力: "东南风 1-2级/东南风 1-2级"
  },
  "2020-04-23": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200423.html",
    天气: "晴/晴",
    温度: "19℃/12℃",
    风向风力: "北风 1-2级/北风 1-2级"
  },
  "2020-04-24": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200424.html",
    天气: "晴/晴",
    温度: "23℃/14℃",
    风向风力: "北风 1-2级/北风 1-2级"
  },
  "2020-04-25": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200425.html",
    天气: "多云/阴",
    温度: "26℃/14℃",
    风向风力: "西南风 4-5级/西南风 4-5级"
  },
  "2020-04-26": {
    城市: "上海",
    url: "http://www.tianqihoubao.com/lishi/shanghai/20200426.html",
    天气: "多云/小雨",
    温度: "22℃/14℃",
    风向风力: "东北风 3-4级/东北风 3-4级"
  },
  "2020-04-27": {
    城市: "上海",
    url: "",
    天气: "阴转晴",
    温度: "20℃/12℃",
    风向风力: "东风,东南风 <3级"
  },
  "2020-04-28": {
    城市: "上海",
    url: "",
    天气: "晴",
    温度: "22℃/14℃",
    风向风力: "南风,东南风 3-4级转4-5级"
  },
  "2020-04-29": {
    城市: "上海",
    url: "",
    天气: "晴",
    温度: "25℃/16℃",
    风向风力: "南风,东南风 4-5级转3-4级"
  },
  "2020-04-30": {
    城市: "上海",
    url: "",
    天气: "多云",
    温度: "30℃/20℃",
    风向风力: "南风 3-4级"
  },
  "2020-05-01": {
    城市: "上海",
    url: "",
    天气: "小雨转晴",
    温度: "27℃/20℃",
    风向风力: "南风 3-4级"
  },
  "2020-05-02": {
    城市: "上海",
    url: "",
    天气: "小雨转阴",
    温度: "25℃/20℃",
    风向风力: "东南风 3-4级转4-5级"
  },
  "2020-05-03": {
    城市: "上海",
    url: "",
    天气: "阴",
    温度: "27℃/20℃",
    风向风力: "东南风 4-5级"
  },
  "2020-05-04": {
    城市: "上海",
    url: "",
    天气: "阴",
    温度: "25℃/17℃",
    风向风力: "南风,东风 4-5级转<3级"
  },
  "2020-05-05": {
    城市: "上海",
    url: "",
    天气: "阴",
    温度: "27℃/18℃",
    风向风力: "东风,东南风 <3级"
  },
  "2020-05-06": {
    城市: "上海",
    url: "",
    天气: "雨转阴",
    温度: "24℃/17℃",
    风向风力: "东风,东北风 3-4级"
  },
  "2020-05-07": {
    城市: "上海",
    url: "",
    天气: "雨",
    温度: "21℃/18℃",
    风向风力: "东风,东南风 3-4级转4-5级"
  },
  "2020-05-08": {
    城市: "上海",
    url: "",
    天气: "雨",
    温度: "21℃/18℃",
    风向风力: "东风 5-6级转4-5级"
  },
  "2020-05-09": {
    城市: "上海",
    url: "",
    天气: "雨转阴",
    温度: "19℃/15℃",
    风向风力: "东风,东北风 4-5级转3-4级"
  },
  "2020-05-10": {
    城市: "上海",
    url: "",
    天气: "阴",
    温度: "19℃/15℃",
    风向风力: "东北风 3-4级转<3级"
  },
  "2020-05-11": {
    城市: "上海",
    url: "",
    天气: "多云转晴",
    温度: "21℃/16℃",
    风向风力: "东风 <3级"
  }
};

// 日期格式化
const dateFormat = function(fmt, date) {
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
};

// 从某天开始获取之后的N天
const nextDates = function(date, days) {
  var dates = [];
  for (let day = 0; day < days; day++) {
    var dt = new Date(date);
    dt.setDate(dt.getDate() + day);
    dates = [...dates, dateFormat("Y-mm-dd", dt)];
  }
  return dates;
};

function func(req) {
  const method = req.method;
  let res = null;
  switch (method) {
    case "GET":
      res = nextDates(req.query.date, 5).map(item => {
        var w = weather[item];
        if (w) {
          w["日期"] = item;
        }
        return w;
      });
      break;
    default:
      res = null;
  }
  return res;
}

module.exports = func;
