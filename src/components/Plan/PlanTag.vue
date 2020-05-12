<template>
  <div style="line-height: 2;">
    <!-- 当前标签 -->
    <a-tag
      v-for="tg in [...currentTags].sort(tagSort)"
      :key="tg.key"
      :color="tg.color"
    >
      {{ tg.title }}
    </a-tag>
    <!-- 标签管理 -->
    <a-dropdown :trigger="['click']" v-model="tagDropdownVisible">
      <!-- 添加标签 -->
      <a-tag style="background: #fff; borderStyle: dashed;">
        <a-icon type="plus" /> 添加标签
      </a-tag>
      <!-- 标签下拉框 slot -->
      <div slot="overlay" class="tags-dropdown" style="width:300px">
        <!-- 输入标签，以查找或者创建 -->
        <div style="padding: 0 0 10px 0">
          <a-input-search placeholder="请输入标签进行查找" v-model="tagInput" />
        </div>
        <!-- 创建标签 -->
        <div
          class="tag-create"
          v-if="
            tagInput && tagsAll.filter(t => t.title === tagInput).length === 0
          "
          @click="createTag"
        >
          <a-icon type="tag" style="padding-right: 5px" />
          创建标签
          <a-tag>{{ tagInput }}</a-tag>
        </div>
        <!-- 选择标签 -->
        <a-row v-for="tag in renderTags" :key="tag.id">
          <div class="tag-row" @click="e => updataTagChoosenStatus(e, tag)">
            <div class="tag-title">
              <a-tag :color="tag.color">
                {{ tag.title }}
              </a-tag>
              <!-- 新标签的符号 -->
              <i
                style="font-size: 8px; color: #ff6060"
                v-if="tag.title === newTagTitle"
              >
                New !!!
              </i>
            </div>
            <div class="tag-operation">
              <!-- 关联取色器 -->
              <div
                class="color-square"
                :style="{ background: tag.color }"
              ></div>
              <!-- 标签的选中状态 -->
              <div class="check-status">
                <a-icon type="check" v-if="tag.isChoosen" />
              </div>
            </div>
          </div>
          <div
            v-if="
              tagsAll.length &&
                tagsAll.filter(i => i.id === tag.id)[0].showPicker
            "
            style="max-width: 100%; padding: 10px;"
          >
            <div class="close-square">
              <a-icon
                type="close-square"
                @click="() => closeColorPicker(tag)"
              />
            </div>
            <chrome-picker
              :value="tag.color"
              style="width: 100%;"
              @input="e => updateColor(e, tag)"
            />
          </div>
        </a-row>
        <!-- 控制按钮 -->
        <div style="padding-top: 10px; text-align: right">
          <a-button
            style="margin-right: 5px"
            @click="tagDropdownVisible = false"
          >
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
import VueColor from "vue-color";

