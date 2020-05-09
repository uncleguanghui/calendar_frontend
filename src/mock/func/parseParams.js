// 解析 url 参数
// 暂不考虑参数中存在 ? & = 这3种特殊字符

export default function(url) {
  let paramString = url
    .split("?")
    .slice(1)
    .join("?");
  let params = {};
  for (let param of paramString.split("&")) {
    let p = param.split("=");
    params[p[0]] = p.slice(1).join("=");
  }
  return params;
}
