<template>
  <div>
    <div
      v-for="color in colors"
      :key="color"
      class="color-circle"
      :style="{
        backgroundColor: color,
        boxShadow: pickedColor === color ? `0 0 1px 4px ${color}70` : 'none'
      }"
      @click="() => handleClick(color)"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: "#03a9f4"
    } // 要创建的颜色，默认为蓝色
  },
  data() {
    return {
      pickedColor: this.value,
      colors: [
        "#f44336",
        "#e91e63",
        "#9c27b0",
        "#673ab7",
        "#3f51b5",
        "#03a9f4",

        "#00bcd4",
        "#009688",
        "#4caf50",
        "#8bc34a",
        "#cddc39",
        "#ffeb3b",

        "#ffc107",
        "#ff9800",
        "#ff5722",
        "#795548",
        "#9e9e9e",
        "#607d8b"
      ]
    };
  },
  watch: {
    value(to) {
      this.pickedColor = to;
    }
  },
  methods: {
    // 修改颜色
    handleClick(color) {
      this.pickedColor = this.pickedColor === color ? "" : color;
      this.$emit("input", this.pickedColor);
    }
  }
};
</script>

<style scoped>
.color-circle {
  width: 20px;
  height: 20px;
  float: left;
  display: -webkit-inline-box;
  border-radius: 50%;
  margin: 5px;
  vertical-align: middle;
  cursor: pointer;
}
</style>
