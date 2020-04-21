<template>
  <div class="page">
    <a-row type="flex" justify="space-around">
      <a-col :span="6">
        <books
          :style="{
            background: '#00bcbc',
            margin: '5px',
            minHeight: '200px'
          }"
        />
        <weather
          :style="{
            background: '#00bcbc',
            margin: '5px',
            minHeight: '200px'
          }"
        />
        <information-flow
          :style="{
            background: '#00bcbc',
            margin: '5px',
            minHeight: '200px'
          }"
        />
      </a-col>
      <a-col :span="12">
        <calendar
          :style="{
            background: '#fff',
            border: '1px solid #d9d9d9',
            margin: '5px',
            minHeight: '400px'
          }"
        />
      </a-col>
      <a-col :span="6">
        <MagicAdd
          :style="{
            margin: '15px',
            width: '50%',
            height: '50px'
          }"
        />
        <scheduler
          :style="{
            background: '#00bcbc',
            margin: '5px',
            minHeight: '500px'
          }"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Books from "@/components/Books/Books";
import MagicAdd from "@/components/MagicAdd/MagicAdd";
import InformationFlow from "@/components/InformationFlow/InformationFlow";
import Calendar from "@/components/Calendar/Calendar";
import Scheduler from "@/components/Scheduler/Scheduler";
import Weather from "@/components/Weather/Weather";

export default {
  data() {
    return {};
  },
  components: { Books, InformationFlow, Calendar, Scheduler, Weather, MagicAdd }
};
</script>

<style scoped>
.hide {
  display: none;
}
</style>
