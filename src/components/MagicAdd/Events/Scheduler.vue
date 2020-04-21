<template>
  <a-modal
    centered
    :destroyOnClose="false"
    title="创建一个日程"
    okText="确定"
    width="400px"
    cancelText="取消"
    @ok="handleCreate"
    @cancel="handleCancel"
    :visible="visible"
  >
    <!-- 标题 -->
    <a-form :form="form">
      <a-form-item label="标题" v-bind="formItemLayout">
        <a-input
          v-decorator="[
            'title',
            {
              rules: [{ required: true, message: '请输入标题' }]
            }
          ]"
        />
      </a-form-item>
      <!-- 日历本 -->
      <a-form-item label="日历本" v-bind="formItemLayout">
        <a-select
          v-decorator="[
            'book',
            {
              rules: [{ required: true, message: '请选择日历本' }],
              initialValue: initialBook
            }
          ]"
        >
          <template v-for="item in $store.state.books">
            <a-select-option :value="item.bookId" :key="item.bookId">
              {{ item.title }}
            </a-select-option>
          </template>
        </a-select>
      </a-form-item>
      <a-divider dashed />
      <!-- 全天 -->
      <a-form-item label="全天日程">
        <a-switch
          v-decorator="[
            'allDay',
            { initialChecked: false, valuePropName: 'checked' }
          ]"
        />
      </a-form-item>
      <!-- 开始时间 -->
      <a-form-item label="开始时间">
        <a-date-picker
          v-decorator="['start']"
          :disabledDate="disabledStartDate"
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          @change="setStartDate"
          @openChange="handleStartOpenChange"
        />
      </a-form-item>
      <!-- 结束时间 -->
      <a-form-item label="结束时间">
        <a-date-picker
          v-decorator="['end']"
          :disabledDate="disabledEndDate"
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          @change="setEndDate"
          :open="endOpen"
          @openChange="handleEndOpenChange"
        />
      </a-form-item>
      <!-- 重复 -->
      <a-form-item label="重复" v-bind="formItemLayout">
        <a-input v-decorator="['repeat']" />
      </a-form-item>
      <a-divider dashed />
      <!-- 地点 -->
      <a-form-item label="地点" v-bind="formItemLayout">
        <a-input v-decorator="['location']" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  props: {
    visible: {
      required: true,
      default: false
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      initialBook: this.$store.state.books.length
        ? this.$store.state.books[0].bookId
        : "",
      startValue: null,
      endValue: null,
      endOpen: false
    };
  },
  methods: {
    handleCreate() {
      const form = this.form;
      form.validateFields(err => {
        if (err) {
          this.$message.warning("请填写完整参数");
          return;
        }
        this.$notification.success({ message: "创建成功" });
        form.resetFields();
        this.handleCancel();
      });
    },
    handleCancel() {
      this.$emit("update:visible", false);
    },
    disabledStartDate(startValue) {
      const endValue = this.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    setStartDate(e) {
      this.startValue = e;
    },
    setEndDate(e) {
      this.endValue = e;
    }
  }
};
</script>

<style scoped></style>
