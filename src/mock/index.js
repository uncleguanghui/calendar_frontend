// 参考文档：http://mockjs.com/examples.html
const Mock = require("mockjs");

import ApiPlans from "./plans/index";
import { ApiTags, ApiTag } from "./plans/tags";
import ApiCalendar from "./calendar/index";
import ApiWeather from "./weather/index";
import ApiIllustration from "./illustration/index";

Mock.setup({ timeout: "200-1000" }); // 响应时间介于200毫秒到1000毫秒

Mock.mock("/api/plans", /get|post/i, ApiPlans.Plans);
Mock.mock(RegExp("/api/plans/.*"), /get|delete|put/i, ApiPlans.Plan);
Mock.mock("/api/tags", /get|post/i, ApiTags);
Mock.mock(RegExp("/api/tags/.*"), /get|delete|put/i, ApiTag);
Mock.mock(
  RegExp("/api/illustrations/load.*"),
  /get/i,
  ApiIllustration.Illustrations
);
Mock.mock(
  RegExp("/api/illustrations/search.*"),
  /get/i,
  ApiIllustration.Search
);
Mock.mock(RegExp("/api/calendar/workDays.*"), /get/i, ApiCalendar.WorkDays);
Mock.mock(RegExp("/api/calendar/solarTerms.*"), /get/i, ApiCalendar.SolarTerms);
Mock.mock(
  RegExp("/api/calendar/chineseAlmanac.*"),
  /get/i,
  ApiCalendar.ChineseAlmanac
);
Mock.mock(RegExp("/api/weather/5days.*"), /get/i, ApiWeather.FiveDays); // 模拟带参数的请求
