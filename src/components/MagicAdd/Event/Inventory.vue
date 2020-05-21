<template>
  <a-modal
    centered
    :destroyOnClose="false"
    :maskClosable="false"
    title="清单"
    okText="确定"
    width="500px"
    cancelText="取消"
    @ok="handleCreate"
    @cancel="handleCancel"
    :visible="value"
  >
    <a-form :form="form">
      <a-form-item label="标题" v-bind="formItemLayout">
        <a-input
          autocomplete="off"
          v-decorator="['title']"
          placeholder="请简单描述此清单的用途，如 购物清单"
          style="width:100%"
        >
        </a-input>
      </a-form-item>
      <a-form-item label="清单列表" v-bind="formItemLayout">
        <plan-sub-tasks
          v-model="subTasks"
          :emptyText="'点击添加清单，回车创建更多'"
          style="line-height:2; padding: 5px 10px; border: 1px solid #e8e8e8; border-radius: 4px;"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import PlanSubTasks from "@/components/Plan/Items/SubTasks";

export default {
  components: { PlanSubTasks },
  props: {
    value: Boolean
  },
  computed: {},
  data() {
    return {
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      subTasks: [] // 清单
    };
  },
  methods: {
    handleCreate() {
      const form = this.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        console.log("计划参数：", values);
        this.handleCancel();
      });
    },
    handleCancel() {
      this.$emit("input", false);
    }
  }
};
</script>

<style scoped>
.time-string {
  font-size: 8px;
  color: #8e8e8e;
  border: 1px solid #8e8e8e;
  border-radius: 4px;
  padding: 4px;
}
</style>
