<template>
    <div>

    </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    need_columns() {
      if (this.data.length <= 0) return [];
      let output = {};
      this.data.map(val => {
        let key = this.formateState(val.state);
        if (!output[key]) output[key] = [];
        output[key].push(val);
      });
      return output.entries();
    }
  },
  methods: {
    formateState(state) {
      let states = '' + state;
      if (state[0] == 1) {
        return `灵基${state[1]}`;
      } else if (state[0] == 2) return `技能${state[1]}-${state[1] * 1 + 1}`;
    }
  }
};
</script>

<style scoped>
</style>