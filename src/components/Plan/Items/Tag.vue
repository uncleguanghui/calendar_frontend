<template>
  <div>
    <!-- 当前标签 -->
    <a-tag
      v-for="tg in [...value].sort(tagSort)"
      :key="tg.key"
      :color="tg.color"
    >
      {{ tg.title }}
    </a-tag>
    <!-- 标签管理 -->
    <a-dropdown :trigger="['click']" v-model="tagDropdownVisible">
      <!-- 添加标签 -->
      <a-tag style="background: #fff; borderStyle: dashed; transition: none">
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
          <div class="tag-row" @click="e => handleDivClick(e, tag)">
            <div class="tag-title">
              <a-tag
                :color="
                  showPickerId === tag.id ? pickColor || tag.color : tag.color
                "
                style="transition: none"
              >
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
                :style="{
                  background:
                    showPickerId === tag.id ? pickColor || tag.color : tag.color
                }"
              ></div>
              <!-- 标签的选中状态 -->
              <div class="check-status">
                <a-icon
                  type="check"
                  v-if="choosenIdList.indexOf(tag.id) > -1"
                />
              </div>
            </div>
          </div>
          <!-- 取色器 -->
          <div
            v-if="showPickerId === tag.id"
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
    value: Array
  },
  computed: {
    // 下拉列表中要渲染的标签
    renderTags() {
      return this.tagsAll.filter(t =>
        this.tagInput.length
          ? t.title.toLowerCase().indexOf(this.tagInput.toLowerCase()) > -1
          : true
      );
    },
    // 该用户的所有标签
    tagsAll() {
      return [...this.$store.state.planTags].sort(this.tagSort);
    }
  },
  data() {
    return {
      tagInput: "", // 标签 input 的输入值
      newTagTitle: "", // 新创建的标签名称（用于展示 new 这几个字）
      choosenIdList: [], // 当前选中的标签ID列表
      showPickerId: "", // 要展开取色器的标签ID
      pickColor: "", // 当前选中的颜色
      tagDropdownVisible: false // 标签下拉框是否可见
    };
  },
  watch: {
    // 每当传入的当前标签变化时，重置状态
    value() {
      this.tagDropdownVisible = false;
    },
    // 每当下拉框重新出现的时候，重置状态
    tagDropdownVisible(to) {
      if (to) {
        this.tagInput = "";
        this.newTagTitle = "";
        this.showPickerId = "";
        this.pickColor = "";
        this.choosenIdList = [...this.value].map(i => i.id);
      }
    }
  },
  methods: {
    // 标签排序，且将与输入相同的放在最前面
    tagSort(a, b) {
      return a.title.localeCompare(b.title);
    },
    // 创建标签
    createTag() {
      this.$store.dispatch("createTag", this.tagInput);
      // 记录上一次的输入值，并清除本次输入值
      this.newTagTitle = this.tagInput;
      this.tagInput = "";
    },
    // 标签行的点击事件
    handleDivClick(e, tag) {
      if (e.target.className === "color-square") {
        // 打开或关闭取色器
        if (this.showPickerId === tag.id) {
          this.closeColorPicker(tag);
        } else {
          this.showPickerId = tag.id;
        }
      } else {
        // 更新标签的选中状态
        let index = this.choosenIdList.indexOf(tag.id);
        if (index > -1) {
          this.choosenIdList.splice(index, 1);
        } else {
          this.choosenIdList.push(tag.id);
        }
      }
    },
    handleUpdateTags() {
      this.tagDropdownVisible = false;
      this.$emit(
        "input",
        this.tagsAll.filter(i => this.choosenIdList.indexOf(i.id) > -1)
      );
    },
    // 更新颜色（该操作会变得非常频繁，因此只更新本地的颜色，并不更新到 Vuex 和后端）
    updateColor({ hex8 }, tag) {
      this.showPickerId = tag.id;
      this.pickColor = hex8;
    },
    // 隐藏取色器，并保存颜色
    closeColorPicker(tag) {
      if (tag.color != this.pickColor) {
        // 当当前状态是打开时，在关闭前，保存一下颜色
        let newTag = {
          id: tag.id,
          title: tag.title,
          color: this.pickColor
        };
        this.$store.dispatch("updateTag", newTag);
      }
      this.showPickerId = "";
      this.pickColor = "";
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
