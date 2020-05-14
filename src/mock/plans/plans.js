import HTTPERROR from "@/mock/func/httpError";
import dateFormat from "@/utils/dateFormat";
import random from "@/mock/func/random";

let Mock = require("mockjs");

let dayMS = 60 * 60 * 24 * 1000; //一天的毫秒数
let monthMS = dayMS * 30; //一个月的毫秒数
let levels = ["high", "medium", "low", "none", null];

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

// 根据 id 找到标签对象，找不到则返回 undefined
function getTagById(id) {
  let targets = tags.filter(tag => tag.id === id);
  return targets.length === 1 ? targets[0] : undefined;
}

// 由于 mockjs 生成的时间无法控制，所以单独写一个方法，用以生成一个时间
// 生成的时间范围：上个月的此刻~下个月的此刻
// 允许在生成的时间上加一个偏差（单位是毫秒）
function randomDate(seed = 2020, bias = 0) {
  let deltaMS = random.rand(monthMS, seed);
  let symbol = random.rnd(seed) >= 0.5 ? 1 : -1;
  let time = new Date().getTime() + symbol * deltaMS + bias;
  return new Date(time);
}

// 随机生成一个日期字符串对象，或什么都没有
function randomDateStringPair(seed) {
  if (Mock.mock("@boolean")) {
    let start = randomDate(seed);
    let end = randomDate(seed, Mock.mock(`@integer(1,${3 * dayMS})`));
    return {
      start: dateFormat("Y-mm-dd HH:MM:SS", start), //开始时间
      end: dateFormat("Y-mm-dd HH:MM:SS", end) //结束时间
    };
  } else {
    return {
      start: undefined,
      end: undefined
    };
  }
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

// 创建计划
function createPlans() {
  let plans_ = [];
  for (let index = 0; index < Mock.mock("@integer(10, 30)"); index++) {
    let time_ = randomDateStringPair(Mock.mock("@integer"));
    let plan_ = {
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
      subTasks: createSubTasks(), // 子任务
      tags: Mock.Random.shuffle(tags).slice(
        Mock.mock(`@integer(0,${tags.length})`)
      ), // 计划标签，生成一个子集
      backgroundColor: Mock.mock("@color"), // 背景色
      description: Mock.mock("@cparagraph(1, 20)"), // 计划描述，1~20段
      attachments: Mock.mock({ "image|0-3": ["@image"] }).image // 附件——图片，0~3张
    };
    plans_.push(Object.assign(plan_, time_));
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
