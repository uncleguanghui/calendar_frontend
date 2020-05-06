<template>
  <div>
    <!-- 标题 -->
    <span :style="{ fontSize: '32px' }">{{ title }}</span>
    <!-- 右上角功能区 -->
    <div :style="{ float: 'right', marginTop: '12px' }">
      <a-tooltip title="同步" trigger="hover" placement="bottom">
        <a-avatar
          shape="square"
          :src="publicPath + 'icons/' + '同步.png'"
          :size="18"
          :style="{ marginRight: '15px' }"
          @click="reloadFunc"
        />
      </a-tooltip>
      <!-- 排序下拉框 -->
      <a-dropdown :trigger="['click']">
        <a-avatar
          shape="square"
          :src="sortMenus[selectedSortKey].icon"
          :size="sortMenus[selectedSortKey].size"
          :style="{ marginRight: '15px' }"
          @click="e => e.preventDefault()"
        />
        <a-menu
          slot="overlay"
          :selectedKeys="[selectedSortKey]"
          @click="sortClick"
        >
          <a-menu-item :key="key" v-for="(item, key) in sortMenus">
            <a-avatar
              shape="square"
              :src="item.icon"
              :size="item.size"
              :style="{ marginRight: '10px' }"
            />
            {{ item.text }}
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <!-- 更多下拉框 -->
      <a-dropdown :trigger="['click']">
        <a-avatar
          shape="square"
          :src="publicPath + 'icons/' + '更多.png'"
          :size="20"
          @click="e => e.preventDefault()"
        />
        <a-menu slot="overlay" @click="moreClick">
          <a-menu-item key="detail">
            <a-avatar
              shape="square"
              :src="moreMenus['detail'][reverseSelectedDetailKey].icon"
              :size="moreMenus['detail'][reverseSelectedDetailKey].size"
              :style="{
                marginRight: '10px'
              }"
            />
            {{ moreMenus["detail"][reverseSelectedDetailKey].text }}
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 排序对象
    selectedSortKey: {
      require: true
    },
    // 详情选择情况
    selectedDetailKey: {
      require: true
    },
    title: {
      require: true
    },
    reloadFunc: {
      require: true
    }
  },
  computed: {
    reverseSelectedDetailKey() {
      return this.selectedDetailKey === "show" ? "hide" : "show";
    }
  },
  data() {
    const publicPath = process.env.BASE_URL;
    return {
      rotate: false,
      publicPath: publicPath, // public 文件夹的位置
      sortMenus: {
        time: {
          text: "按时间排序",
          icon: publicPath + "icons/" + "降序-时间.png",
          size: 20
        },
        level: {
          text: "按优先级排序",
          icon: publicPath + "icons/" + "降序-文字.png",
          size: 18
        }
      },
      moreMenus: {
        detail: {
          show: {
            text: "显示详情",
            icon: publicPath + "icons/" + "详情-显示.png",
            size: 18
          },
          hide: {
            text: "隐藏详情",
            icon: publicPath + "icons/" + "详情-隐藏.png",
            size: 18
          }
        }
      }
    };
  },
  methods: {
    sortClick({ key }) {
      this.$emit("update:selectedSortKey", key);
    },
    moreClick({ key }) {
      switch (key) {
        case "detail":
          this.$emit(
            "update:selectedDetailKey",
            this.selectedDetailKey === "show" ? "hide" : "show"
          );
          break;
      }
    }
  }
};
</script>

<style scoped></style>
