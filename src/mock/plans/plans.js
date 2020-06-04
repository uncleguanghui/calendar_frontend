import HTTPERROR from "@/mock/func/httpError";
import moment from "moment";
import { randomTags, getTagsByIds } from "./tags";
import { randomList, getList } from "./lists";

let Mock = require("mockjs");

let dayMS = 60 * 24; //一天的分钟数
let monthMS = dayMS * 30; //一个月的分钟数
let levels = ["high", "medium", "low", "none"]; // 优先级
let repeat = ["day", "week", "month", "year", "none"]; // 重复
let planNum = Mock.mock("@integer(30, 60)"); // 模拟的实际计划数量

// 被删除的概率
let deleteRatio = 0.25;
// 未被删除的计划各状态的概率
let ratio = [
  1, // 已过期的比例（状态为未完成且未删除，且满足：必须有开始时间且发生在过去（今天0点之前），如果有结束时间（条件概率），结束时间也发生在过去）
  1, // 进行中的比例（状态为未完成且未删除，且满足：如果有结束时间（则发生在未来（今天0点之后），如果没有结束时间但有开始时间发生在未来，如果什么时间都没有则相当于一直是进行中~）
  1 // 已完成的比例（状态为已完成且未删除，且满足：完成时间发生在过去（今天0点之前），其他日期随机，时间可有可无、可以在过去也可以在未来）
];
ratio = ratio.map(i => i / eval(ratio.join("+"))); // 归一化
ratio = ratio.map((_, index) => eval(ratio.slice(0, index + 1).join("+"))); // 堆积概率
let timeRatio = [
  3, // 没有开始时间和结束时间的比例
  1, // 仅有开始时间的比例
  1 // 既有开始时间，也有结束时间的比例
];
timeRatio = timeRatio.map(i => i / eval(timeRatio.join("+"))); // 归一化
timeRatio = timeRatio.map((_, index) =>
  eval(timeRatio.slice(0, index + 1).join("+"))
); // 叠加

// 随机生成时间对象
function createTime() {
  let time = {
    allDay: null,
    start: null,
    end: null,
    finish: null,
    status: 0, // 完成状态 : 1 - 已完成；0 - 未完成
    isDeleted: 0 // 是否被删除
  };

  let r = Math.random();
  if (r < ratio[0]) {
    // 过期
    let hasEndRatio = (timeRatio[1] - timeRatio[0]) / (1 - timeRatio[0]);
    if (Math.random() < hasEndRatio) {
      // 有开始时间和结束时间
      let deltaMS = Math.ceil(Math.random() * monthMS);
      let end = moment()
        .startOf("day")
        .add(-deltaMS, "minutes");
      let start = end
        .clone()
        .add(-Mock.mock(`@integer(1,${3 * dayMS})`), "minutes");
      time.allDay = Mock.mock("@boolean");
      time.start = start.format("Y-MM-DD HH:mm:ss");
      time.end = end.format("Y-MM-DD HH:mm:ss");
    } else {
      // 有开始时间，但没有结束时间
      let deltaMS = Math.ceil(Math.random() * monthMS);
      let start = moment()
        .startOf("day")
        .add(-deltaMS, "minutes");
      time.allDay = Mock.mock("@boolean");
      time.start = start.format("Y-MM-DD HH:mm:ss");
    }
  } else if (r >= ratio[0] && r < ratio[1]) {
    // 进行中
    let r_ = Math.random();
    if (r_ >= timeRatio[0] && r_ < timeRatio[1]) {
      // 有开始时间但没有结束时间
      let deltaMS = Math.ceil(Math.random() * monthMS);
      let start = moment()
        .startOf("day")
        .add(deltaMS, "minutes");
      time.allDay = Mock.mock("@boolean");
      time.start = start.format("Y-MM-DD HH:mm:ss");
    } else if (r_ >= timeRatio[1]) {
      // 有开始时间和结束时间
      let deltaMS = Math.ceil(Math.random() * monthMS);
      let end = moment()
        .startOf("day")
        .add(deltaMS, "minutes");
      let start = end
        .clone()
        .add(-Mock.mock(`@integer(1,${3 * dayMS})`), "minutes");
      time.allDay = Mock.mock("@boolean");
      time.start = start.format("Y-MM-DD HH:mm:ss");
      time.end = end.format("Y-MM-DD HH:mm:ss");
    }
  } else if (r >= ratio[1]) {
    // 已完成
    let finish = moment()
      .startOf("day")
      .clone()
      .add(-Mock.mock(`@integer(${-5 * dayMS})`), "minutes");
    time.finish = finish.format("Y-MM-DD HH:mm:ss");
    time.status = 1;

    let start = moment()
      .startOf("day")
      .add(`@integer(${-15 * dayMS},${5 * dayMS})`, "minutes");
    let end = start
      .clone()
      .add(Mock.mock(`@integer(${-5 * dayMS},${5 * dayMS})`), "minutes");

    let r_ = Math.random();
    if (r_ >= timeRatio[0] && r_ < timeRatio[1]) {
      // 有开始时间但没有结束时间
      time.allDay = Mock.mock("@boolean");
      time.start = start.format("Y-MM-DD HH:mm:ss");
    } else if (r_ >= timeRatio[1]) {
      // 有开始时间和结束时间
      time.allDay = Mock.mock("@boolean");
      time.start = start.format("Y-MM-DD HH:mm:ss");
      time.end = end.format("Y-MM-DD HH:mm:ss");
    }
  }
  // 删除
  if (Math.random() < deleteRatio) {
    time.isDeleted = 1;
  }

  return time;
}

