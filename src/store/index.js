import Vue from "vue";
import Vuex from "vuex";
import request from "@/utils/request";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    planSiderMenu: [
      { key: "/plan/today", icon: "calendar", name: "今天" },
      { key: "/plan/recent", icon: "schedule", name: "最近7天" },
      { key: "/plan/star", icon: "star", name: "我的收藏", color: "#ffc53d" },
      {
        key: "/plan/all",
        icon: "profile",
        name: "全部",
        style: { borderBottom: "1px dashed #d9d9d9" }
      },
      {
        key: "/plan/finished",
        icon: "check-circle",
        name: "已完成"
      },
      { key: "/plan/trash", icon: "delete", name: "已删除", hideNum: true }
    ], //计划侧边栏
    planTags: [], // 所有标签
    currentPlan: {}, // 当前计划
    currentPlans: [], // 当前展开的所有计划
    planDataFull: [], // 所有计划
    planDataAll: [], // 全部计划，不包括已删除计划
    planDataToday: [], // 今日计划，不包括已删除计划
    planDataRecent: [], // 最近7天计划，不包括已删除计划
    planDataStar: [], // 已收藏计划，不包括已删除计划
    planDataFinished: [], // 已完成计划，不包括已删除计划
    planDataTrash: [], // 已删除计划
    // 图标列表里，图标的位置是有讲究的，按从弱到强以及关联性排序（为了在弱匹配时能返回一个较正确的图标）
    weatherDict: {
      雨: [
        "小雨.png",
        "中雨.png",
        "大雨.png",
        "暴雨.png",
        "特大暴雨.png",
        "暴风雨.png",
        "雨夹雪.png",
        "雨加冰雹.png",
        "雷阵雨.png"
      ],
      雷: ["雷电.png", "雷阵雨.png"],
      电: ["闪电.png", "雷电.png"],
      雪: ["小雪.png", "中雪.png", "大雪.png", "大暴雪.png", "雨夹雪.png"],
      风: ["风.png", "大风.png", "飓风.png", "龙卷风.png", "暴风雨.png"],
      云: ["云.png", "多云.png"],
      冰雹: ["雨加冰雹.png"],
      雾: ["雾.png", "大霾.png", "雾霾.png"],
      霾: ["霾.png", "雾霾.png"],
      沙: ["沙尘.png"],
      晴: ["晴.png"],
      阴: ["阴.png"],
      其他: ["浮沉.png"]
    },
    /**
     * 公历节日
     * 日期是公历
     * 链接的格式是：https://baike.baidu.com/item/节日名
     * **/
    solarFestival: {
      "01-01": "元旦",
      "02-14": "情人节",
      "03-05": "学雷锋日",
      "03-08": "妇女节",
      "03-12": "植树节",
      "03-14": "白色情人节",
      "03-15": "消费者权益日",
      "03-22": "世界水日",
      "04-01": "愚人节",
      "04-07": "世界卫生日",
      "04-22": "地球日",
      "04-23": "世界读书日",
      "05-01": "劳动节",
      "05-04": "青年节",
      "05-30": "五卅运动纪念日",
      "05-31": "世界无烟日",
      "06-01": "六一儿童节",
      "06-05": "世界环境日",
      "06-06": "全国爱眼日",
      "06-11": "中国人口日",
      "07-01": "香港回归",
      "07-07": "抗日战争纪念",
      "08-01": "八一建军节",
      "08-12": "国际青年日",
      "08-15": "抗日战争胜利纪念日",
      "09-03": "抗战纪念",
      "09-10": "教师节",
      "09-18": "九·一八事变纪念日",
      "09-20": "国际爱牙日",
      "09-21": "国际和平日",
      "09-22": "世界无车日",
      "09-27": "世界旅游日",
      "09-30": "烈士纪念日",
      "10-01": "国庆节",
      "10-10": "辛亥革命纪念日",
      "10-31": "万圣节",
      "11-10": "世界青年节",
      "11-08": "中国记者日",
      "11-11": "光棍节",
      "11-16": "国际宽容日",
      "11-17": "国际大学生节",
      "11-20": "世界儿童日",
      "12-01": "世界艾滋病日",
      "12-03": "国际残疾人日",
      "12-09": "一二·九运动",
      "12-10": "世界人权日",
      "12-12": "西安事变纪念日",
      "12-13": "南京大屠杀纪念日",
      "12-20": "澳门回归纪念日",
      "12-24": "平安夜",
      "12-25": "圣诞节"
    },
    /**
     * 农历节日
     * 日期是农历
     * 链接的格式是：https://baike.baidu.com/item/节日名
     * 注意如果后两位是00，代表是01的前一天，如除夕
     * **/
    lunarFestival: {
      "01-01": "春节",
      "01-15": "元宵节",
      "04-08": "佛诞",
      "02-02": "龙抬头",
      "03-03": "上巳节",
      "05-05": "端午节",
      "07-07": "七夕",
      "07-15": "中元节",
      "08-15": "中秋节",
      "09-09": "重阳节",
      "12-08": "腊八节",
      "12-23": "北方小年",
      "12-24": "南方小年",
      "01-00": "除夕"
    },
    /**
     * 西方节日
     * 日期前两位是月份，第三位是顺序，第四位是星期（0是周日）
     * 链接的格式是：https://baike.baidu.com/item/节日名
     * 母亲节：5月的第2个星期天
     * 父亲节：6月的第3个星期
     * 感恩节：11月的第4个星期四
     * **/
    westFestival: { "05-20": "母亲节", "06-30": "父亲节", "11-44": "感恩节" }
  },
  mutations: {
    // 获取所有标签
    GETTAGS(state) {
      return request({
        url: `/api/tags`,
        method: "get"
      }).then(res => {
        state.planTags = res.data;
        console.log("获取最新标签");
      });
    },
    // 创建一个标签
    CREATETAG(state, title) {
      return request({
        url: `/api/tags`,
        method: "post",
        data: {
          title: title,
          color: "#40a9ff" // 默认蓝色
        }
      }).then(res => {
        // 更新标签
        state.planTags = res.data;
        console.log("创建一个新标签");
      });
    },
    // 更新一个标签
    UPDATETAG(state, tag) {
      return request({
        url: `/api/tags/${tag.id}`,
        method: "put",
        data: {
          title: tag.title,
          color: tag.color
        }
      }).then(res => {
        // 更新列表里的数据
        let tags = [...state.planTags];
        let targets = tags.filter(item => item.id === res.data.id);
        let target = targets.length === 1 ? targets[0] : undefined;

        if (target) {
          console.log("更新前", target);
          for (let key in res.data) {
            target[key] = res.data[key];
          }
          console.log("更新后", target);
        } else {
          console.log(`未找到目标计划: ${this.plan.id}`);
        }

        state.planTags = tags;
        console.log("更新一个新标签");
      });
    }
  },
  actions: {
    getTags({ commit }) {
      commit("GETTAGS");
    },
    createTag({ commit }, title) {
      commit("CREATETAG", title);
    },
    updateTag({ commit }, tag) {
      commit("UPDATETAG", tag);
    }
  },
  modules: {}
});
