import HTTPERROR from "@/mock/func/httpError";

let Mock = require("mockjs");
let ListNum = Mock.mock("@integer(5, 10)"); // 自定义的清单数
let hideRatio = 0.5; // 初始化自定义清单时，设置的隐藏值为 true 的概率
let hasListRatio = 0.5; // 一个计划存在指定清单的概率

// 创建自定义清单
function createLists() {
  let lists_ = [];
  for (let index = 0; index < ListNum; index++) {
    let list_ = {
      id: Mock.mock("@id"), // 自定义清单ID
      title: Mock.mock("@ctitle(1, 10)"), // 标题，1~10字
      color: Mock.mock("@color"), // 背景色
      hide: Math.random() < hideRatio // 是否在系统菜单中隐藏
    };
    lists_.push(list_);
  }
  return lists_;
}
let lists = createLists();

// 从现有自定义清单中随机选择一个自定义清单
function randomList() {
  if (Math.random() < hasListRatio) {
    let index = Math.floor(lists.length * Math.random());
    let id = lists[index].id;
    return getList(id);
  }
  return null;
}

// 添加一个自定义清单
function addList(listObj) {
  if (listObj) {
    let newList = {
      id: Mock.mock("@id"),
      title: listObj.title || "",
      color: listObj.color || "#40a9ff",
      hide: listObj.hide || false
    };
    lists = [newList, ...lists];
  }
  return lists;
}

// 删除一个自定义清单
function deleteList(id) {
  const targets = lists.filter(obj => obj.id === id);
  const target = targets.length === 1 ? targets[0] : null;
  if (target) {
    lists = lists.filter(obj => obj.id !== id);
    return lists;
  } else {
    throw new HTTPERROR(`ID ${id} 不存在`, 404);
  }
}

// 获取一个自定义清单
function getList(id) {
  const targets = lists.filter(obj => obj.id === id);
  const target = targets.length === 1 ? targets[0] : null;
  if (target) {
    return target;
  } else {
    throw new HTTPERROR(`ID ${id} 不存在`, 404);
  }
}

// 修改一个自定义清单（颜色或名称）
function updateList(id, params) {
  const lists_ = [...lists];
  const targets = lists_.filter(obj => obj.id === id);
  const target = targets.length === 1 ? targets[0] : null;
  if (target) {
    target.title = params.title || target.title;
    target.color = params.color || target.color;
    target.hide = params.hide || target.hide;
    lists = lists_;
    return target;
  } else {
    throw new HTTPERROR(`ID ${id} 不存在`, 404);
  }
}

function ApiLists(req) {
  let res = null;
  switch (req.type) {
    // 获取所有自定义清单
    case "GET":
      res = lists;
      break;
    // 创建一个自定义清单
    case "POST":
      res = addList(JSON.parse(req.body));
      break;
    default:
      break;
  }
  console.log(req.type, req.url, res);
  return res;
}

function ApiList(req) {
  let res = null;
  let id = req.url.split("/")[3];
  switch (req.type) {
    // 获取一个自定义清单
    case "GET":
      res = getList(id, JSON.parse(req.body));
      break;
    // 更新一个自定义清单
    case "PUT":
      res = updateList(id, JSON.parse(req.body));
      break;
    // 删除一个自定义清单
    case "DELETE":
      res = deleteList(id);
      break;
    default:
      break;
  }
  console.log(req.type, req.url, req.body, res);
  return res;
}

export { randomList, getList, ApiLists, ApiList };
