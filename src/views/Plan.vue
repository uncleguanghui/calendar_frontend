<template>
  <div class="page">
    <a-row type="flex" justify="space-around">
      <a-col :span="12">
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
