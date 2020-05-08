<template>
  <div class="page">
    <illustration />
  </div>
</template>

<script>
import Illustration from "@/components/Illustration/Illustration";

export default {
  data() {
    return {
      focusDate: new Date()
    };
  },
  components: { Illustration }
};
</script>

<style scoped></style>
