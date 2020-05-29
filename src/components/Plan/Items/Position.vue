<template>
  <a-auto-complete
    size="small"
    v-model="position"
    :data-source="addressList"
    class="position-input"
    placeholder="输入地址"
    @search="onSearch"
    @change="emitInput"
  />
</template>

<script>
let AMap = undefined;
try {
  AMap = require("AMap");
} catch (error) {
  console.error(error);
}

// import AMap from "AMap";
import lodash from "lodash";

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
    // 防抖地向后台提交数据更新
    emitInput: lodash.debounce(function() {
      console.log("防抖5秒，更新地址数据");
      this.$emit("input", this.position);
    }, 5000),
    // 处理高德返回的结果
    searchCallback(status, result) {
      this.addressList =
        status === "complete" ? result.tips.map(i => i.district + i.name) : [];
    },
    // 搜索地址
    onSearch(searchText) {
      this.autoComplete.search(searchText, this.searchCallback);
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
    width: 300px;
    border: none;
    padding: 0;
  }

  /deep/ input:focus {
    box-shadow: none;
    border: none;
    border-color: none;
    border-radius: none;
    background: #fff0;
  }
}

.position-input:focus {
  border: none;
  box-shadow: none;
}
</style>
