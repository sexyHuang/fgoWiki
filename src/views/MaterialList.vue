<template>
  <div>
    <van-tabs
      v-model="active"
      swipeable
      sticky
      :offset-top="offsetTop"
    >
      <van-tab
        v-for="(item,index) in tabs"
        :title="item.title"
        :key="index"
        class=""
      >
        <van-cell v-if="!index">
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
              <van-field
                class="qb-input"
                :value="material_map[1000]||0"
                type="tel"
                maxlength="10"
                @input="changeHandler(1000,$event)"
              />
              <span>【{{material_map[1000]||0|formateNumber}}】</span>
            </div>

          </div>
        </van-cell>
        <van-cell
          v-for="(_item,index) in tab_lists[item.type]"
          :key="index"
          :to="`/materialDetail/${_item.id}`"
          center
        >
          <div slot="title">
            <img
              :src="base+_item.imgPath"
              alt=""
              class="material-item__avatar"
            >
            <span class="material-item__name">
              {{_item.name}}
            </span>
          </div>

          <van-stepper
            @click.native.stop
            integer
            :min="0"
            :max="9999"
            :value="material_map[_item.id]||0"
            @change="changeHandler(_item.id,$event)"
          ></van-stepper>
        </van-cell>
      </van-tab>
      <!--  <van-tab title="上传素材">
        <van-button
          type="primary"
          @click="setAll"
        >SET ALL</van-button>
      </van-tab> -->
    </van-tabs>
  </div>
</template>

<script>
import MaterialApi from './../api/imp/MaterialApi';
import { BASE_URL } from '@/conf/image';
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'materialList',
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    next(async vm => {
      //vm.$store.commit('setShowTitle', false);
      vm.$setTitle('素材列表');
      vm.list = await MaterialApi.list();
      vm.$store.commit('material/setList', vm.list);
    });
  },
  data() {
    return {
      active: 0,
      list: [],
      base: BASE_URL,
      tabs: [
        {
          title: '素材',
          type: 2
        },
        {
          title: '技能石',
          type: 1
        },
        {
          title: '棋子',
          type: 3
        }
      ],
      showKeyboard: false
    };
  },
  computed: {
    tab_lists() {
      let output = {};
      this.list.map(val => {
        if (!output[val.type]) output[val.type] = [];
        output[val.type].push(val);
      });
      return output;
    },
    offsetTop() {
      return this.$store.state.system.isWeixin
        ? 0
        : 0 | (((window.innerWidth * 37.5) / 375) * 1.2267);
    },
    ...mapState('userData', ['material_map'])
  },

  methods: {
    focusHandler() {
      this.$toast.success('focus');
    },
    changeHandler(materialID, count) {
      count *= 1;
      this.addMaterialSetting({ materialID, count });
    },
    setAll() {
      let count = 200;
      this.list.map(({ id }) =>
        this.addMaterialSetting({ materialID: id, count })
      );
    },
    ...mapMutations('userData', ['addMaterialSetting'])
  }
};
</script>

<style scoped lang="scss">
.material-item {
  &__avatar {
    width: 3.6em;
    height: 3.96em;
  }
  &__name {
    font-size: 1em;
  }
}
.qb-input {
  padding: 0 0.4em;
  color: var(--info-color);
  &:after {
    left: 0.2em;
  }
}
</style>