<template>
  <a-auto-complete
    size="small"
    :value="position"
    :data-source="addressList"
    class="position-input"
    placeholder=""
    @search="onSearch"
    @change="onChange"
    @blur="handleBlur"
  />
</template>

<script>
import AMap from "AMap";

export default {
  props: {
    value: String
  },
  watch: {
    value(to) {
      this.position = to;
      this.addressList = [];
    }
  },
  data: function() {
    return {
      hover: false, // 鼠标悬停
      position: this.value,
      addressList: [], //地址
      autoComplete: new AMap.Autocomplete({
        city: "全国" //city 限定城市，默认全国
      })
    };
  },
  methods: {
    // 处理高德返回的结果
    searchCallback(status, result) {
      console.log(result.tips);
      this.addressList =
        status === "complete" ? result.tips.map(i => i.district + i.name) : [];
    },
    // 搜索地址
    onSearch(searchText) {
      this.autoComplete.search(searchText, this.searchCallback);
    },
    // 设置地址值
    onChange(value) {
      this.position = value;
    },
    // 编辑完成
    handleBlur() {
      console.log("地址编辑完成");
      this.$emit("input", this.position);
    }
  }
};
</script>

<style lang="less" scoped>
.position-input {
  display: -webkit-inline-box;

  /deep/ * {
    background: none;
  }

  /deep/ input {
    color: #52c41a;
    width: 300px;
    border: none;
    padding: 0;
  }

  /deep/ input:focus {
    box-shadow: none;
    border: 1px solid;
    border-color: #40a9ff;
    border-radius: 3px;
  }
}
</style>
