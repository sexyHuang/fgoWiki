<template>
  <div v-if="!text">

    <template v-for="(item, index) in new Array(rows).fill(1)">
      <div
        :key="index"
        style="width: 100%; padding: 0 10%;"
      >
        <span class="fake-text">
          {{index}}
        </span>
      </div>

    </template>

  </div>
  <div
    v-else
    v-html="text"
  >

  </div>

</template>

<script>
export default {
  props: {
    rows: {
      type: Number,
      default: 1
    },
    text: {
      type: String | Number,
      default: ''
    }
  }
};
</script>

<style scoped>
.fake-text {
  color: #ccc;
  background: #ccc;
  display: inline-block;
  width: 100%;
  height: 1em;
  line-height: 1em;
}
</style>