export default {
  components: {
    // "swatches-picker": VueColor.Swatches,
    // "slider-picker": VueColor.Slider,
    "chrome-picker": VueColor.Chrome
  },
  props: {
    currentTags: {
      require: true,
      type: Array
    },
    targetTags: {
      require: true,
      type: Array
    }
  },
  mounted() {
    // 第一次时获取最新标签
    this.getTags();
  },
  computed: {
    // 下拉列表中要渲染的标签
    renderTags() {
      return this.tagsAll.filter(t =>
        this.tagInput.length
          ? t.title.toLowerCase().indexOf(this.tagInput.toLowerCase()) > -1
          : true
      );
    }
  },
  data() {
    return {
      tagInput: "", // 标签 input 的输入值
      newTagTitle: "", // 新创建的标签名称（用于展示 new 这几个字）
      tagsAll: [], // 该用户的所有标签
      tagDropdownVisible: false // 标签下拉框是否可见
    };
  },
  watch: {
    // 每当传入的当前标签变化时，重置状态
    currentTags() {
      this.tagDropdownVisible = false;
    },
    // 每当下拉框重新出现的时候，重置状态
    tagDropdownVisible(to) {
      if (to) {
        this.reset();
      }
    }
  },
  methods: {
    // 标签排序，且将与输入相同的放在最前面
    // firstTitle 是排序在前的
    tagSort(a, b, firstTitle = "") {
      if (a.title === b.title) {
        return 0;
      } else if (a.title === firstTitle) {
        return -1;
      } else if (b.title === firstTitle) {
        return 1;
      } else {
        return a.title.localeCompare(b.title);
      }
    },
    reset() {
      console.log("重置");
      this.tagInput = "";
      this.newTagTitle = "";
      this.tagsAll = this.tagsAll.map(i => {
        i.showPicker = false; // 关闭取色器
        i.isChoosen = this.currentTags.filter(t => t.id === i.id).length === 1; // 更新选中状态
        return i;
      });
    },
    // 创建标签
    createTag() {
      this.$request({
        url: `/api/tags`,
        method: "post",
        data: {
          title: this.tagInput,
          color: "#40a9ff" // 默认蓝色
        }
      }).then(res => {
        // 更新标签
        this.tagsAll = res.data.sort(this.tagSort).map(i => {
          i.initColor = i.color; // 原始颜色
          i.showPicker = false; // 关闭取色器
          i.isChoosen =
            this.currentTags.filter(t => t.id === i.id).length === 1; // 更新选中状态
          return i;
        });
        this.$store.state.planTags = this.tagsAll;
        // 记录上一次的输入值，并清除本次输入值
        this.newTagTitle = this.tagInput;
        this.tagInput = "";
        console.log("创建一个新标签");
      });
    },
    // 获取所有标签
    getTags() {
      this.$request({
        url: `/api/tags`,
        method: "get"
      }).then(res => {
        this.tagsAll = res.data.sort(this.tagSort).map(i => {
          i.initColor = i.color; // 原始颜色
          i.showPicker = false; // 关闭取色器
          i.isChoosen =
            this.currentTags.filter(t => t.id === i.id).length === 1; // 更新选中状态
          return i;
        });
        this.$store.state.planTags = this.tagsAll;
        console.log("获取最新标签");
      });
    },
    // 更新标签
    updateTag(tag) {
      this.$request({
        url: `/api/tags/${tag.id}`,
        method: "put",
        data: {
          color: tag.color,
          title: tag.title
        }
      }).then(res => {
        // 更新列表里的数据
        let tags = [...this.$store.state.planTags];
        let targets = tags.filter(item => item.id === res.data.id);
        let target = targets.length === 1 ? targets[0] : undefined;

        if (target) {
          console.log("更新前", target);
          for (let key in res.data) {
            target[key] = res.data[key];
          }
          console.log("更新后", target);
        } else {
          console.log(`未找到目标计划: ${this.plan.id}`);
        }

        // 不重新排序，因为体验并不是特别好
        this.tagsAll = tags.map(i => {
          i.initColor = i.color; // 原始颜色
          i.showPicker = false; // 关闭取色器
          i.isChoosen =
            this.currentTags.filter(t => t.id === i.id).length === 1; // 更新选中状态
          return i;
        });
        this.$store.state.planTags = this.tagsAll;
        console.log("获取更新后的标签");
      });
    },
    // 打开取色器，或者更新某个标签的选中状态
    updataTagChoosenStatus(e, tag) {
      let tags = [...this.tagsAll];
      let targets = tags.filter(t => t.id === tag.id);
      let target = targets.length === 1 ? targets[0] : undefined;
      if (target) {
        if (e.target.className === "color-square") {
          // 关闭其他标签的取色器
          tags
            .filter(t => t.id !== tag.id)
            .map(i => {
              i.showPicker = false;
              return i;
            });
          // 当当前状态是打开时，在关闭前，保存一下颜色
          if (target.showPicker && target.color != target.initColor) {
            this.updateTag(target);
          }
          //  展开或关闭取色器
          target.showPicker = !target.showPicker;
        } else {
          target.isChoosen = !target.isChoosen; // 更新选中状态
        }
        this.tagsAll = tags;
      }
    },
    handleUpdateTags() {
      this.tagDropdownVisible = false;
      this.$emit("update:targetTags", [
        ...this.tagsAll.filter(i => i.isChoosen)
      ]);
    },
    // 更新颜色（该操作会变得非常频繁，因此只更新本地的颜色，并不更新到 Vuex 和后端）
    updateColor({ hex8 }, tag) {
      let tags = [...this.tagsAll];
      let targets = tags.filter(t => t.id === tag.id);
      let target = targets.length === 1 ? targets[0] : undefined;
      if (target) {
        target.color = hex8;
        this.tagsAll = tags;
      }
    },
    // 隐藏取色器，并保存颜色
    closeColorPicker(tag) {
      let tags = [...this.tagsAll];
      let targets = tags.filter(t => t.id === tag.id);
      let target = targets.length === 1 ? targets[0] : undefined;
      if (target) {
        target.showPicker = false;
        // 当颜色发生变化时，更新服务器颜色
        if (target.color != target.initColor) {
          this.updateTag(target);
        }
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

.tag-title {
  display: inline-block;
}

.tag-operation {
  /* display: inline-block; */
  float: right;
}

.tag-create {
  padding: 5px;
}
.tag-create:hover {
  background-color: #188fff47;
  border-radius: 3px;
}

.tag-row {
  padding: 2px 2px 3px 2px;
}
.tag-row:hover {
  background-color: #188fff47;
  border-radius: 3px;
}

.color-square {
  width: 20px;
  height: 20px;
  float: left;
  display: -webkit-inline-box;
  border-radius: 5px;
  vertical-align: middle;
  margin-top: 2px;
}

.close-square {
  float: right;
  position: relative;
  display: -webkit-inline-box;
  height: 0;
  z-index: 1;
  color: #fff;
  padding-right: 5px;
}

.check-status {
  min-width: 30px;
  display: -webkit-inline-box;
  padding-left: 10px;
  font-size: 12px;
  vertical-align: middle;
}
</style>
