<template>
    <div class="my-rate">
        <div :class="['my-rate__item',{selected: index + 1 <= value}]" v-for="(item, index) in list" :key="index" @click="onSelect(index)"></div>
    </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    readonly: Boolean,
    disabled: Boolean,
    count: {
      type: Number,
      default: 5
    }
  },
  methods: {
    onSelect(index) {
      if (!this.disabled && !this.readonly) {
        this.$emit('input', index + 1);
        this.$emit('change', index + 1);
      }
    }
  },
  computed: {
    list() {
      return [...Array(this.count).keys()];
    }
  }
};
</script>

<style lang="scss">
.my-rate {
  display: flex;
  &__item {
    margin: 0 1px;
    width: 1.2em;
    height: 1.2em;
    background: url('./../assets/star.png') center/100% no-repeat;
    filter: grayscale(100%);
    &.selected {
        filter: none;
    }
  }
}
</style>