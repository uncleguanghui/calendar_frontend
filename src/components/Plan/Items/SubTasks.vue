<template>
  <div v-if="subTasks.length > 0">
    <a-row
      v-for="task in subTasks"
      :key="task.key"
      @mouseover.native="hoverKey = task.key"
      @mouseleave.native="hoverKey = undefined"
      style="position:relative"
    >
      <a-checkbox
        class="task-checkbox"
        :checked="task.status"
        @change="() => handleCheck(task.key)"
      />
      <a-textarea
        class="task-input"
        :style="{ color: task.status ? '#a9a9a9' : '#000' }"
        size="small"
        :value="task.title"
        :maxLength="50"
        :autoSize="{
          minRows: 1,
          maxRows: 3
        }"
        v-focus="{ focus: task.key === focusKey, location: focusLocation }"
        @change="e => handleChange(e, task.key)"
        @keydown.delete="e => handleDelete(e, task.key)"
        @keydown.enter="e => handleEnter(e, task.key)"
      />
      <span class="task-delete">
        <a-icon
          type="delete"
          v-if="hoverKey === task.key"
          @click="() => delteTask(task.key)"
        />
      </span>
    </a-row>
  </div>
  <div class="task-empty" v-else @click="handleCreate">
    {{ emptyText }}
  </div>
</template>

<script>
import lodash from "lodash";

let Mock = require("mockjs");

