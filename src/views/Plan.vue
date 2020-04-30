<template>
  <div class="page">
    <a-row type="flex" justify="space-around">
      <a-col
        :span="12"
        :style="{
          borderRight: '1px solid #e8e8e8',
          height: 'calc(100vh - 64px)'
        }"
      >
        <plan />
      </a-col>
      <a-col :span="12">
        <Task />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Plan from "@/components/Plan/Plan";
import Task from "@/components/Plan/Task";

export default {
  data() {
    return {};
  },
  components: { Plan, Task }
};
</script>

<style scoped></style>
