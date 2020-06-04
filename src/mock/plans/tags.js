import HTTPERROR from "@/mock/func/httpError";

let Mock = require("mockjs");
let tagNum = Mock.mock("@integer(10, 20)"); // 模拟的总标签数

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
  for (let index = 0; index < tagNum; index++) {
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

// 从现有标签中随机选择若干标签
function randomTags() {
  return Mock.Random.shuffle(tags).slice(
    Mock.mock(`@integer(0,${tags.length})`)
  );
}

// 根据 id 列表返回标签对象列表，对于不存在的则忽略
function getTagsByIds(ids) {
  let ids_ = [...new Set(ids)]; // 去重
  let targets = tags.filter(tag => ids_.indexOf(tag.id));
  return targets;
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
  const target = targets.length === 1 ? targets[0] : null;
  if (target) {
    tags = tags.filter(obj => obj.id !== id);
    return tags;
  } else {
    throw new HTTPERROR(`ID ${id} 不存在`, 404);
  }
}

// 获取一个标签
function getTag(id) {
  const targets = tags.filter(obj => obj.id === id);
  const target = targets.length === 1 ? targets[0] : null;
  if (target) {
    return target;
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
    return target;
  } else {
    throw new HTTPERROR(`ID ${id} 不存在`, 404);
  }
}

function ApiTags(req) {
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
}

function ApiTag(req) {
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
}

export { randomTags, getTagsByIds, ApiTags, ApiTag };
