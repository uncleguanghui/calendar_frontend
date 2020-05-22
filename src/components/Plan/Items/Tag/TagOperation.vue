<template>
  <div>
    <tag-modal v-model="modalVisible" :mode="mode" />
    <a-dropdown :trigger="['click']" v-model="dropdownVisible">
      <a-icon
        :type="iconType"
        @click.stop="dropdownVisible = !dropdownVisible"
      />
      <a-menu slot="overlay" @click="handleOpenModal">
        <a-menu-item key="create">
          <a-icon type="plus" /> 创建标签
        </a-menu-item>
        <a-menu-item key="edit"> <a-icon type="edit" /> 编辑标签 </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import TagModal from "./Modal";
export default {
  props: {
    iconType: {
      type: String,
      default: "setting"
    }
  },
  data() {
    return {
      dropdownVisible: false,
      modalVisible: false,
      mode: "create" // Modal模式 —— create  or edit
    };
  },
  components: { TagModal },
  methods: {
    handleOpenModal({ key }) {
      this.dropdownVisible = false;
      this.mode = key;
      this.modalVisible = !this.modalVisible;
    }
  },
  watch: {}
};
</script>

<style scoped></style>
