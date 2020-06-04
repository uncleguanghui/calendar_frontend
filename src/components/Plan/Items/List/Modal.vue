<template>
  <a-modal
    centered
    destroyOnClose
    :maskClosable="false"
    :title="mode === 'create' ? '创建清单' : '编辑清单'"
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
      v-model="listId"
      placeholder="请选择清单"
    >
      <a-select-option :value="list.id" :key="list.id" v-for="list in listsAll">
        <div>
          <div
            :style="{
              borderLeft: '4px solid ' + list.color,
              paddingLeft: '10px',
              display: 'inline-block'
            }"
          >
            {{ list.title }}
          </div>
          <div style="float: right; padding: 0 10px 0 20px">
            <a-icon v-if="list.hide" type="eye-invisible" />
            <a-icon v-else type="eye" />
          </div>
        </div>
      </a-select-option>
    </a-select>
    <div v-if="mode === 'create' || (mode === 'edit' && listId)">
      <a-form>
        <a-form-item label="名称" v-bind="formItemLayout">
          <a-input
            style="width:100%"
            placeholder="请输入清单名称"
            v-model="title"
          />
        </a-form-item>
        <a-form-item label="颜色" v-bind="formItemLayout">
          <color-list v-model="color" />
        </a-form-item>
        <a-form-item label="隐藏" v-bind="formItemLayout">
          <a-switch v-model="hide" />
          <p style="line-height: 1.5;color: #a9a9a9;font-size: 10px;">
            启用后，该清单中的任务将不会显示在除了“我的收藏”以外的系统清单中，不过到期的任务仍然会提醒。
          </p>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script>
import ColorList from "../Tag/ColorList";

export default {
  components: { ColorList },
  props: {
    value: {
      // 是否可见
      type: Boolean,
      default: false
    },
    mode: {
      // Modal 模式 —— 创建清单 or 编辑清单
      type: String,
      default: "create",
      validator: function(value) {
        return value === "create" || value === "edit";
      }
    }
  },
  data() {
    return {
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      },
      visible: this.value,
      title: "",
      color: "#03a9f4", // 创建清单时选中的颜色
      hide: false, // 创建清单时的隐藏选项
      listId: undefined // 编辑清单时选中的清单ID
    };
  },
  watch: {
    value(to) {
      this.visible = to;
      if (to) {
        this.reset();
      }
    },
    // 新选中清单时，重置当前的标题和颜色
    pickedList(to) {
      if (to) {
        console.log("当前选中清单为", to);
        this.title = to.title;
        this.color = to.color;
        this.hide = to.hide;
      }
    }
  },
  computed: {
    // 该用户的所有清单
    listsAll() {
      return [...this.$store.state.planLists].sort(this.objSort);
    },
    // 当前选中的清单
    pickedList() {
      return this.listsAll[this.listsAll.map(i => i.id).indexOf(this.listId)];
    }
  },
  methods: {
    objSort(a, b) {
      return a.title.localeCompare(b.title);
    },
    // 重置
    reset() {
      this.title = "";
      this.color = "#03a9f4";
      this.hide = false;
      this.listId = undefined;
    },
    // 点击确定
    handleOk() {
      if (this.mode === "create") {
        this.createList();
      } else {
        this.updateList();
      }
      this.handleCancle();
    },
    // 创建清单
    createList() {
      if (!this.title) {
        this.$notification.warn({ message: "请输入清单名" });
      } else {
        this.$store.dispatch("createList", {
          title: this.title,
          hide: this.hide,
          color: this.color
        });
      }
    },
    // 更新清单
    updateList() {
      if (!this.title) {
        this.$notification.warn({ message: "请输入清单名" });
      } else if (
        this.title === this.pickedList.title &&
        this.color === this.pickedList.color &&
        this.hide === this.pickedList.hide
      ) {
        console.log("清单没有任何变化");
      } else {
        this.$store.dispatch("updateList", {
          id: this.pickedList.id,
          title: this.title,
          color: this.color,
          hide: this.hide
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

<style scoped></style>
