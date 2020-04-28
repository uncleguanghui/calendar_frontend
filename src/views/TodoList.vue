<template>
  <div class="page">
    <a-row type="flex" justify="space-around">
      <a-col :span="4">
        <SiderMenu />
      </a-col>
      <a-col :span="10">
        <TodoList />
      </a-col>
      <a-col :span="10">
        <Task />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import SiderMenu from "@/components/TodoList/SiderMenu";
import TodoList from "@/components/TodoList/TodoList";
import Task from "@/components/TodoList/Task";

export default {
  data() {
    return {};
  },
  components: { SiderMenu, TodoList, Task }
};
</script>

<style scoped></style>
