import HTTPERROR from "@/mock/func/httpError";
import moment from "moment";

let Mock = require("mockjs");

let dayMS = 60 * 24; //一天的分钟数
let monthMS = dayMS * 30; //一个月的分钟数
let levels = ["high", "medium", "low", "none"]; // 优先级
let repeat = ["day", "week", "month", "year", "none"]; // 重复

// 解析标签（主要是赋予id和颜色，以及去掉不在标签列表中的标签）
// function parseTags(tags) {
//   let tags_ = [];
//   for (let tag of tags) {
//     let newTag = {
//       id: typeof tag.id === "string" ? tag.id : Mock.mock("@id"),
//       title: typeof tag.title === "string" ? tag.title : "", // 标题
//       color: typeof tag.color === "string" ? tag.color : "#40a9ff" // 背景色，默认蓝色
//     };
//     tags_.push(newTag);
//   }
//   // 过滤不存在的标签
//   tags_ = tags_.filter(i => tags.map(j => j.id).indexOf(i.id) > -1);
//   return tags_;
// }

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

// 解析计划对象
function paresPlanObj(obj) {
  return {
    id: typeof obj.id === "string" ? obj.id : Mock.mock("@id"), // 计划ID
    groupId: typeof obj.groupId === "string" ? obj.groupId : Mock.mock("@id"), //计划书ID
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
    tags:
      typeof obj.tags === "object"
        ? obj.tags.map(id => getTagById(id)).filter(i => i)
        : [], // 计划标签，若不为空则根据ID取出对应的标签，默认没有颜色
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
  plan = Object.assign(plan, time_);
  let alarm_ = createAlarm();
  plan = Object.assign(plan, alarm_);
  return plan;
}

// 创建一堆计划
function createPlans() {
  let plans_ = [];
  for (let index = 0; index < Mock.mock("@integer(10, 30)"); index++) {
    let plan_ = createPlan();
    plans_.push(plan_);
  }
  return plans_;
}
let plans = createPlans();

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
          target[key] = params[key].map(id => getTagById(id)).filter(i => i);
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
    let newTag = {
      id: Mock.mock("@id"),
      title: tagObj.title || "",
      color: tagObj.color || "#40a9ff"
    };
    tags = [newTag, ...tags];
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
