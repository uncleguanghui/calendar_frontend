<template>
  <div style="overflow: auto;">
    <!-- 系统自带 -->
    <a-menu
      theme="light"
      mode="vertical"
      v-model="selectedKeys"
      :style="{
        lineHeight: '62px',
        textAlign: 'left',
        backgroundColor: '#fff0',
        borderRight: 'none'
      }"
      @click="refreshCurrentPlans"
    >
      <template v-for="groupId in groupIds">
        <a-menu-item
          :key="group.key"
          v-for="group in planGroupMenu.filter(i => i.groupId === groupId)"
        >
          <a-icon :type="group.icon" :style="{ color: group.iconColor }" />
          {{ group.name }}
          <span class="plan-num" v-if="planNumForStatus[group.key]">
            {{ planNumForStatus[group.key] }}
          </span>
        </a-menu-item>
        <a-menu-divider :key="groupId" />
      </template>
    </a-menu>
    <!-- 标签 -->
    <a-collapse
      default-active-key=""
      :bordered="false"
      :style="{ textAlign: 'left', backgroundColor: '#fff0' }"
    >
      <template #expandIcon="props">
        <a-icon
          type="caret-right"
          :rotate="props.isActive ? 90 : 0"
          style="color:#00000060"
        />
      </template>
      <a-collapse-panel key="1" class="collapse-panel">
        <span slot="header">
          标签
        </span>
        <plan-tag-operation class="plan-num" slot="extra" />
        <a-menu
          theme="light"
          mode="vertical"
          v-model="selectedTags"
          style="background-color: #fff0; border-right: none;"
          @click="refreshCurrentPlans"
        >
          <a-menu-item
            :key="tag.id"
            v-for="tag in tags"
            style="padding: 5px 0 5px 10px; line-height:1; height: 100%; margin: 0;"
          >
            <a-tag :color="tag.color">
              <span class="hidden-input" style="max-width:100px;">
                {{ tag.title }}
              </span>
            </a-tag>
            <span
              class="plan-num"
              style="right: 0; top: 10px; position: absolute; "
              v-if="planNumForTags[tag.id]"
            >
              {{ planNumForTags[tag.id] }}
            </span>
          </a-menu-item>
        </a-menu>
      </a-collapse-panel>
    </a-collapse>
    <!-- 用户自定义 -->
    <a-collapse
      default-active-key=""
      :bordered="false"
      :style="{ textAlign: 'left', backgroundColor: '#fff0' }"
    >
      <template #expandIcon="props">
        <a-icon
          type="caret-right"
          :rotate="props.isActive ? 90 : 0"
          style="color:#00000060"
        />
      </template>
      <a-collapse-panel key="1" class="collapse-panel">
        <span slot="header">
          自定义
        </span>
        <plan-list-operation class="plan-num" slot="extra" />
        <a-menu
          theme="light"
          mode="vertical"
          v-model="selectedLists"
          style="background-color: #fff0; border-right: none;"
          @click="refreshCurrentPlans"
        >
          <a-menu-item
            :key="list.id"
            v-for="list in lists"
            style="padding: 5px 0 5px 10px; line-height:1; height: 100%; margin: 0;"
          >
            <span class="hidden-input" style="max-width:100px;">
              {{ list.title }}
            </span>
            <span
              class="plan-num"
              style="right: 0; top: 10px; position: absolute; "
              v-if="planNumForLists[list.id]"
            >
              {{ planNumForLists[list.id] }}
            </span>
          </a-menu-item>
        </a-menu>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
// 样式
// TODO: 缩小间距

// 功能
// TODO: 增加计划的拖动功能
// TODO: 增加自定义计划本
// TODO: 整合日历，并将计划呈现在上面（这个最后做，要保证计划的各种操作都ok了）
import PlanTagOperation from "@/components/Plan/Items/Tag/TagOperation";
import PlanListOperation from "@/components/Plan/Items/List/ListOperation";

