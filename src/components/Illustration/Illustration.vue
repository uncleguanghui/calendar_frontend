<template>
  <div>
    <keep-alive>
      <a-card>
        <a-card-grid
          style="width:25%;text-align:center"
          v-for="image in files"
          :key="image"
        >
          <img :src="image" alt="" class="card-image" />
          <div :style="{ paddingTop: '20px' }">
            {{
              image
                .split("/")
                .pop()
                .split(".")[0]
            }}
          </div>
        </a-card-grid>
      </a-card>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "",
  props: [""],
  data() {
    const publicPath = process.env.BASE_URL;
    const files = require
      .context("../../../public/illustrations", false, /.(png|svg)$/)
      .keys()
      .map(obj => publicPath + "illustrations/" + obj)
      .slice(0, 100);
    console.log(files);
    return {
      files: files
    };
  },
  components: {},
  computed: {},
  beforeMount() {},
  mounted() {},
  methods: {},
  watch: {}
};
</script>

<style scoped>
.card-image {
  max-height: 100px;
}
</style>