// 解析任务（主要是赋予key，以及重置 index）
function parseSubTasks(SubTasks) {
  let tasks = [];
  for (let task of SubTasks) {
    let newTask = {
      key: typeof task.key === "string" ? task.key : Mock.mock("@id"),
      index: typeof task.index === "number" ? task.index : 9999999, // 任务的序号，如果没有序号，则排序后会放在最后面
      title: typeof task.title === "string" ? task.title : "", // 任务的标题，默认为空
      status: typeof task.status === "boolean" ? task.status : false // 完成状态，默认未完成
    };
    tasks.push(newTask);
  }
  // 重新排序并重置 index
  tasks = tasks
    .sort((a, b) => a.index - b.index)
    .map((obj, index) => {
      obj.index = index;
      return obj;
    });
  return tasks;
}

// 创建子任务，或者没有子任务
function createSubTasks() {
  let tasks = [];
  if (Mock.mock("@boolean")) {
    for (let index = 0; index < Mock.mock("@integer(0, 30)"); index++) {
      tasks.push({
        key: Mock.mock("@id"),
        index: index, // 任务的序号
        title: Mock.mock("@ctitle(1, 30)"), // 标题，1~50字
        status: Mock.mock("@boolean") // 完成状态
      });
    }
  }
  return tasks;
}

// 创建提醒策略（提前日期 + 提醒时间）,如 “3 09:00”
function createAlarm() {
  if (Mock.mock("@boolean")) {
    let advancedDays = Mock.mock("@integer(0, 30)");
    let alarmHour = Mock.mock("@integer(0, 24)");
    let alarmMinute = Mock.mock("@integer(0, 3)") * 15;
    let alarmTime =
      (alarmHour + "").padStart(2, "0") +
      ":" +
      (alarmMinute + "").padStart(2, "0");
    return {
      advancedDays: advancedDays,
      alarmTime: alarmTime
    };
  } else {
    return {
      advancedDays: null,
      alarmTime: ""
    };
  }
}

// 解析计划对象
function paresPlanObj(obj) {
  return {
    id: typeof obj.id === "string" ? obj.id : Mock.mock("@id"), // 计划ID
    list: typeof obj.list === "string" ? getList(obj.list) : null, // 通过计划书ID获取最新计划
    title: typeof obj.title === "string" ? obj.title : "", // 标题，1~50字，默认空
    star: typeof obj.star === "boolean" ? obj.star : false, // 是否收藏，boolean，默认不收藏
    typeId: "life",
    isDeleted: typeof obj.isDeleted === "boolean" ? obj.isDeleted : false, // 是否被删除，默认不删除
    position: typeof obj.position === "string" ? obj.position : "", // 国内随机城市，默认空
    level:
      typeof obj.level === "string" && levels.indexOf(obj.level) > -1
        ? obj.level
        : "none", // 优先级，默认无
    repeat:
      typeof obj.repeat === "string" && repeat.indexOf(obj.repeat) > -1
        ? obj.repeat
        : "none", // 重复，默认不重复
    subTasks:
      typeof obj.subTasks === "object" ? parseSubTasks(obj.subTasks) : [], // 子任务，若不为空则重新解析，默认为空
    tags: typeof obj.tags === "object" ? getTagsByIds(obj.tags) : [], // 计划标签，若不为空则根据ID取出对应的标签，默认没有颜色
    backgroundColor:
      typeof obj.backgroundColor === "string" ? obj.backgroundColor : "", // 背景色，默认无
    description: typeof obj.description === "string" ? obj.description : "", // 计划描述，1~20段，默认无
    attachments: typeof obj.attachments === "object" ? obj.attachments : [], // 附件——图片，0~3张

    // 提醒
    advancedDays:
      typeof obj.advancedDays === "number" ? obj.advancedDays : null, // 提前提醒的天数
    alarmTime: typeof obj.alarmTime === "string" ? obj.alarmTime : "", // 提醒时间

    // 时间
    allDay: typeof obj.allDay === "boolean" ? obj.allDay : null, // 是否全天，默认无
    start:
      typeof obj.start === "string" && moment(obj.start)._isValid
        ? obj.start
        : null, // 开始日期
    end:
      typeof obj.end === "string" && moment(obj.end)._isValid ? obj.end : null, // 结束时间
    finish:
      typeof obj.finish === "string" && moment(obj.finish)._isValid
        ? obj.finish
        : null, // 完成时间
    status: typeof obj.status === "number" ? obj.status : 0 // 完成状态，默认0-未完成
  };
}

