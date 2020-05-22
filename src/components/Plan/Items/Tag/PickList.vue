<template>
  <div>
    <div
      v-for="tag in tags"
      :key="tag.id"
      class="tag-row"
      @click="() => handleClick(tag.id)"
    >
      <!-- 标签 -->
      <div class="tag-title">
        <a-tag :color="tag.color" style="transition: none">
          {{ tag.title }}
        </a-tag>
        <!-- 新标签的符号 -->
        <i style="font-size: 8px; color: #ff6060" v-if="tag.title === newTitle">
          New !!!
        </i>
      </div>
      <!-- 选中状态 -->
      <div class="tag-operation">
        <div class="check-status">
          <a-icon type="check" v-if="choosenIdList.indexOf(tag.id) > -1" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Array, // 选中的标签ID列表
    tags: Array, // 要渲染的标签
    newTitle: String // 新创建的标签名称（用于展示 new 这几个字）
  },
  data() {
    return {
      choosenIdList: [...this.value]
    };
  },
  watch: {
    value(to) {
      this.choosenIdList = to;
    }
  },
  methods: {
    // 更新标签的选中状态
    handleClick(id) {
      let index = this.choosenIdList.indexOf(id);
      if (index > -1) {
        this.choosenIdList.splice(index, 1);
      } else {
        this.choosenIdList.push(id);
      }
      this.$emit("input", this.choosenIdList);
    }
  }
};
</script>

<style scoped>
.tag-title {
  display: inline-block;
}

.tag-row {
  padding: 2px 2px 3px 2px;
  cursor: pointer;
}
.tag-row:hover {
  background-color: #188fff47;
  border-radius: 3px;
}

.tag-operation {
  /* display: inline-block; */
  float: right;
}
</style>
