import HTTPERROR from "@/mock/func/httpError";
import dateFormat from "@/utils/dateFormat";
import random from "@/mock/func/random";

let Mock = require("mockjs");

let dayMS = 60 * 60 * 24 * 1000; //一天的毫秒数
let monthMS = dayMS * 30; //一个月的毫秒数
let levels = ["high", "medium", "low", "none", null];
let tags = ["学习", "上班", "睡觉", "娱乐", "发呆", "目标", "坚持"];

// 由于 mockjs 生成的时间无法控制，所以单独写一个方法，用以生成一个时间
// 生成的时间范围：上个月的此刻~下个月的此刻
// 允许在生成的时间上加一个偏差（单位是毫秒）
function randomDate(seed = 2020, bias = 0) {
  let deltaMS = random.rand(monthMS, seed);
  let symbol = random.rnd(seed) >= 0.5 ? 1 : -1;
  let time = new Date().getTime() + symbol * deltaMS + bias;
  return new Date(time);
}

// 随机生成一个日期字符串对象
function randomDateStringPair(seed) {
  let start = randomDate(seed);
  let end = randomDate(seed, Mock.mock(`@integer(1,${3 * dayMS})`));
  return {
    start: dateFormat("Y-mm-dd HH:MM:SS", start), //开始时间
    end: dateFormat("Y-mm-dd HH:MM:SS", end) //结束时间
  };
}

let plans = [];
for (let index = 0; index < Mock.mock("@integer(10, 30)"); index++) {
  let time = randomDateStringPair(Mock.mock("@integer"));
  let plan = {
    id: Mock.mock("@id"), // 计划ID
    groupId: Mock.mock("@id"), //计划书ID
    title: Mock.mock("@ctitle(1, 30)"), // 标题，1~50字
    star: Mock.mock("@boolean"), // 是否收藏，boolean
    alarmStrategy: "买菜1",
    typeId: "life",
    status: Mock.mock("@integer(0,1)"), // 完成状态 : 1 - 已完成；0 - 未完成
    allDay: Mock.mock("@boolean"), // 是否是全天的任务，boolean
    isDeleted: Mock.mock("@boolean"), // 是否被删除
    position: Mock.mock("@city"), // 国内随机城市
    level: Mock.mock(`@pick(${levels})`), // 优先级
    tags: Mock.Random.shuffle(tags).slice(
      Mock.mock(`@integer(0,${tags.length})`)
    ), // 计划标签，生成一个子集
    backgroundColor: Mock.mock("@color"), // 背景色
    description: Mock.mock("@cparagraph(1, 20)"), // 计划描述，1~20段
    attachments: Mock.mock({ "image|0-3": ["@image"] }).image // 附件——图片，0~3张
  };
  plans.push(Object.assign(plan, time));
}

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