export default {
  components: { PlanTagOperation, PlanListOperation },
  data() {
    let planGroupMenu = this.$store.state.planGroupMenu;
    let groupIds = [...new Set(planGroupMenu.map(i => i.groupId))].sort();
    return {
      selectedKeys: ["today"], // 默认选中的分组
      selectedTags: [], // 选中的标签
      selectedLists: [], // 选中的自定义清单
      groupIds: groupIds, // 组
      planGroupMenu: planGroupMenu, // 计划侧边栏
      tags: [...this.$store.state.planTags].sort(this.objSort), // 排序后的标签
      lists: [...this.$store.state.planLists].sort(this.objSort), // 排序后的自定义清单
      plans: [...this.$store.state.planDataFull] // 所有任务
    };
  },
  watch: {
    "$store.state.planTags": function(to) {
      this.tags = [...to].sort(this.objSort);
    },
    "$store.state.planLists": function(to) {
      this.lists = [...to].sort(this.objSort);
    },
    "$store.state.planDataFull": function(to) {
      this.plans = to;

      // 更新当前列表的数据
      let key =
        this.selectedLists[0] || this.selectedTags[0] || this.selectedKeys[0];
      this.refreshCurrentPlans({ key });
    }
  },
  computed: {
    // 统计各标签的计划数量
    planNumForTags() {
      let res = {};
      for (let plan of this.plans) {
        for (let tag of plan.tags) {
          if (tag.id in res) {
            res[tag.id] += 1;
          } else {
            res[tag.id] = 1;
          }
        }
      }
      return res;
    },
    // 统计各自定义清单的计划数量
    planNumForLists() {
      let res = {};
      for (let plan of this.plans) {
        if (plan.list) {
          if (plan.list.id in res) {
            res[plan.list.id] += 1;
          } else {
            res[plan.list.id] = 1;
          }
        }
      }
      return res;
    },
    // 统计各项目下的数量
    planNumForStatus() {
      // 初始化
      let res = {};
      for (let group of this.planGroupMenu) {
        res[group.key] = 0;
      }
      // 计算数量
      for (let plan of this.plans) {
        if (plan.belongToday()) {
          res.today += 1;
        }
        if (plan.belongRecent()) {
          res.recent += 1;
        }
        if (plan.belongStar()) {
          res.star += 1;
        }
        if (plan.belongUndated()) {
          res.undated += 1;
        }
        if (plan.belongGoing()) {
          res.going += 1;
        }
        if (plan.belongExpired()) {
          res.expired += 1;
        }
        if (plan.belongFinished()) {
          res.finished += 1;
        }
        if (plan.belongTrash()) {
          res.trash += 1;
        }
      }
      return res;
    }
  },
  methods: {
    objSort(a, b) {
      return a.title.localeCompare(b.title);
    },
    // 点击侧边栏，刷新数据——从所有计划中，筛选出当前页面需要展示的计划
    refreshCurrentPlans({ key }) {
      let currentPlans = [];
      let menu = this.planGroupMenu[
        this.planGroupMenu.map(i => i.key).indexOf(key)
      ];
      let title = menu ? menu.name : "";
      let selectedKeys = [key];
      let selectedTags = [];
      let selectedLists = [];
      let selectedTag = undefined;
      let selectedList = undefined;

      switch (key) {
        // 是否是分组的 key
        case "today":
          currentPlans = this.plans.filter(i => i.belongToday());
          break;
        case "recent":
          currentPlans = this.plans.filter(i => i.belongRecent());
          break;
        case "star":
          currentPlans = this.plans.filter(i => i.belongStar());
          break;
        case "going":
          currentPlans = this.plans.filter(i => i.belongGoing());
          break;
        case "undated":
          currentPlans = this.plans.filter(i => i.belongUndated());
          break;
        case "expired":
          currentPlans = this.plans.filter(i => i.belongExpired());
          break;
        case "finished":
          currentPlans = this.plans.filter(i => i.belongFinished());
          break;
        case "trash":
          currentPlans = this.plans.filter(i => i.belongTrash());
          break;
        default:
          selectedKeys = [];
          // 是否是标签的 key
          selectedTag = this.tags[this.tags.map(i => i.id).indexOf(key)];
          if (selectedTag) {
            selectedTags = [selectedTag.id];
            currentPlans = this.plans.filter(
              i => i.tags.map(i => i.id).indexOf(key) > -1
            );
            title = selectedTag.title;
          } else {
            // 是否是自定义清单的 key
            selectedList = this.lists[this.lists.map(i => i.id).indexOf(key)];
            if (selectedList) {
              selectedLists = [selectedList.id];
              currentPlans = this.plans.filter(
                i => i.list && i.list.id === key
              );
              title = selectedList.title;
            }
          }
          break;
      }
      this.selectedLists = selectedLists;
      this.selectedTags = selectedTags;
      this.selectedKeys = selectedKeys;

      // console.log(menu, title);
      this.$store.dispatch("setCurrentGroupKey", key);
      this.$store.dispatch("setCurrentGroupTitle", title);
      this.$store.dispatch("setCurrentPlans", [...currentPlans]);
      console.log("2 成功更新计划列表页", currentPlans);
    }
  }
};
</script>

<style scoped>
.plan-num {
  float: right;
  font-size: 12px;
  color: #00000080;
}
</style>
