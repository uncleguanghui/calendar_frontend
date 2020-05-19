<template>
  <div>
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
      <a-menu-item :key="group.key" v-for="group in planGroupMenu">
        <a-icon :type="group.icon" :style="{ color: group.iconColor }" />
        {{ group.name }}
        <span style="float:right;" v-if="planNumForStatus[group.key]">
          {{ planNumForStatus[group.key] }}
        </span>
      </a-menu-item>
    </a-menu>
    <a-divider style="margin: 12px 0;" />
    <a-collapse
      default-active-key="1"
      :bordered="false"
      :style="{ textAlign: 'left', backgroundColor: '#fff0' }"
    >
      <template #expandIcon="props">
        <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
      </template>
      <a-collapse-panel key="1" header="标签" class="collapse-panel">
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
              style="right: 0; top: 8px; position: absolute; "
              v-if="planNumForTags[tag.id]"
            >
              {{ planNumForTags[tag.id] }}
            </span>
          </a-menu-item>
        </a-menu>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedKeys: ["today"], // 默认选中的分组
      selectedTags: [], // 选中的标签
      planGroupMenu: this.$store.state.planGroupMenu, // 计划侧边栏
      tags: [...this.$store.state.planTags].sort(this.tagSort), // 排序后的标签
      plans: [...this.$store.state.planDataFull] // 所有任务
    };
  },
  watch: {
    "$store.state.planTags": function(to) {
      this.tags = [...to].sort(this.tagSort);
    },
    "$store.state.planDataFull": function(to) {
      this.plans = to;

      // 更新当前列表的数据
      let key = this.selectedTags[0] || this.selectedKeys[0];
      this.refreshCurrentPlans({ key });
    },
    selectedKeys(to) {
      this.$store.dispatch("setCurrentGroupKey", to.length ? to[0] : "");
    }
  },
  computed: {
    // 统计各优先级的数量（包括已删除的）
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
        if (plan.belongAll()) {
          res.all += 1;
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
    tagSort(a, b) {
      return a.title.localeCompare(b.title);
    },
    // 点击侧边栏，刷新数据——从所有计划中，筛选出当前页面需要展示的计划
    refreshCurrentPlans({ key }) {
      let currentPlans = [];
      this.selectedTags = [];
      this.selectedKeys = [key];

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
        case "all":
          currentPlans = this.plans.filter(i => i.belongAll());
          break;
        case "finished":
          currentPlans = this.plans.filter(i => i.belongFinished());
          break;
        case "trash":
          currentPlans = this.plans.filter(i => i.belongTrash());
          break;
        // 是否是标签的 key
        default:
          this.selectedKeys = [];
          if (this.tags.map(i => i.id).indexOf(key) > -1) {
            this.selectedTags = [key];
            currentPlans = this.plans.filter(
              i => i.tags.map(i => i.id).indexOf(key) > -1
            );
          }
          break;
      }
      this.$store.dispatch("setCurrentPlans", [...currentPlans]);
      console.log("2 成功更新计划列表页", currentPlans);
    }
  }
};
</script>

<style scoped></style>
