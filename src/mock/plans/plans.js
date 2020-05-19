import HTTPERROR from "@/mock/func/httpError";
import moment from "moment";

let Mock = require("mockjs");

let dayMS = 60 * 24; //一天的分钟数
let monthMS = dayMS * 30; //一个月的分钟数
let levels = ["high", "medium", "low", "none"]; // 优先级
let repeat = ["day", "week", "month", "year", "none"]; // 重复

// 创建标签
function createTags() {
  let tags_ = [];
  for (let index = 0; index < 10; index++) {
    let tag_ = {
      id: Mock.mock("@id"), // 标签ID
      title: Mock.mock("@ctitle(1, 10)"), // 标题，1~10字
      color: Mock.mock("@color") // 背景色
    };
    tags_.push(tag_);
  }
  return tags_;
}
let tags = createTags();

// 根据 id 找到标签对象，找不到则返回空字符串
function getTagById(id) {
  let targets = tags.filter(tag => tag.id === id);
  return targets.length === 1 ? targets[0] : "";
}

// 随机生成时间对象
function createTime() {
  let time = {
    allDay: null,
    start: null,
    end: null,
    finish: null,
    status: 0 // 完成状态 : 1 - 已完成；0 - 未完成
  };

  if (Math.random() > 0.2) {
    let symbol = Math.random() >= 0.5 ? 1 : -1;
    let deltaMS = Math.ceil(Math.random() * monthMS);
    let start = moment().add(symbol * deltaMS, "minutes"); // 随机生成的时间范围：上个月的此刻~下个月的此刻
    let end = start
      .clone()
      .add(Mock.mock(`@integer(1,${3 * dayMS})`), "minutes");
    let finish = start
      .clone()
      .add(Mock.mock(`@integer(${-5 * dayMS},${5 * dayMS})`), "minutes");

    time.allDay = Mock.mock("@boolean"); // 是否是全天的任务，boolean
    time.start = start.format("Y-MM-DD HH:mm:ss"); // 开始时间

    // 随机添加3天之内的结束时间
    if (Math.random() > 0.2) {
      time.end = end.format("Y-MM-DD HH:mm:ss");
    }

    // 随机添加任务状态和结束时间
    if (Math.random() > 0.2) {
      time.finish = finish.format("Y-MM-DD HH:mm:ss");
      time.status = 1;
    }
  }
  return time;
}

// 创建子任务，或者没有子任务
function createSubTasks() {
  let tasks = [];
  if (Mock.mock("@boolean")) {
    for (let index = 0; index < Mock.mock("@integer(5, 10)"); index++) {
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

// 创建计划
function createPlans() {
  let plans_ = [];
  for (let index = 0; index < Mock.mock("@integer(10, 30)"); index++) {
    let plan_ = {
      id: Mock.mock("@id"), // 计划ID
      groupId: Mock.mock("@id"), //计划书ID
      title: Mock.mock("@ctitle(1, 30)"), // 标题，1~50字
      star: Mock.mock("@boolean"), // 是否收藏，boolean
      typeId: "life",
      isDeleted: Mock.mock("@boolean"), // 是否被删除
      position: Mock.mock("@city"), // 国内随机城市
      level: Mock.mock(`@pick(${levels})`), // 优先级
      repeat: Mock.mock(`@pick(${repeat})`), // 重复
      subTasks: createSubTasks(), // 子任务
      tags: Mock.Random.shuffle(tags).slice(
        Mock.mock(`@integer(0,${tags.length})`)
      ), // 计划标签，生成一个子集
      backgroundColor: Mock.mock("@color"), // 背景色
      description: Mock.mock("@cparagraph(1, 20)"), // 计划描述，1~20段
      attachments: Mock.mock({ "image|0-3": ["@image"] }).image // 附件——图片，0~3张
    };
    let time_ = createTime();
    plan_ = Object.assign(plan_, time_);
    let alarm_ = createAlarm();
    plan_ = Object.assign(plan_, alarm_);
    plans_.push(plan_);
  }
  return plans_;
}
let plans = createPlans();

// 添加一个计划
function addPlan(planObj) {
  if (planObj) {
    planObj.id = Mock.mock("@id");
    planObj.groupId = Mock.mock("@id");

    // 添加标签
    plans = [planObj, ...plans];
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
          target[key] = params[key].map(id => getTagById(id)).filter(i => i);
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
  console.log(req.type, req.url, req.body, res);
  return res;
};

// 由于标签更新了，所以计划数据也同步更新一下
function updatePlansForTags() {
  let plans_ = [...plans];
  plans_ = plans_.map(item => {
    item.tags = item.tags.map(tag => getTagById(tag.id)).filter(i => i);
    return item;
  });
  plans = plans_;
}

// 添加一个标签
function addTag(tagObj) {
  if (tagObj) {
    tagObj.id = Mock.mock("@id");
    tags = [tagObj, ...tags];
  }
  return tags;
}

// 删除一个标签
function deleteTag(id) {
  const targets = tags.filter(obj => obj.id === id);
  const taget = targets.length === 1 ? targets[0] : null;
  if (taget) {
    tags = tags.filter(obj => obj.id !== id);
    updatePlansForTags();
    return tags;
  } else {
    throw new HTTPERROR(`ID ${id} 不存在`, 404);
  }
}

// 获取一个标签
function getTag(id) {
  const targets = tags.filter(obj => obj.id === id);
  const taget = targets.length === 1 ? targets[0] : null;
  if (taget) {
    return taget;
  } else {
    throw new HTTPERROR(`ID ${id} 不存在`, 404);
  }
}

// 修改一个标签（颜色或名称）
function updateTag(id, params) {
  const tags_ = [...tags];
  const targets = tags_.filter(obj => obj.id === id);
  const target = targets.length === 1 ? targets[0] : null;
  if (target) {
    target.title = params.title || target.title;
    target.color = params.color || target.color;
    tags = tags_;
    updatePlansForTags();
    return target;
  } else {
    throw new HTTPERROR(`ID ${id} 不存在`, 404);
  }
}

let Tags = function(req) {
  let res = null;
  switch (req.type) {
    // 获取所有标签
    case "GET":
      res = tags;
      break;
    // 创建一个标签
    case "POST":
      res = addTag(JSON.parse(req.body));
      break;
    default:
      break;
  }
  console.log(req.type, req.url, res);
  return res;
};

let Tag = function(req) {
  let res = null;
  let id = req.url.split("/")[3];
  switch (req.type) {
    // 获取一个标签
    case "GET":
      res = getTag(id, JSON.parse(req.body));
      break;
    // 更新一个标签
    case "PUT":
      res = updateTag(id, JSON.parse(req.body));
      break;
    // 删除一个标签
    case "DELETE":
      res = deleteTag(id);
      break;
    default:
      break;
  }
  console.log(req.type, req.url, req.body, res);
  return res;
};

export default { Plans, Plan, Tags, Tag };
