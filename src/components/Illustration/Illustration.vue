<template>
  <div>
    <a-card>
      <!-- 搜索 -->
      <a-input-search
        placeholder="搜索：输入英文关键字"
        enter-button
        @search="onSearch"
        :style="{ width: '300px' }"
        slot="title"
      />
      <!-- 图片展示 -->
      <a-card-grid
        :style="{ width: gridWidth, textAlign: 'center', overflow: 'hidden' }"
        v-for="image in renderFiles"
        :key="image"
      >
        <div
          v-html="dictSVG[image]"
          :style="{ maxHeight: '100px' }"
          @dblclick="() => copyImage(image)"
        />
        <div :style="{ paddingTop: '20px' }" class="one-line-span ">
          {{
            image
              .split("/")
              .pop()
              .split(".")[0]
          }}
        </div>
      </a-card-grid>
    </a-card>
    <!-- 加载更多 -->
    <a-button
      type="dashed"
      :style="{ margin: '20px 0' }"
      @click="loadMore"
      v-if="
        (!searchValue && hasNextLoadPage && loadStatus === 0) ||
          (searchValue && hasNextSearchPage && searchStatus === 0)
      "
    >
      加载更多
    </a-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      publicPath: process.env.BASE_URL,
      pageSize: 40,
      isScrolling: false,
      scrollDelta: 100, // 距离底部的阈值，当小于这个值时加载更多图片

      loadStatus: 0, // 异步加载状态：0-未加载；1-加载中，此时无法运行 loadmore
      nextLoadPage: 0, // 加载图片 page index
      hasNextLoadPage: true, // 是否还有下一页加载
      showLoadFiles: [], //当前已经渲染过的图片，用于取消搜索时加载回来

      searchStatus: 0, // 搜索时的异步加载状态：0-未加载；1-加载中，此时无法运行 loadmore
      searchValue: "", // 搜索的内容
      nextSearchPage: 0, // 搜索图片 page index
      hasNextSearchPage: true, // 是否还有下一页搜索
      showSearchFiles: [], //当前已经渲染过的图片，用于取消搜索时加载回来

      renderFiles: [], //要渲染的图片
      dictSVG: {} // 已下载的svg图片
    };
  },
  mounted() {
    // 一开始的时候先加载一次图片
    this.loadMore();
    // 增加滚动监听事件
    window.addEventListener("scroll", this.throttle(this.scrollListener));
  },
  destroyed() {
    // 摧毁监听事件
    window.removeEventListener("scroll", this.throttle(this.scrollListener));
  },
  methods: {
    // 正常加载图片
    load(pageIndex = 0) {
      this.loadStatus = 1;
      this.$request({
        url: "/api/illustrations/load",
        method: "get",
        params: {
          page: pageIndex,
          size: this.pageSize
        }
      }).then(res => {
        this.hasNextLoadPage = res.data.hasMore;
        if (res.data.names.length > 0) {
          res.data.names.map(i => this.getSvg(i));
          this.nextLoadPage = pageIndex + 1;
          this.renderFiles = [...this.renderFiles, ...res.data.names];
          this.showLoadFiles = this.renderFiles; // 更新当前渲染的图片
        }
        this.loadStatus = 0;
      });
    },
    // 搜索图片
    search(value, pageIndex = 0) {
      this.searchStatus = 1;
      this.$request({
        url: "/api/illustrations/search",
        method: "get",
        params: {
          page: pageIndex,
          size: this.pageSize,
          keywords: value
        }
      }).then(res => {
        this.hasNextSearchPage = res.data.hasMore;
        if (res.data.names.length > 0) {
          res.data.names.map(i => this.getSvg(i));
          this.nextSearchPage = pageIndex + 1;
          this.renderFiles = [...this.renderFiles, ...res.data.names];
          this.showSearchFiles = this.renderFiles; // 更新当前渲染的图片
        }
        this.searchStatus = 0;
      });
    },
    // 按页加载图片
    loadMore() {
      if (
        this.searchValue &&
        this.searchStatus === 0 &&
        this.hasNextSearchPage
      ) {
        // 有搜索时
        this.search(this.searchValue, this.nextSearchPage);
      } else if (
        !this.searchValue &&
        this.loadStatus === 0 &&
        this.hasNextLoadPage
      ) {
        // 正常加载时
        this.load(this.nextLoadPage);
      }
    },
    // 获取svg内容
    getSvg(name) {
      if (!(name in this.dictSVG)) {
        let url = this.publicPath + "illustrations/" + name;
        this.$axios.get(url).then(res => {
          // 添加样式
          let data =
            '<svg style="max-height:100px; width:100%; cursor:pointer"' +
            res.data.slice(4);
          // 使得视图能够准确更新
          this.$set(this.dictSVG, name, data);
        });
      }
    },
    // 节流函数 : 减少浏览器内存消耗
    throttle(callback) {
      let isScrolling = false;
      return function() {
        if (isScrolling) return;
        isScrolling = true;
        // requestAnimationFrame:回调间隔 = 浏览器重绘频率
        // setTimeout(function() {
        //   callback();
        //   isScrolling = false;
        // }, 1000);
        window.requestAnimationFrame(function() {
          callback();
          isScrolling = false;
        });
      };
    },
    // 滚动的监听事件
    scrollListener() {
      const delta =
        document.documentElement.scrollHeight -
        document.documentElement.offsetHeight -
        document.documentElement.scrollTop;
      if (delta < this.scrollDelta) {
        this.loadMore();
      }
    },
    // 搜索图片
    onSearch(value) {
      console.log("onSearch", value);
      if (value !== this.searchValue) {
        // 清空之前的搜索内容
        this.searchValue = value;
        this.nextSearchPage = 0;
        this.hasNextSearchPage = true;
        this.showSearchFiles = [];
        if (!value) {
          // 如果没有值的话，则渲染之前所有正常加载的图片
          this.renderFiles = this.showLoadFiles;
        } else {
          // 如果有新的值，则清空当前渲染的图片，并重新下载
          this.renderFiles = [];
          this.search(value, 0);
        }
      }
    },
    // 双击拷贝图像内容
    copyImage(name) {
      let data = this.dictSVG[name];
      this.$copyText(data)
        .then(() => {
          const len = data.length;
          this.$notification.success({
            message: `已将svg内容复制到剪贴板`,
            description: data.slice(0, 30) + " ... " + data.slice(len - 10, len)
          });
        })
        .catch(() => {
          this.$notification.error({
            message: `拷贝失败`
          });
        });
    }
  },
  computed: {
    gridWidth() {
      let width;
      switch (this.renderFiles.length) {
        case 1:
          width = "100%";
          break;
        case 2:
          width = "50%";
          break;
        case 3:
          width = "33%";
          break;
        default:
          width = "25%";
          break;
      }
      return width;
    }
  }
};
</script>

<style scoped>
.one-line-span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;
  width: 100%;
}
</style>
