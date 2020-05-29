// 获取插画
import parseParams from "@/mock/func/parseParams";

const names = require
  .context("@/../public/illustrations", false, /.(svg)$/)
  .keys()
  .map(obj => obj.slice(2, obj.length)); //去掉文件名前面的 "./"

// 按页获取图片名称
function Illustrations(req) {
  let res = null;
  let params = parseParams(req.url);
  let size = params.size < 40 ? params.size : 40;
  let page = params.page || 0;
  switch (req.type) {
    case "GET":
      res = {
        names: names.slice(page * size, page * size + size),
        hasMore: names.length > page * size + size
      };
      break;
    default:
      break;
  }
  console.log(req.type, req.url, res);
  return res;
}

// 搜索图片
function Search(req) {
  let res = null;
  let params = parseParams(req.url);

  let keywords = params.keywords;
  let size = params.size < 40 ? params.size : 40;
  let page = params.page || 0;

  let results = null; // 查找结果
  if (keywords) {
    switch (req.type) {
      case "GET":
        results = names.filter(
          i => i.toLowerCase().indexOf(keywords.toLowerCase()) > -1
        );
        res = {
          names: results.slice(page * size, page * size + size),
          hasMore: results.length > page * size + size
        };
        break;
      default:
        break;
    }
  }
  console.log(req.type, req.url, res);
  return res;
}

export default { Illustrations, Search };
