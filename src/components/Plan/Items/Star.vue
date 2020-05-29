<template>
  <a-tooltip
    :title="!star ? '点击收藏' : '点击取消收藏'"
    trigger="hover"
    placement="top"
  >
    <img
      :src="!star ? unstarImage : starImage"
      class="super-icon"
      style="cursor:pointer"
      @click="emitInput"
    />
  </a-tooltip>
</template>

<script>
export default {
  props: {
    value: Boolean
  },
  data() {
    let publicPath = process.env.BASE_URL;
    return {
      star: this.value,
      starImage: publicPath + "svg/" + "收藏.svg",
      unstarImage: publicPath + "svg/" + "未收藏.svg"
    };
  },
  watch: {
    value(to) {
      this.star = to;
    }
  },
  methods: {
    // 向后台提交数据更新
    emitInput() {
      console.log("更新收藏");
      this.star = !this.star;
      this.$emit("input", this.star);
    }
  }
};
</script>

<style scoped></style>
