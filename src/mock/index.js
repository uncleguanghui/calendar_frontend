// 参考文档：http://mockjs.com/examples.html
const Mock = require("mockjs");

import ApiPlans from "./plans/index";
import ApiCalendar from "./calendar/index";
import ApiWeather from "./weather/index";

Mock.setup({ timeout: "200-1000" }); // 响应时间介于200毫秒到1000毫秒

Mock.mock("/api/plans", /get|post/i, ApiPlans.Plans);
Mock.mock(RegExp("/api/plans/.*"), /get|delete|put/i, ApiPlans.Plan); // 模拟符合 restful 规范的的 url
Mock.mock("/api/tags", /get|post/i, ApiPlans.Tags);
Mock.mock(RegExp("/api/tags/.*"), /get|delete|put/i, ApiPlans.Tag); // 模拟符合 restful 规范的的 url

Mock.mock(RegExp("/api/calendar/workDays?.*"), /get/i, ApiCalendar.WorkDays);
Mock.mock(
  RegExp("/api/calendar/solarTerms?.*"),
  /get/i,
  ApiCalendar.SolarTerms
);
Mock.mock(
  RegExp("/api/calendar/chineseAlmanac?.*"),
  /get/i,
  ApiCalendar.ChineseAlmanac
);

Mock.mock(RegExp("/api/weather/5days?.*"), /get/i, ApiWeather.FiveDays); // 模拟带参数的请求
