<template>
  <div>
    <van-tabs v-model="active" swipeable sticky :offset-top="offsetTop">
      <van-tab v-for="(item,index) in tabs" :title="item.title" :key="index" class="">
        <van-cell v-for="(_item,index) in tab_lists[item.type]" :key="index" :to="`/materialDetail/${_item.id}`">
          <div slot="title">
            <img :src="base+_item.imgPath" alt="" class="material-item__avatar">
            <span class="material-item__name">
              {{_item.name}}
            </span>
          </div>
        </van-cell>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import MaterialApi from './../api/imp/MaterialApi';
import { BASE_URL } from '@/conf/image';
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
      ]
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
    }
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
    font-size: 1.2em;
  }
}
</style>