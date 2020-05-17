import Vue from "vue";
import Vuex from "vuex";
import request from "@/utils/request";
import Plan from "@/utils/planObj";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    planGroupMenu: [
      { key: "today", icon: "calendar", name: "今天" },
      { key: "recent", icon: "schedule", name: "最近7天" },
      { key: "star", icon: "star", name: "我的收藏", iconColor: "#ffc53d" },
      { key: "all", icon: "profile", name: "全部" },
      { key: "finished", icon: "check-circle", name: "已完成" },
      { key: "trash", icon: "delete", name: "已删除", hideNum: true }
    ], // 计划分组
    currentGroupKey: "", // 当前选中的分组
    currentPlanId: "", // 当前打开的计划 Id
    planTags: [], // 所有标签
    currentPlans: [], // 当前展开的所有计划，planDataFull 变化时会自动跟着变
    planDataFull: [], // 所有计划，其变化会自动影响所有数据，包括 currentPlans 和当前打开的计划
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
        console.log("4 成功获取所有标签");
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
        console.log(`4 创建一个新标签：${title}`);
      });
    },
    // 更新一个标签
    UPDATETAG(state, tag) {
      console.log("4 更新标签内容", tag);
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
        let tagIndex = tags.map(i => i.id).indexOf(res.data.id);

        if (tagIndex > -1) {
          let target = tags[tagIndex];
          for (let key in res.data) {
            target[key] = res.data[key];
          }
          state.planTags = tags;
          console.log("4 单个标签更新完成", target);
        } else {
          console.warn("4 未找到目标标签");
        }
      });
    },
    // 修改当前计划列表
    SETCURRENTPLANS(state, plans) {
      state.currentPlans = plans;
    },
    // 修改当前展示的计划详情
    SETCURRENTPLANID(state, id) {
      state.currentPlanId = id;
    },
    // 修改当前选中的分组 key
    SETCURRENTGROUPKEY(state, key) {
      state.currentGroupKey = key;
    },
    // 获取当前所有计划
    GETPLANS(state) {
      request({
        url: "/api/plans",
        method: "get"
      }).then(res => {
        state.planDataFull = res.data.map(plan => new Plan(plan));
        console.log("1 成功获取所有计划");
      });
    },
    // 更新计划
    UPDATEPLAN(state, id, data) {
      console.log("3 更新计划内容", data);
      request({
        url: `/api/plans/${id}`,
        method: "put",
        data: data
      }).then(res => {
        // 更新列表里的数据
        let plans = [...state.planDataFull];
        let planIndex = plans.map(i => i.id).indexOf(res.data.id);

        if (planIndex > -1) {
          let target = plans[planIndex];
          for (let key in res.data) {
            target[key] = res.data[key];
          }
          plans[planIndex] = new Plan(target);
          state.planDataFull = plans;
          console.log("3 单个计划更新完成", target);
        } else {
          console.warn("3 未找到目标计划");
        }
      });
    },
    // 删除计划
    DELETEPLAN(state, id) {
      request({
        url: `/api/plans/${id}`,
        method: "delete"
      }).then(res => {
        state.planDataFull = res.data.map(plan => new Plan(plan));
        console.log("3 删除单个计划，并更新所有计划数据");
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
    },
    setCurrentPlans({ commit }, plans) {
      commit("SETCURRENTPLANS", plans);
    },
    setCurrentPlanId({ commit }, id) {
      commit("SETCURRENTPLANID", id);
    },
    setCurrentGroupKey({ commit }, key) {
      commit("SETCURRENTGROUPKEY", key);
    },
    getPlans({ commit }) {
      commit("GETPLANS");
    },
    updatePlan({ commit }, id, data) {
      commit("UPDATEPLAN", id, data);
    },
    deletePlan({ commit }, id) {
      commit("DELETEPLAN", id);
    }
  },
  modules: {}
});
