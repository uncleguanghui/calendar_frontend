<template>
  <div class="page">
    <a-collapse
      defaultActiveKey="1"
      :bordered="false"
      :style="{ backgroundColor: '#fff' }"
    >
      <a-collapse-panel :key="item.title" v-for="item in data">
        <div slot="header">
          <span>{{ item.title }}</span>
          <span :style="{ float: 'right' }">{{ item.data.length }}</span>
        </div>
        <a-checkbox-group>
          <a-row
            :style="{ maxHeight: '50px' }"
            :key="plan.id"
            v-for="plan in item.data"
          >
            <a-checkbox>
              <div :style="{ verticalAlign: 'text-top', display: 'contents' }">
                <span class="box-title">{{ plan.title }}</span>
                <span
                  v-if="selectedDetailKey === 'show'"
                  class="box-description"
                >
                  {{ plan.description }}
                </span>
              </div>
            </a-checkbox>
          </a-row>
        </a-checkbox-group>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
export default {
  props: {
    // 排序对象
    selectedSortKey: {
      require: true
    },
    // 详情选择情况
    selectedDetailKey: {
      require: true
    },
    // 已完成选择情况
    data: {
      require: true
    }
  },
  data() {
    return {};
  },
  components: {},
  computed: {},
  beforeMount() {},
  mounted() {},
  methods: {},
  watch: {}
};
</script>

<style scoped></style>
