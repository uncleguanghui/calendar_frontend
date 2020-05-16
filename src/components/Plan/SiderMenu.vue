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
      @click="clickHandle"
    >
      <a-menu-item :key="item.key" v-for="item in $store.state.planSiderMenu">
        <a-icon :type="item.icon" :style="{ color: item.color }" />
        {{ item.name }}
        <span style="float:right;" v-if="planNum(item.key) > 0">
          {{ planNum(item.key) }}
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
            <span style="right: 0; top: 8px; position: absolute; ">
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
      selectedKeys: [this.$router.currentRoute.path],
      selectedTags: [],
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
    }
  },
  computed: {
    // 统计各优先级的数量
    planNumForTags() {
      let res = {};
      for (let plan of this.plans) {
        for (let tag of plan.tags) {
          if (tag.id in res) {
            res[tag.id] += 1;
          } else {
            res[tag.id] = 0;
          }
        }
      }
      return res;
    },
    // 统计各项目下的数量
    planNumForStatus() {
      let res = {};
      return res;
    }
  },
  methods: {
    tagSort(a, b) {
      return a.title.localeCompare(b.title);
    },
    // 点击事件
    clickHandle({ key }) {
      const currentKey = this.$router.currentRoute.path;
      if (currentKey != key) {
        this.$router.push(key).catch(err => {
          err;
        });
      }
    },
    planNum(key) {
      let num = 0;
      switch (key) {
        case "/plan/today":
          num = this.$store.state.planDataToday.length;
          break;
        case "/plan/recent":
          num = this.$store.state.planDataRecent.length;
          break;
        case "/plan/star":
          num = this.$store.state.planDataStar.length;
          break;
        case "/plan/finished":
          num = this.$store.state.planDataFinished.length;
          break;
        case "/plan/all":
          num = this.$store.state.planDataAll.length;
          break;
        case "/plan/trash":
          num = this.$store.state.planDataTrash.length;
          break;
        default:
          break;
      }
      return num;
    }
  }
};
</script>

<style scoped></style>
