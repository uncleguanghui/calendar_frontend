<template>
  <div class="page">
    <a-row type="flex" justify="space-around">
      <a-col :span="16">
        <Header :date.sync="focusDate" />
        <calendar :date.sync="focusDate" />
      </a-col>
      <a-col :span="6">
        <weather :date.sync="focusDate" />
        <information-flow />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import InformationFlow from "@/components/InformationFlow/InformationFlow";
import Calendar from "@/components/Calendar/Calendar";
import Header from "@/components/Calendar/Header";
import Weather from "@/components/Weather/Weather";

export default {
  data() {
    return {
      focusDate: new Date()
    };
  },
  components: { InformationFlow, Calendar, Weather, Header }
};
</script>

<style scoped></style>
