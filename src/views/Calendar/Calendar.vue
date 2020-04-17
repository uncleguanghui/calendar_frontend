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
            background: '#00bcbc',
            margin: '5px',
            minHeight: '400px'
          }"
        />
      </a-col>
      <a-col :span="6">
        <weather
          :style="{
            background: '#00bcbc',
            margin: '5px',
            minHeight: '200px'
          }"
        />
        <scheduler
          :style="{
            background: '#00bcbc',
            margin: '5px',
            minHeight: '200px'
          }"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Books from "@/components/Books/Books";
import InformationFlow from "@/components/InformationFlow/InformationFlow";
import Calendar from "@/components/Calendar/Calendar";
import Scheduler from "@/components/Scheduler/Scheduler";
import Weather from "@/components/Weather/Weather";

export default {
  data() {
    return {};
  },
  components: { Books, InformationFlow, Calendar, Scheduler, Weather }
};
</script>

<style scoped></style>
