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

var yestoday = new Date(new Date().setDate(new Date().getDate() - 1));
var tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));

// status : 1 - 已完成；0 - 未完成
const plans = [
  // 昨天
  {
    id: "sddsd",
    groupId: "aabbccdd",
    title: "买菜1",
    alarmStrategy: "买菜1",
    start: dateFormat("Y-mm-dd H:M:S", new Date(yestoday.setHours(12))),
    end: dateFormat("Y-mm-dd H:M:S", new Date(yestoday.setHours(13))),
    status: 1,
    allDay: true,
    position: "",
    typeId: "life",
    level: "high",
    tags: [],
    backgroundColor: "#00bcbc",
    description: "今天天气真好"
  },
  {
    id: "bcvbdfghd",
    groupId: "aabbccdd",
    title: "买菜2",
    alarmStrategy: "买菜2",
    start: dateFormat("Y-mm-dd H:M:S", new Date(yestoday.setHours(12))),
    end: dateFormat("Y-mm-dd H:M:S", new Date(yestoday.setHours(13))),
    status: 0,
    allDay: true,
    position: "",
    typeId: "life",
    level: "high",
    tags: [],
    backgroundColor: "#00bcbc",
    description: "今天天气真好"
  },
  // 今天
  {
    id: "bdgsdgsd",
    groupId: "aabbccdd",
    title: "买菜3",
    alarmStrategy: "买菜3",
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
  },
  {
    id: "sfgsrgdf",
    groupId: "aabbccdd",
    title: "买菜4",
    alarmStrategy: "买菜4",
    start: dateFormat("Y-mm-dd H:M:S", new Date(new Date().setHours(12))),
    end: dateFormat("Y-mm-dd H:M:S", new Date(new Date().setHours(13))),
    status: 0,
    allDay: true,
    position: "",
    typeId: "life",
    level: "high",
    tags: [],
    backgroundColor: "#00bcbc",
    description: "今天天气真好"
  },
  // 明天
  {
    id: "gnhdfhg",
    groupId: "aabbccdd",
    title: "买菜5",
    alarmStrategy: "买菜5",
    start: dateFormat("Y-mm-dd H:M:S", new Date(tomorrow.setHours(12))),
    end: dateFormat("Y-mm-dd H:M:S", new Date(tomorrow.setHours(13))),
    status: 1,
    allDay: true,
    position: "",
    typeId: "life",
    level: "high",
    tags: [],
    backgroundColor: "#00bcbc",
    description: "今天天气真好"
  },
  {
    id: "rhrthrh",
    groupId: "aabbccdd",
    title: "买菜6",
    alarmStrategy: "买菜6",
    start: dateFormat("Y-mm-dd H:M:S", new Date(tomorrow.setHours(12))),
    end: dateFormat("Y-mm-dd H:M:S", new Date(tomorrow.setHours(13))),
    status: 0,
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
