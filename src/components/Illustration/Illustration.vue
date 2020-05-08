<template>
  <div>
    <a-card>
      <!-- 搜索 -->
      <a-input-search
        placeholder="搜索：输入英文关键字"
        enter-button
        @search="onSearch"
        @change="onChange"
        :style="{ width: '300px' }"
        slot="title"
      />
      <!-- 图片展示 -->
      <a-card-grid
        :style="{ width: gridWidth, textAlign: 'center' }"
        v-for="image in renderFiles"
        :key="image"
      >
        <img :src="image" alt="" class="card-image" />
        <div :style="{ paddingTop: '20px' }">
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
      v-if="!searchInput"
      type="dashed"
      :style="{ margin: '20px 0' }"
      @click="loadMore"
    >
      加载更多
    </a-button>
  </div>
</template>

<script>
export default {
  name: "",
  props: [""],
  data() {
    const publicPath = process.env.BASE_URL;
    const names = require
      .context("../../../public/illustrations", false, /.(png|svg)$/)
      .keys()
      .map(obj => obj.slice(2, obj.length)); //去掉文件名前面的 "./"
    return {
      publicPath: publicPath,
      searchInput: "", //搜索文字
      names: names, //所有图片名
      files: names.map(obj => publicPath + "illustrations/" + obj), //所有图片路径
      renderFiles: [], //要渲染的图片
      showFiles: [], //当前已经渲染过的图片，用于取消搜索时加载回来
      pageSize: 40,
      nextPage: 0,
      scrollDelta: 100, // 距离底部的阈值，当小于这个值时加载更多图片
      notificationTime: undefined, //开始提示的时间
      notificationDuration: 4.5 //到底时提示的时间（秒）
    };
  },
  components: {},
  beforeMount() {},
  mounted() {
    // 一开始的时候先加载一次图片
    this.loadMore();
    // 增加滚动监听事件
    window.addEventListener("scroll", this.scrollListener);
  },
  methods: {
    // 加载更多图片
    loadMore() {
      const start = this.nextPage * this.pageSize;
      const newFiles = this.files.slice(start, start + this.pageSize);
      if (newFiles.length > 0) {
        this.renderFiles = [...this.renderFiles, ...newFiles];
        this.showFiles = this.renderFiles;
        this.nextPage += 1;
      } else {
        this.notification();
      }
    },
    // 当没有新图片时，提示用户
    notification() {
      if (
        // 设定间隔时间，防止多次提示
        !this.notificationTime ||
        new Date() - this.notificationTime >= this.notificationDuration * 1000
      ) {
        this.$notification.open({
          duration: this.notificationDuration,
          message: "已经到底啦",
          icon: <a-icon type="smile" style="color: #108ee9" />
          // placement: "bottomRight"
        });
        this.notificationTime = new Date();
      }
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
      this.searchInput = value;
      if (value) {
        this.renderFiles = this.names
          .filter(obj => obj.toLowerCase().indexOf(value.toLowerCase()) > -1)
          .map(obj => this.publicPath + "illustrations/" + obj);
      } else {
        this.renderFiles = this.showFiles;
      }
    },
    onChange(e) {
      const { value } = e.target;
      this.onSearch(value);
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
  },
  watch: {}
};
</script>

<style scoped>
.card-image {
  max-height: 100px;
}
</style>
