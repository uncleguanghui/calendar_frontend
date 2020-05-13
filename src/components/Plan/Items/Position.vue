<template>
  <div>
    <span>地址：{{ position }}</span>
  </div>
</template>

<script>
export default {
  props: {
    value: String
  },
  data() {
    return {
      position: this.value
    };
  },
  methods: {},
  watch: {
    value(to) {
      this.position = to;
    }
  }
};
</script>

<style scoped></style>
