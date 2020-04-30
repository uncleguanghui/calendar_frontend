// 获取今天的任务

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

const plans = [
  {
    id: "sdfasfasdf",
    groupId: "aabbccdd",
    title: "买菜",
    alarmStrategy: "买菜",
    start: dateFormat("Y-mm-dd H:M:S", new Date(new Date().setHours(12))),
    end: dateFormat("Y-mm-dd H:M:S", new Date(new Date().setHours(13))),
    status: 1,
    allDay: true,
    position: "",
    typeId: "life",
    level: "high",
    tags: [],
    backgroundColor: "#00bcbc",
    description: "今天天气真好"
  }
];

function func(req) {
  const method = req.method;
  let res = null;
  switch (method) {
    case "GET":
      res = plans;
      break;
    default:
      res = null;
  }
  return res;
}

module.exports = func;