export default {
  // 自定义组件
  directives: {
    // 使得光标聚焦在指定位置
    focus: {
      inserted: function(el, binding) {
        if (binding.value.focus) {
          el.focus();
          el.setSelectionRange(binding.value.location, binding.value.location);
        } else {
          el.blur();
        }
      }
    }
  },
  props: {
    value: Array,
    emptyText: {
      type: String,
      default: "添加子任务"
    }
  },
  data() {
    return {
      focusKey: "", // 准备聚焦的任务（一次性）
      focusLocation: "", // 光标停留的位置（一次性）
      subTasks: this.sortTasks(this.value),
      hoverKey: undefined // 当前悬浮的任务
    };
  },
  watch: {
    value(to) {
      this.subTasks = this.sortTasks(to);
    }
  },
  methods: {
    // 防抖地向后台提交数据更新
    emitInput: lodash.debounce(function() {
      console.log("防抖5秒，更新子任务数据");
      this.$emit("input", this.subTasks);
    }, 5000),
    /*
    对任务列表进行重排序：
    * 未完成的在前面，按照 index 从小到大排
    * 已完成的在后面，按照 index 从小到大排
    */
    sortTasks(tasks) {
      let ts = [...tasks].sort((a, b) => a.index - b.index);
      return [...ts.filter(i => !i.status), ...ts.filter(i => i.status)];
    },
    /*
    鼠标事件-点击 checkbox：修改任务的状态，并重新排序
    */
    handleCheck(key) {
      let tasks = [...this.subTasks];
      let index = tasks.map(i => i.key).indexOf(key);
      let task = tasks[index];
      if (!task) {
        return;
      }
      task.status = !task.status;
      this.subTasks = this.sortTasks(tasks);
      this.emitInput();
    },
    /*
    键盘事件-删除键：
    1）如果光标在第一个字符的位置（即不选中任何内容）：
      * 找到上一个任务 B（物理意义上的上一个，不是序号的上一个）
      * 如果 B 存在
        * 把当前任务 A 的 title 加到上任务 B 的后面
        * 删除任务 A
        * index 比 A 大的所有任务的 index -= 1
        * 光标停留在 B 原来标题的后面
      * 如果 B 不存在
        * 执行删除任务函数
    */
    handleDelete(e, key) {
      let tasks = [...this.subTasks];
      let index = tasks.map(i => i.key).indexOf(key);
      let task = tasks[index];
      if (!task) {
        return;
      }
      if (e.target.selectionStart === 0 && e.target.selectionEnd === 0) {
        let lastTask = tasks[tasks.map(i => i.key).indexOf(key) - 1]; // 任务 B
        if (lastTask) {
          // 如果 B 存在
          let oldTitle = lastTask.title;
          let newTitle = oldTitle + task.title;

          // 标题过长时拒绝合并
          if (newTitle.length > 50) {
            this.$message.error("标题过长，无法合并任务");
            return;
          }
          let newTask = {
            title: newTitle, // 新任务的标题是 P2
            status: lastTask.status,
            index: lastTask.index,
            key: lastTask.key + "666"
          }; // 复制一个新任务 B
          tasks = [...tasks.filter(i => i.key !== lastTask.key), newTask]; // 删除任务 B，并加入新的 B （为了触发自定义组件的 focus）
          tasks = tasks.filter(i => i.key !== task.key); // 删除任务 A
          tasks = tasks.map(i => {
            if (i.index > task.index) {
              i.index -= 1;
            } // index 比 A 大的所有任务的 index -= 1
            return i;
          });
          this.subTasks = this.sortTasks(tasks);
          this.emitInput();

          e.returnValue = false; // 不返回值，即不触发 change
          e.target.blur(); // 让 input 失去焦点
          this.focusKey = newTask.key;
          this.focusLocation = oldTitle.length;
          console.log("删除事件场景1处理完毕");
        } else {
          if (task.title.length === 0) {
            this.delteTask(key);
          } else {
            console.log("当前任务还有内容，不执行任何操作");
          }
        }
      } else {
        console.log("其他删除事件");
      }
    },
    /*
    键盘事件-回车键：
    * 按光标位置分割当前任务 A 的标题为两部分 P1、P2（如果是选中状态，则 P1 和 P2 分别是选中内容的前面和后面部分）
    * 任务 A 的标题变成 P1
    * 创建一个新任务 B，新任务的标题是 P2，完成状态随任务 A，index 比任务 A 的要大 1
    * 任务 B 插入到任务 A 的后面
    * index 比 A 大的所有任务的 index += 1
    * 光标停留在任务 B 的第一位
    */
    handleEnter(e, key) {
      let tasks = [...this.subTasks];
      let index = tasks.map(i => i.key).indexOf(key);
      let task = tasks[index];
      if (!task) {
        return;
      }
      let title1 = task.title.slice(0, e.target.selectionStart);
      let title2 = task.title.slice(e.target.selectionEnd);
      task.title = title1; // 任务 A 的标题变成 P1
      let newTask = {
        title: title2, // 新任务的标题是 P2
        status: task.status, // 完成状态随任务 A
        index: task.index + 1, // ndex 比任务 A 的要大 1
        key: Mock.mock("@id")
      }; // 创建一个新任务 B
      tasks = tasks.map(i => {
        if (i.index > task.index) {
          i.index += 1;
        }
        return i;
      }); // index 比 A 大的所有任务的 index += 1
      tasks = [...tasks, newTask]; // 加入任务 B
      this.subTasks = this.sortTasks(tasks);
      this.emitInput();

      e.returnValue = false; // 不返回值，即不触发 change
      e.target.blur(); // 让 input 失去焦点
      this.focusKey = newTask.key; // 重新定义焦点元素
      this.focusLocation = 0;

      console.log("回车事件处理完毕");
    },
    // 子任务标题编辑完以后，更新子任务标题
    handleChange(e, key) {
      let tasks = [...this.subTasks];
      let index = tasks.map(i => i.key).indexOf(key);
      let task = tasks[index];
      if (!task) {
        return;
      }
      if (e.type === "change") {
        console.log("数据发生变动");
        this.emitInput();
      } else if (e.type === "input") {
        task.title = e.target.value;
        this.subTasks = this.sortTasks(tasks); // 还在编辑，就不推送了
        console.log("编辑事件处理完毕");
      }
    },
    // 从0开始新建子任务
    handleCreate() {
      let key = Mock.mock("@id");
      this.subTasks = [{ key: key, title: "", status: false, index: 0 }];

      this.focusKey = key;
      this.focusLocation = 0;
    },
    /* 
    删除任务
     * 找到下一个任务 C （物理意义上的下一个，不是序号的下一个）
     * 如果 C 存在
       * 光标停留在 C 的 0 位
     * 删除任务 A
     * index 比 A 大的所有任务的 index -= 1
     */
    delteTask(key) {
      let tasks = [...this.subTasks];
      let index = tasks.map(i => i.key).indexOf(key);
      let task = tasks[index];

      let nextTask = tasks[tasks.map(i => i.key).indexOf(key) + 1]; // 找到任务 C
      if (nextTask) {
        let newTask = {
          title: nextTask.title,
          status: nextTask.status,
          index: nextTask.index,
          key: nextTask.key + "666"
        }; // 复制一个新任务 C
        tasks = [...tasks.filter(i => i.key !== nextTask.key), newTask]; // 删除任务 C，并加入新的 C （为了触发自定义组件的 focus）
        this.focusKey = newTask.key;
        this.focusLocation = 0;
      }
      tasks = tasks.filter(i => i.key !== task.key); // 删除任务 A
      tasks = tasks.map(i => {
        if (i.index > task.index) {
          i.index -= 1;
        } // index 比 A 大的所有任务的 index -= 1
        return i;
      });
      this.subTasks = this.sortTasks(tasks);
      this.emitInput();
      console.log("删除事件场景2处理完毕");
    }
  }
};
</script>

<style lang="less" scoped>
.task-checkbox {
  top: 5px;
  position: absolute;

  /deep/ .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: #ececec;
  }

  /deep/ .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #ececec;
    border-color: #ececec;
  }
}

/* .ant-checkbox:hover .ant-checkbox-inner, */

.task-input,
.task-input:focus {
  display: -webkit-inline-box;
  width: calc(100% - 50px);
  border: none;
  border-bottom: 1px solid #e8e8e8;
  border-radius: 0;
  box-shadow: none;
  resize: none;
  padding: 0;
  line-height: 2;
  margin-bottom: 5px;
  transition: none; /* 去掉动画 */
  font-size: 10px;
  background: none;
  top: 5px;
  left: 26px;
}

.task-input:focus {
  background: #40a9ff24;
}

.task-delete {
  color: #c7c7c7;
  min-width: 20px;
  padding: 0 0 0 5px;
  top: 5px;
  position: absolute;
  right: 5px;
}

.task-empty {
  color: #bfbfbf;
}
.task-empty:hover {
  background-color: #40a9ff24;
}
</style>
