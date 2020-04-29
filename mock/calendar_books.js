// 获取用户的日历本
const books = [
  { title: "私有日历本", bookId: "self" },
  { title: "团队日历本", bookId: "team" }
];

function func(req) {
  const method = req.method;
  let res = null;
  switch (method) {
    case "GET":
      res = books;
      break;
    default:
      res = {};
  }
  return res;
}

module.exports = func;
