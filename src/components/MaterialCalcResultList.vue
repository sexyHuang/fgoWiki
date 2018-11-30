<template>
  <div
    @touchmove.stop
    class="material-list"
  >
    <van-cell
      v-for="item in data"
      :key="item.materialId"
      center
      class="material-item"
    >
      <template v-if="item.materialId === 1000">
        <div
          slot="title"
          class="l-flex "
        >
          <img
            :src="base+'fgo/Material/qb.png'"
            alt=""
            class="material-item__avatar"
          >
          <div
            class="l-flex-fd--column l-flex-jc--center"
            style="padding-left: 0.5 em"
          >
            <span>{{item.count}}[{{item.count|formateNumber}}]</span>
            <span :class="['material-item__sub',{error: lacks[item.materialId]}]">
              <template v-if="lacks[item.materialId]">
                缺{{lacks[item.materialId]}}({{lacks[item.materialId]|formateNumber}})
              </template>
              <template v-else>
                拥有{{material_map[item.materialId]}}({{material_map[item.materialId]|formateNumber}})
              </template>
            </span>
          </div>
        </div>
      </template>
      <template v-else>
        <div
          slot="title"
          class="l-flex"
          style="padding-right: 1.4em;"
        >
          <img
            :src="base+item.imgPath"
            alt=""
            class="material-item__avatar"
          >
          <div
            class="l-flex-fd--column l-flex-jc--center"
            style="padding-left: 0.5 em"
          >
            <span class="material-item__name">
              {{item.name}}*{{item.count}}
            </span>
            <span class="material-item__sub">
              {{item.state|formateState}}
            </span>
          </div>

        </div>
        <span :class="['material-item__sub',{error: lacks[item.materialId]}]">
          {{ lacks[item.materialId]?`缺${lacks[item.materialId]}/`:''}}
          拥有{{material_map[item.materialId]||0}}

        </span>
      </template>

    </van-cell>

  </div>
</template>

<script>
import { BASE_URL } from './../conf/image';

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
    },
    lacks: {
      type: Object,
      default() {
        return {};
      }
    },
    material_map: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {},
  filters: {
    formateState(state) {
      const MAP = ['', '灵基', '技能', '灵衣'];
      return state.reduce((prev, [state, count, times]) => {
        let [name, lv] = ('' + state).split('');
        times = times > 1 ? `X${times}` : '';
        return [prev, `${MAP[name]}(${lv}):${count}${times}`]
          .join()
          .replace(/^,/, '');
      }, '');
    }
  }
};
</script>
<style scoped lang="scss">
.material-list {
  overflow: auto;
}
.material-item {
  line-height: 1.5;
  &__avatar {
    font-size: 3em;
    width: 1em;
    height: 1.1em;
    margin-right: 0.16em;
  }
  &__name {
    font-size: 1em;
  }
  &__sub {
    color: var(--muted-color);
    font-size: 0.8em;
  }
}
.error {
  color: var(--danger-color);
}
</style>