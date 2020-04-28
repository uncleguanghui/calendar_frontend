<template>
  <div class="page">
    <a-row type="flex" justify="space-around">
      <a-col :span="16">
        <calendar />
      </a-col>
      <a-col :span="6">
        <weather />
        <information-flow />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import InformationFlow from "@/components/InformationFlow/InformationFlow";
import Calendar from "@/components/Calendar/Calendar";
import Weather from "@/components/Weather/Weather";

export default {
  data() {
    return {};
  },
  components: { InformationFlow, Calendar, Weather }
};
</script>

<style scoped></style>
