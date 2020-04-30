<template>
  <div>
    <!-- 标题 -->
    <span :style="{ fontSize: '32px' }">{{ title }}</span>
    <!-- 右上角下拉框 -->
    <div :style="{ float: 'right', marginTop: '12px' }">
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
              :src="moreMenus['detail'][selectedDetailKey].icon"
              :size="moreMenus['detail'][selectedDetailKey].size"
              :style="{
                marginRight: '10px'
              }"
            />
            {{ moreMenus["detail"][selectedDetailKey].text }}
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
    }
  },
  data() {
    const publicPath = process.env.BASE_URL;
    return {
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

<style scoped>
.box-content {
  display: inline-block;
  vertical-align: text-top;
}

.box-title {
  font-size: 14px;
  font-weight: bold;
}

.box-description {
  font-size: 8px;
  margin-left: 23px;
  line-height: 2;
  border-bottom: 1px solid #ececec;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;
  width: 100%;
  display: block;
  max-width: calc(50vw - 160px);
}
</style>
