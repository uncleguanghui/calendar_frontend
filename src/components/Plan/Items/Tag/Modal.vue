<template>
  <a-modal
    centered
    destroyOnClose
    :maskClosable="false"
    :title="mode === 'create' ? '创建标签' : '编辑标签'"
    okText="确定"
    width="400px"
    cancelText="取消"
    @ok="handleOk"
    @cancel="handleCancle"
    :visible="visible"
  >
    <a-select
      allowClear
      style="width:100%; padding-bottom:20px;"
      v-if="mode === 'edit'"
      v-model="tagId"
      placeholder="请选择标签"
    >
      <a-select-option :value="tag.id" :key="tag.id" v-for="tag in tagsAll">
        <a-tag :color="tag.color">{{ tag.title }}</a-tag>
      </a-select-option>
    </a-select>
    <div v-if="mode === 'create' || (mode === 'edit' && tagId)">
      <div style="width: 100%; text-align: center;">
        <a-input
          class="title-input"
          placeholder="请输入标签名称"
          v-model="title"
          :style="{
            background: color,
            '--border-color': color + '80',
            '--box-shadow': '0 0 0 2px ' + color + '20'
          }"
        />
      </div>
      <div style="padding: 20px 0 10px 0; display: inline-block">
        <tag-color-list v-model="color" />
      </div>
    </div>
  </a-modal>
</template>

<script>
import TagColorList from "./ColorList";

export default {
  components: { TagColorList },
  props: {
    value: {
      // 是否可见
      type: Boolean,
      default: false
    },
    mode: {
      // Modal 模式 —— 创建标签 or 编辑标签
      type: String,
      default: "create",
      validator: function(value) {
        return value === "create" || value === "edit";
      }
    }
  },
  data() {
    return {
      visible: this.value,
      title: "",
      color: "#03a9f4", // 创建标签时选中的颜色
      tagId: undefined // 编辑标签时选中的标签ID
    };
  },
  watch: {
    value(to) {
      this.visible = to;
      if (to) {
        this.reset();
      }
    },
    // 新选中标签时，重置当前的标题和颜色
    pickedTag(to) {
      if (to) {
        console.log("当前选中标签为", to);
        this.title = to.title;
        this.color = to.color;
      }
    }
  },
  computed: {
    // 该用户的所有标签
    tagsAll() {
      return [...this.$store.state.planTags].sort(this.tagSort);
    },
    // 当前选中的标签
    pickedTag() {
      return this.tagsAll[this.tagsAll.map(i => i.id).indexOf(this.tagId)];
    }
  },
  methods: {
    // 重置
    reset() {
      this.title = "";
      this.color = "#03a9f4";
      this.tagId = undefined;
    },
    // 点击确定
    handleOk() {
      if (this.mode === "create") {
        this.createTag();
      } else {
        this.updateTag();
      }
      this.handleCancle();
    },
    // 创建标签
    createTag() {
      if (!this.title) {
        this.$notification.warn({ message: "请输入标签名" });
      } else {
        this.$store.dispatch("createTag", {
          title: this.title,
          color: this.color
        });
      }
    },
    // 更新标签
    updateTag() {
      if (!this.title) {
        this.$notification.warn({ message: "请输入标签名" });
      } else if (
        this.title === this.pickedTag.title &&
        this.color === this.pickedTag.color
      ) {
        console.log("标签没有任何变化");
      } else {
        this.$store.dispatch("updateTag", {
          id: this.pickedTag.id,
          title: this.title,
          color: this.color
        });
      }
    },
    handleCancle() {
      this.visible = false;
      this.$emit("input", false);
    }
  }
};
</script>

<style scoped>
.title-input {
  width: 100%;
  color: #fff;
  text-align: center;
}

.title-input:hover {
  border-color: var(--border-color);
}
.title-input:focus {
  border-color: var(--border-color);
  box-shadow: var(--box-shadow);
}

.title-input::placeholder {
  color: #ffffff80;
}
</style>
