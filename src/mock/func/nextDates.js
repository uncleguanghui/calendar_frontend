// 从某天开始获取之后的N天
import dateFormat from "./dateFormat";

export default function(date, days) {
  var dates = [];
  for (let day = 0; day < days; day++) {
    var dt = new Date(date);
    dt.setDate(dt.getDate() + day);
    dates = [...dates, dateFormat("Y-mm-dd", dt)];
  }
  return dates;
}
