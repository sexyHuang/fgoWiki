<template>
  <van-cell-group
    class="material-list"
    @touchmove.native.stop
    :border="false"
  >
    <van-cell
      v-for="(item, index) in data"
      :key="index"
      :title="item[0]|formateState"
    >
      <template v-for="(item, index) in item[1]">
        <img
          :src="base+item.imgPath"
          alt=""
          :key="index"
          class="material-icon"
        />*{{item.count|countFormate}}
      </template>

    </van-cell>
  </van-cell-group>
</template>

<script>
import { BASE_URL } from '@/library/conf/image';
export default {
  data() {
    return {
      base: BASE_URL
    };
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {},
  filters: {
    formateState(state) {
      let states = '' + state;
      if (states[0] == 1) {
        return `灵基${states[1]}`;
      } else if (states[0] == 2) return `技能${states[1]}-${states[1] * 1 + 1}`;
      else if (states[0] == 3) return '灵衣';
    },
    countFormate(val) {
      return val > 10000 ? (val / 10000).toFixed(0) + '万' : val;
    }
  }
};
</script>

<style scoped>
.material-list {
  width: 80vw;
  height: 60vh;
  overflow: auto;
}
.material-icon {
  width: 1.2em;
}
</style>
<style lang="scss">
.material-list {
  .van-cell__value {
    flex: none;
    flex-grow: 1;
  }
  .van-cell__title {
    flex: none;
  }
}
</style>
