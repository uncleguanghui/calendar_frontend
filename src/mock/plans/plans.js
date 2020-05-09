import dateFormat from "@/mock/func/dateFormat";
import HTTPERROR from "@/mock/func/httpError";

var yestoday = new Date(new Date().setDate(new Date().getDate() - 1));
var tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));

// status : 1 - 已完成；0 - 未完成
let plans = [
  // 昨天
  {
    id: "sddsd",
    groupId: "aabbccdd",
    title: "买菜1",
    star: false,
    alarmStrategy: "买菜1",
    start: dateFormat("Y-mm-dd H:M:S", new Date(yestoday.setHours(12))),
    end: dateFormat("Y-mm-dd H:M:S", new Date(yestoday.setHours(13))),
    status: 1,
    allDay: false,
    position: "",
    typeId: "life",
    level: "high",
    tags: ["买菜"],
    backgroundColor: "#00bcbc",
    description: ""
  },
  {
    id: "bcvbdfghd",
    groupId: "aabbccdd",
    title: "买菜2",
    star: true,
    alarmStrategy: "买菜2",
    start: dateFormat("Y-mm-dd H:M:S", new Date(yestoday.setHours(12))),
    end: dateFormat("Y-mm-dd H:M:S", new Date(yestoday.setHours(13))),
    status: 0,
    allDay: false,
    position: "",
    typeId: "life",
    level: "high",
    tags: ["买菜"],
    backgroundColor: "#00bcbc",
    description:
      "今天天气真好，打卡喝咖啡哈的看法哈克龙但符合快了吧GV剩女了童话如何IG考哈打瞌睡发快递和覅违规被噶刚收到话费卡会受到发"
  },
  // 今天
  {
    id: "bdgsdgsd",
    groupId: "aabbccdd",
    title: "买菜3",
    star: true,
    alarmStrategy: "买菜3",
    start: dateFormat("Y-mm-dd H:M:S", new Date(new Date().setHours(12))),
    end: dateFormat("Y-mm-dd H:M:S", new Date(new Date().setHours(13))),
    status: 1,
    allDay: false,
    position: "",
    typeId: "life",
    level: "high",
    tags: ["买菜"],
    backgroundColor: "#00bcbc",
    description: "今天天气真好"
  },
  {
    id: "sfgsrgdf",
    groupId: "aabbccdd",
    title: "买菜4",
    star: false,
    alarmStrategy: "买菜4",
    start: dateFormat("Y-mm-dd H:M:S", new Date(new Date().setHours(12))),
    end: dateFormat("Y-mm-dd H:M:S", new Date(new Date().setHours(13))),
    status: 0,
    allDay: true,
    position: "",
    typeId: "life",
    level: "high",
    tags: ["买菜"],
    backgroundColor: "#00bcbc",
    description: "今天天气真好"
  },
  // 明天
  {
    id: "gnhdfhg",
    groupId: "aabbccdd",
    title: "买菜5",
    star: true,
    alarmStrategy: "买菜5",
    start: dateFormat("Y-mm-dd H:M:S", new Date(tomorrow.setHours(12))),
    end: dateFormat("Y-mm-dd H:M:S", new Date(tomorrow.setHours(13))),
    status: 1,
    allDay: true,
    position: "",
    typeId: "life",
    level: "high",
    tags: ["买菜"],
    backgroundColor: "#00bcbc",
    description: "今天天气真好"
  },
  {
    id: "rhrthrh",
    groupId: "aabbccdd",
    title: "买菜6",
    star: false,
    alarmStrategy: "买菜6",
    start: dateFormat("Y-mm-dd H:M:S", new Date(tomorrow.setHours(12))),
    end: dateFormat("Y-mm-dd H:M:S", new Date(tomorrow.setHours(13))),
    status: 0,
    allDay: true,
    position: "",
    typeId: "life",
    level: "high",
    tags: ["买菜"],
    backgroundColor: "#00bcbc",
    description: "今天天气真好"
  }
];

// 添加一个计划
let addPlan = function(planObj) {
  if (planObj) {
    // planObj.id = planObj.id || "121212";
    plans = [...plans, planObj];
  }
  return plans;
};

// 删除一个计划
let DeletePlan = function(id) {
  const targets = plans.filter(obj => obj.id === id);
  const taget = targets.length === 1 ? targets[0] : null;
  if (taget) {
    plans = plans.filter(obj => obj.id !== id);
    return plans;
  } else {
    throw new HTTPERROR(`ID ${id} 不存在`, 404);
  }
};

// 获取一个计划
let getPlan = function(id) {
  const targets = plans.filter(obj => obj.id === id);
  const taget = targets.length === 1 ? targets[0] : null;
  if (taget) {
    return taget;
  } else {
    throw new HTTPERROR(`ID ${id} 不存在`, 404);
  }
};

// 修改一个计划
let updatePlan = function(id, params) {
  const plans_ = [...plans];
  const targets = plans_.filter(obj => obj.id === id);
  const taget = targets.length === 1 ? targets[0] : null;
  if (taget) {
    for (let key in params) {
      if (key in taget) {
        taget.key = params.key;
      }
      plans = plans_;
    }
  } else {
    throw new HTTPERROR(`ID ${id} 不存在`, 404);
  }
};

let Plans = function(req) {
  let res = null;
  switch (req.type) {
    // 获取所有计划
    case "GET":
      res = plans;
      break;
    // 创建一个计划
    case "POST":
      res = addPlan(JSON.parse(req.body));
      break;
    default:
      break;
  }
  console.log(req.type, req.url, res);
  return res;
};

let Plan = function(req) {
  let res = null;
  let id = req.url.split("/")[3];
  switch (req.type) {
    // 获取一个计划
    case "GET":
      res = getPlan(id);
      break;
    // 更新一个计划
    case "PUT":
      res = updatePlan(id, JSON.parse(req.body));
      break;
    // 删除一个计划
    case "DELETE":
      res = DeletePlan(id);
      break;
    default:
      break;
  }
  console.log(req.type, req.url, res);
  return res;
};

export default { Plans, Plan };
