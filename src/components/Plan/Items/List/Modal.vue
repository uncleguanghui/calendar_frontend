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
        <div
          :style="{
            borderLeft: '1px solid ' + list.color,
            display: 'inline-block'
          }"
        >
          {{ list.title }}
        </div>
      </a-select-option>
    </a-select>
    <div v-if="mode === 'create' || (mode === 'edit' && listId)">
      <div style="width: 100%; text-align: center;">
        <a-input
          class="title-input"
          placeholder="请输入清单名称"
          v-model="title"
          :style="{
            background: color,
            '--border-color': color + '80',
            '--box-shadow': '0 0 0 2px ' + color + '20'
          }"
        />
      </div>
      <div style="padding: 20px 0 10px 0; display: inline-block">
        <color-list v-model="color" />
      </div>
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
      visible: this.value,
      title: "",
      color: "#03a9f4", // 创建清单时选中的颜色
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
        this.color === this.pickedList.color
      ) {
        console.log("清单没有任何变化");
      } else {
        this.$store.dispatch("updateList", {
          id: this.pickedList.id,
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
