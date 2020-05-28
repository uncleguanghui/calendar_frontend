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
    let key = p[0];
    let value = p.slice(1).join("=");
    params[key] = Number(value) || value;
  }
  return params;
}
