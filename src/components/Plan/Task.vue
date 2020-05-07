<template>
  <div class="task-page" v-if="task.id">
    <!-- 标题 -->
    <div class="task-header">
      <a-checkbox />
      <span class="task-header-label">{{ task.title }}</span>
      <!-- 右上角功能区 -->
      <div :style="{ float: 'right', marginTop: '12px' }">
        <a-tooltip
          :title="task && !task.star ? '收藏' : '取消收藏'"
          trigger="hover"
          placement="bottom"
        >
          <a-avatar
            shape="square"
            :src="task && !task.star ? starImage : unstarImage"
            :size="18"
            :style="{ marginRight: '15px' }"
          />
        </a-tooltip>
      </div>
    </div>
    <!-- 任务标签 -->
    <div class="task-tags">
      标签：
      <a-tag v-for="tag in task.tags" :key="tag">
        {{ tag }}
      </a-tag>
    </div>
    <!-- 任务时间 -->
    <div class="task-time">
      时间：
      <p>
        {{ task.allDay }}
      </p>
      <p>
        {{ task.start }}
      </p>
      <p>
        {{ task.end }}
      </p>
    </div>
    <!-- 提醒 -->
    <div class="task-alarm">
      提醒：
      {{ task.alarmStrategy }}
    </div>
    <!-- 地点 -->
    <div class="task-position">
      地点：
      {{ task.position }}
    </div>
    <!-- 子任务 -->
    <div class="task-sub-task">
      子任务：
    </div>
    <!-- 描述 -->
    <div class="task-description">
      描述：
      {{ task.description }}
    </div>
  </div>
  <div v-else-if="planNum > 0" class="task-empty">
    <img :src="emptyImage" alt="" class="task-empty-image" />
    <div class="task-empty-title">点击标题查看详情</div>
  </div>
</template>

<script>
export default {
  data() {
    const publicPath = process.env.BASE_URL;

    return {
      publicPath: publicPath, // public 文件夹的位置
      starImage: publicPath + "icons/" + "收藏.png",
      unstarImage: publicPath + "icons/" + "未收藏.png",
      emptyImage: publicPath + "images/" + "Knowledge.svg"
    };
  },
  computed: {
    task() {
      // 返回被点击的、且在当前路径下也存在的任务
      // 如果任务在别的路径下也有，则在点击别的路径时，继续保留任务。
      const data = this.$store.state.groupPlanData[
        this.$router.currentRoute.path
      ];
      const plans = [
        ...(data.finished || []),
        ...(data.expired || []),
        ...(data.going || [])
      ];
      const results =
        plans.filter(obj => obj.id == this.$store.state.planId) || [];
      return results.length ? results[0] : {};
    },
    planNum() {
      // 当前页面的任务数量
      const data =
        this.$store.state.groupPlanData[this.$router.currentRoute.path] || {};
      const num =
        (data.finished || []).length +
        (data.expired || []).length +
        (data.going || []).length;
      return num;
    }
  }
};
</script>

<style scoped>
.task-page {
  text-align: left;
  padding: 15px;
}

.task-header-label {
  font-weight: bold;
  font-size: 20px;
  padding: 0 10px;
}

.task-empty {
  position: absolute;
  transform: translate(0, -80%);
  top: 50%;
}

.task-empty-image {
  width: 80%;
}

.task-empty-title {
  color: #767879;
  padding-top: 20px;
}
</style>
