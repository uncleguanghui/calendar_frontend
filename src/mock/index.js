const Mock = require("mockjs");

import ApiPlans from "./plans/index";
import ApiCalendar from "./calendar/index";
import APIWeather from "./weather/index";

Mock.mock("/api/plans", /get|post/i, ApiPlans.Plans);
Mock.mock(RegExp("/api/plans/.*"), /get|delete|put/i, ApiPlans.Plan); // 模拟符合 restful 规范的的 url

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

Mock.mock(RegExp("/api/weather/5days?.*"), /get/i, APIWeather.FiveDays); // 模拟带参数的请求
