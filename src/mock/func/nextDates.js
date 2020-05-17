// 从某天开始获取之后的N天
import moment from "moment";

export default function(date, days) {
  var dates = [];
  for (let day = 0; day < days; day++) {
    var dt = new Date(date);
    dt.setDate(dt.getDate() + day);
    dates = [...dates, moment(dt).format("Y-MM-DD")];
  }
  return dates;
}