// 创建一个计划
function createPlan() {
  let plan = {
    id: Mock.mock("@id"), // 计划ID
    list: randomList(), // 自定义清单
    title: Mock.mock("@ctitle(1, 30)"), // 标题，1~50字
    star: Mock.mock("@boolean"), // 是否收藏，boolean
    typeId: "life",
    position: Mock.mock("@city"), // 国内随机城市
    level: Mock.mock(`@pick(${levels})`), // 优先级
    repeat: Mock.mock(`@pick(${repeat})`), // 重复
    subTasks: createSubTasks(), // 子任务
    tags: randomTags(), // 计划标签，生成一个子集
    backgroundColor: Mock.mock("@color"), // 背景色
    description: Mock.mock("@cparagraph(1, 20)"), // 计划描述，1~20段
    attachments: Mock.mock({ "image|0-3": ["@image"] }).image // 附件——图片，0~3张
  };
  let time_ = createTime();
  plan = Object.assign(plan, time_);
  let alarm_ = createAlarm();
  plan = Object.assign(plan, alarm_);
  return plan;
}

// 创建一堆计划
function createPlans() {
  let plans_ = [];
  for (let index = 0; index < planNum; index++) {
    let plan_ = createPlan();
    plans_.push(plan_);
  }
  return plans_;
}
let plans = createPlans();

// 获取当前最新计划
function getLatestPlans() {
  // 由于标签更新了，所以计划数据也同步更新一下
  let plans_ = [...plans];
  plans_ = plans_.map(item => {
    item.tags = getTagsByIds(item.tags.map(tag => tag.id));
    item.list = item.list ? getList(item.list.id) : null;
    return item;
  });
  plans = plans_;
  return plans;
}

// 添加一个计划
function addPlan(planObj) {
  if (planObj) {
    plans = [paresPlanObj(planObj), ...plans];
  }
  return plans;
}

// 删除一个计划
function DeletePlan(id) {
  const targets = plans.filter(obj => obj.id === id);
  const taget = targets.length === 1 ? targets[0] : null;
  if (taget) {
    plans = plans.filter(obj => obj.id !== id);
    return plans;
  } else {
    throw new HTTPERROR(`ID ${id} 不存在`, 404);
  }
}

// 获取一个计划
function getPlan(id) {
  const targets = plans.filter(obj => obj.id === id);
  const taget = targets.length === 1 ? targets[0] : null;
  if (taget) {
    return taget;
  } else {
    throw new HTTPERROR(`ID ${id} 不存在`, 404);
  }
}

// 修改一个计划
function updatePlan(id, params) {
  const plans_ = [...plans];
  const targets = plans_.filter(obj => obj.id === id);
  const target = targets.length === 1 ? targets[0] : null;
  if (target) {
    for (let key in params) {
      if (key in target) {
        if (key === "tags") {
          // key 是 tags 的话，只需传 id 列表
          target[key] = getTagsByIds(params[key]);
        } else if (key === "subTasks") {
          // key 是 subTasks 的话，重新解析
          target[key] = parseSubTasks(params[key]);
        } else {
          target[key] = params[key];
        }
      } else {
        throw new HTTPERROR(`传递了不存在的属性 ${key}`, 400);
      }
    }
    plans = plans_;
    return target;
  } else {
    throw new HTTPERROR(`ID ${id} 不存在`, 404);
  }
}

let Plans = function(req) {
  let res = null;
  getLatestPlans();
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
  getLatestPlans();
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
  console.log(req.type, req.url, req.body, res);
  return res;
};

export default { Plans, Plan };
