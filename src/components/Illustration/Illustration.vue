<template>
  <div>
    <a-card>
      <a-card-grid
        style="width:25%;text-align:center"
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
    <a-button type="dashed" :style="{ margin: '20px 0' }" @click="loadMore">
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
    const files = require
      .context("../../../public/illustrations", false, /.(png|svg)$/)
      .keys()
      .map(obj => publicPath + "illustrations/" + obj);
    return {
      files: files, //所有图片
      renderFiles: [], //要渲染的图片
      pageSize: 40,
      nextPage: 0,
      scrollDelta: 100 // 距离底部的阈值，当小于这个值时加载更多图片
    };
  },
  components: {},
  beforeMount() {},
  mounted() {
    // 一开始的时候先加载一次图片
    this.loadMore();
    window.addEventListener("scroll", this.scrollListener);
  },
  methods: {
    // 加载更多图片
    loadMore() {
      // window.addEventListener("scroll", this.menu);
      const start = this.nextPage * this.pageSize;
      this.renderFiles = [
        ...this.renderFiles,
        ...this.files.slice(start, start + this.pageSize)
      ];
      this.nextPage += 1;
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
    }
  },
  computed: {},
  watch: {}
};
</script>

<style scoped>
.card-image {
  max-height: 100px;
}
</style>
