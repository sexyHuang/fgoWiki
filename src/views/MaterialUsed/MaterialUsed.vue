<template>
  <div class="material-used">
    <van-cell>
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
          class="l-flex-fd--column l-flex-jc--space-around"
          style="padding-left: 0.5 em"
        >
          <span class="qb-count">{{groupUpData.qp.count}}</span>
          <span>【{{groupUpData.qp.count||0|formateNumber}}】</span>
        </div>

      </div>
    </van-cell>
    <div
      class="material-group"
      v-for="(group,index) in groupUpData.materialGroups"
      :key="index"
    >
      <div
        class="material-item"
        v-for="item of group"
        :style="(base + item.imgPath)|bgImage"
        @click="showUsedDetailTable(item.materialId)"
        :key="item.materialId"
      >
        <span class="material-item-text">{{item.count}}</span>
      </div>
    </div>
    <van-popup
      v-model="popup_showed"
      @touchmove.native.stop
    >
      <detail-table :data="selectedMaterialData" />
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { BASE_URL } from '@/library/conf/image';

import DetailTable from './components/DetailTable';
export default {
  components: {
    DetailTable
  },
  name: 'materialUsed',
  data() {
    return {
      base: BASE_URL,
      popup_showed: false,
      clicked_material_id: 0
    };
  },
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    next(vm => {
      //vm.$store.commit('setShowTitle', false);
      vm.$setTitle('素材消耗详情');
    });
  },
  computed: {
    ...mapState('userData', ['servant_map']),
    caledData() {
      return Object.entries(this.servant_map).reduce(
        (prev, [servantID, curr]) => {
          let { material_arr } = curr;
          if (!material_arr) return prev;

          material_arr.map(val => {
            let { count, materialId, state, name, type, imgPath } = val;
            if (type == 0) {
              if (prev[val.materialId]) prev[val.materialId].count += count;
              else
                prev[val.materialId] = {
                  count,
                  materialId,
                  name,
                  type,
                  imgPath
                };
            } else if (prev[val.materialId]) {
              prev[val.materialId].count += count;
              prev[val.materialId].state[servantID] = state.slice();
            } else {
              prev[val.materialId] = {
                count,
                materialId,
                name,
                type,
                imgPath,
                state: {
                  [servantID]: state.slice()
                }
              };
            }
          });

          return prev;
        },
        {}
      );
    },
    groupUpData() {
      return Object.entries(this.caledData).reduce(
        (prev, [materialId, data]) => {
          if (materialId == 1000) {
            prev.qp = data;
          } else if (materialId < 2000) {
            prev.materialGroups[1].push(data);
          } else if (materialId < 4000) prev.materialGroups[0].push(data);
          else {
            prev.materialGroups[2].push(data);
          }
          return prev;
        },
        {
          qp: {},
          materialGroups: [[], [], []]
        }
      );
    },
    selectedMaterialData() {
      return this.caledData[this.clicked_material_id];
    }
  },
  methods: {
    showUsedDetailTable(materialID) {
      this.clicked_material_id = materialID;
      this.popup_showed = true;
    }
  }
};
</script>

<style scoped lang="scss">
.material {
  &-group {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
  &-item {
    position: relative;
    background: center/100% no-repeat;
    width: 64px;
    margin: 5.5px;
    height: 70px;
    &__avatar {
      width: 3.6em;
      height: 3.96em;
    }
    &-text {
      position: absolute;
      bottom: 2px;
      right: 4px;
      font-weight: bold;
      color: white;
      -webkit-text-stroke: 0.4px black;
      text-shadow: 1px 1px 1px black;
    }
  }
}
.qb-count {
  border-bottom: 1px solid var(--info-color);
  margin-left: 0.2em;
  padding-left: 0.4em;
}
.van-popup {
  border-radius: 0.5em;
  &.show-title {
    height: calc(100% - 46px);
    top: calc(50% + 23px);
  }
}
</style>