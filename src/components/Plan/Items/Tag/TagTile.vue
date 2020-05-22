<template>
  <!-- 平铺标签 -->
  <div>
    <!-- 当前标签 -->
    <a-tag
      v-for="tg in [...value].sort(tagSort)"
      :key="tg.key"
      :color="tg.color"
    >
      {{ tg.title }}
    </a-tag>
    <a-dropdown :trigger="['click']" v-model="visible">
      <a-tag class="tag-add"> <a-icon type="plus" /> 添加标签 </a-tag>
      <!-- 标签下拉框 slot -->
      <div slot="overlay" class="tags-dropdown" style="width:300px">
        <div style="padding: 0 0 10px 0">
          <a-input-search placeholder="请输入标签进行查找" v-model="title" />
        </div>
        <!-- 当没有找到一模一样的标签时，创建标签 -->
        <div
          v-if="title && tagsAll.filter(t => t.title === title).length === 0"
        >
          <!-- 平铺颜色 -->
          <div style="display:inline-block;">
            <tag-color-list v-model="createColor" />
          </div>
          <!-- 标签提示 -->
          <div class="tag-create" @click="createTag">
            <a-icon type="tag" style="padding-right: 5px" />
            创建标签
            <a-tag :color="createColor">{{ title }}</a-tag>
          </div>
        </div>
        <!-- 标签垂直列表 -->
        <tag-pick-list
          v-model="choosenIdList"
          :tags="renderTags"
          :newTitle="newTitle"
        />
        <div style="padding-top: 10px; text-align: right">
          <a-button style="margin-right: 5px" @click="visible = false">
            取消
          </a-button>
          <a-button type="primary" @click="handleUpdateTags">
            确定
          </a-button>
        </div>
      </div>
    </a-dropdown>
  </div>
</template>

<script>
import TagPickList from "./PickList";
import TagColorList from "./ColorList";

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    } // 已选中的标签
  },
  data() {
    return {
      newTitle: "",
      visible: false,
      title: "",
      createColor: "#03a9f4", // 创建标签时选中的颜色
      choosenIdList: [...this.value].map(i => i.id) // 当前选中的标签ID列表
    };
  },
  components: {
    TagPickList,
    TagColorList
  },
  computed: {
    // 该用户的所有标签
    tagsAll() {
      return [...this.$store.state.planTags].sort(this.tagSort);
    },
    // 要渲染的标签
    renderTags() {
      return this.tagsAll.filter(t =>
        this.title.length
          ? t.title.toLowerCase().indexOf(this.title.toLowerCase()) > -1
          : true
      );
    }
  },
  methods: {
    reset() {
      // 记录上一次的输入值，并清除本次输入值
      this.newTitle = this.title;
      this.title = "";
      this.createColor = "#03a9f4";
    },
    // 标签排序，且将与输入相同的放在最前面
    tagSort(a, b) {
      return a.title.localeCompare(b.title);
    },
    // 更新标签
    handleUpdateTags() {
      this.visible = false;
      let oldIds = [...this.value]
        .map(i => i.id)
        .sort()
        .toString();
      let newIds = [...this.choosenIdList].sort().toString();
      if (oldIds !== newIds) {
        this.$emit(
          "input",
          this.tagsAll.filter(i => this.choosenIdList.indexOf(i.id) > -1)
        );
      } else {
        console.log("3 标签没有任何变化");
      }
    },
    // 创建标签
    createTag() {
      this.$store.dispatch("createTag", {
        title: this.title,
        color: this.createColor
      });
      this.reset();
    }
  },
  watch: {
    // 每当传入的当前标签变化时，重置状态
    value() {
      this.visible = false;
    },
    // 每当下拉框重新出现的时候，重置状态
    visible(to) {
      if (to) {
        this.reset();
        this.choosenIdList = this.value.map(i => i.id);
      }
    }
  }
};
</script>

<style scoped>
.tags-dropdown {
  background-color: #fff;
  padding: 10px;
  box-shadow: 1px 1px 5px 3px #d8d8d8;
  border-radius: 5px;
}

.tag-add {
  background: #fff;
  border-style: dashed;
  transition: none;
  cursor: pointer;
}

.tag-create {
  padding: 5px;
  border: 1px solid #cecece;
  border-radius: 4px;
  width: 100%;
  text-align: center;
  margin: 10px 0;
  cursor: pointer;
}
.tag-create:hover {
  background-color: #188fff47;
  border: 1px solid #188fff47;
}
</style>
