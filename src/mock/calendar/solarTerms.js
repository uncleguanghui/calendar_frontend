// 获取每年的节气（每年的结果里，会包含去前15天和明年15天之类的结果）
const solarTerms = {
  "2012": { "2013-01-05": "小寒" },
  "2013": {
    "2013-01-05": "小寒",
    "2013-01-20": "大寒",
    "2013-02-04": "立春",
    "2013-02-18": "雨水",
    "2013-03-05": "惊蛰",
    "2013-03-20": "春分",
    "2013-04-04": "清明",
    "2013-04-20": "谷雨",
    "2013-05-05": "立夏",
    "2013-05-21": "小满",
    "2013-06-05": "芒种",
    "2013-06-21": "夏至",
    "2013-07-07": "小暑",
    "2013-07-22": "大暑",
    "2013-08-07": "立秋",
    "2013-08-23": "处暑",
    "2013-09-07": "白露",
    "2013-09-23": "秋分",
    "2013-10-08": "寒露",
    "2013-10-23": "霜降",
    "2013-11-07": "立冬",
    "2013-11-22": "小雪",
    "2013-12-07": "大雪",
    "2013-12-22": "冬至",
    "2014-01-05": "小寒"
  },
  "2014": {
    "2013-12-22": "冬至",
    "2014-01-05": "小寒",
    "2014-01-20": "大寒",
    "2014-02-04": "立春",
    "2014-02-19": "雨水",
    "2014-03-06": "惊蛰",
    "2014-03-21": "春分",
    "2014-04-05": "清明",
    "2014-04-20": "谷雨",
    "2014-05-05": "立夏",
    "2014-05-21": "小满",
    "2014-06-06": "芒种",
    "2014-06-21": "夏至",
    "2014-07-07": "小暑",
    "2014-07-23": "大暑",
    "2014-08-07": "立秋",
    "2014-08-23": "处暑",
    "2014-09-08": "白露",
    "2014-09-23": "秋分",
    "2014-10-08": "寒露",
    "2014-10-23": "霜降",
    "2014-11-07": "立冬",
    "2014-11-22": "小雪",
    "2014-12-07": "大雪",
    "2014-12-22": "冬至",
    "2015-01-06": "小寒"
  },
  "2015": {
    "2014-12-22": "冬至",
    "2015-01-06": "小寒",
    "2015-01-20": "大寒",
    "2015-02-04": "立春",
    "2015-02-19": "雨水",
    "2015-03-06": "惊蛰",
    "2015-03-21": "春分",
    "2015-04-05": "清明",
    "2015-04-20": "谷雨",
    "2015-05-06": "立夏",
    "2015-05-21": "小满",
    "2015-06-06": "芒种",
    "2015-06-22": "夏至",
    "2015-07-07": "小暑",
    "2015-07-23": "大暑",
    "2015-08-08": "立秋",
    "2015-08-23": "处暑",
    "2015-09-08": "白露",
    "2015-09-23": "秋分",
    "2015-10-08": "寒露",
    "2015-10-24": "霜降",
    "2015-11-08": "立冬",
    "2015-11-22": "小雪",
    "2015-12-07": "大雪",
    "2015-12-22": "冬至",
    "2016-01-06": "小寒"
  },
  "2016": {
    "2015-12-22": "冬至",
    "2016-01-06": "小寒",
    "2016-01-20": "大寒",
    "2016-02-04": "立春",
    "2016-02-19": "雨水",
    "2016-03-05": "惊蛰",
    "2016-03-20": "春分",
    "2016-04-04": "清明",
    "2016-04-19": "谷雨",
    "2016-05-05": "立夏",
    "2016-05-20": "小满",
    "2016-06-05": "芒种",
    "2016-06-21": "夏至",
    "2016-07-07": "小暑",
    "2016-07-22": "大暑",
    "2016-08-07": "立秋",
    "2016-08-23": "处暑",
    "2016-09-07": "白露",
    "2016-09-22": "秋分",
    "2016-10-08": "寒露",
    "2016-10-23": "霜降",
    "2016-11-07": "立冬",
    "2016-11-22": "小雪",
    "2016-12-07": "大雪",
    "2016-12-21": "冬至",
    "2017-01-05": "小寒"
  },
  "2017": {
    "2016-12-21": "冬至",
    "2017-01-05": "小寒",
    "2017-01-20": "大寒",
    "2017-02-03": "立春",
    "2017-02-18": "雨水",
    "2017-03-05": "惊蛰",
    "2017-03-20": "春分",
    "2017-04-04": "清明",
    "2017-04-20": "谷雨",
    "2017-05-05": "立夏",
    "2017-05-21": "小满",
    "2017-06-05": "芒种",
    "2017-06-21": "夏至",
    "2017-07-07": "小暑",
    "2017-07-22": "大暑",
    "2017-08-07": "立秋",
    "2017-08-23": "处暑",
    "2017-09-07": "白露",
    "2017-09-23": "秋分",
    "2017-10-08": "寒露",
    "2017-10-23": "霜降",
    "2017-11-07": "立冬",
    "2017-11-22": "小雪",
    "2017-12-07": "大雪",
    "2017-12-22": "冬至",
    "2018-01-05": "小寒"
  },
  "2018": {
    "2017-12-22": "冬至",
    "2018-01-05": "小寒",
    "2018-01-20": "大寒",
    "2018-02-04": "立春",
    "2018-02-19": "雨水",
    "2018-03-05": "惊蛰",
    "2018-03-21": "春分",
    "2018-04-05": "清明",
    "2018-04-20": "谷雨",
    "2018-05-05": "立夏",
    "2018-05-21": "小满",
    "2018-06-06": "芒种",
    "2018-06-21": "夏至",
    "2018-07-07": "小暑",
    "2018-07-23": "大暑",
    "2018-08-07": "立秋",
    "2018-08-23": "处暑",
    "2018-09-08": "白露",
    "2018-09-23": "秋分",
    "2018-10-08": "寒露",
    "2018-10-23": "霜降",
    "2018-11-07": "立冬",
    "2018-11-22": "小雪",
    "2018-12-07": "大雪",
    "2018-12-22": "冬至",
    "2019-01-05": "小寒"
  },
  "2019": {
    "2018-12-22": "冬至",
    "2019-01-05": "小寒",
    "2019-01-20": "大寒",
    "2019-02-04": "立春",
    "2019-02-19": "雨水",
    "2019-03-06": "惊蛰",
    "2019-03-21": "春分",
    "2019-04-05": "清明",
    "2019-04-20": "谷雨",
    "2019-05-06": "立夏",
    "2019-05-21": "小满",
    "2019-06-06": "芒种",
    "2019-06-21": "夏至",
    "2019-07-07": "小暑",
    "2019-07-23": "大暑",
    "2019-08-08": "立秋",
    "2019-08-23": "处暑",
    "2019-09-08": "白露",
    "2019-09-23": "秋分",
    "2019-10-08": "寒露",
    "2019-10-24": "霜降",
    "2019-11-08": "立冬",
    "2019-11-22": "小雪",
    "2019-12-07": "大雪",
    "2019-12-22": "冬至",
    "2020-01-06": "小寒"
  },
  "2020": {
    "2019-12-22": "冬至",
    "2020-01-06": "小寒",
    "2020-01-20": "大寒",
    "2020-02-04": "立春",
    "2020-02-19": "雨水",
    "2020-03-05": "惊蛰",
    "2020-03-20": "春分",
    "2020-04-04": "清明",
    "2020-04-19": "谷雨",
    "2020-05-05": "立夏",
    "2020-05-20": "小满",
    "2020-06-05": "芒种",
    "2020-06-21": "夏至",
    "2020-07-06": "小暑",
    "2020-07-22": "大暑",
    "2020-08-07": "立秋",
    "2020-08-22": "处暑",
    "2020-09-07": "白露",
    "2020-09-22": "秋分",
    "2020-10-08": "寒露",
    "2020-10-23": "霜降",
    "2020-11-07": "立冬",
    "2020-11-22": "小雪",
    "2020-12-07": "大雪",
    "2020-12-21": "冬至"
  },
  "2021": { "2020-12-21": "冬至" }
};

export default function(req) {
  let res = null;
  switch (req.type) {
    case "GET":
      res = solarTerms;
      break;
    default:
      break;
  }
  console.log(req.type, req.url, res);
  return res;
}
