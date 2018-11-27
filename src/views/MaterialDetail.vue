<template>
  <div>
    <van-tabs v-model="active" swipeable sticky :offset-top="offsetTop">
      <van-tab title="英灵">
        <van-cell>
          <span slot="title" class="servant-item__subInfo">
            合计:{{totals.total}}/再临:{{totals.break}}/技能:{{totals.skill}}<template v-if="totals.cloth">/灵衣:{{totals.cloth}}</template>
          </span>
        </van-cell>
        <van-cell v-for="(_item,index) in servant_needs" :key="index" :to="`/servantInfo/${_item.servantId}`" class="servant-item" is-link>
          <div slot="title" class="servant-item_title">
            <img :src="base+_item.imgPath" alt="" class="servant-item__avatar">
            <div class="servant-item_infos">
              <span class="servant-item__name">
                {{_item.name}}
              </span>
              <span class="servant-item__subInfo">
                合计:{{_item.total}}/再临:{{_item.break}}/技能:{{_item.skill}}
                <template v-if="_item.cloth">/灵衣:{{_item.cloth}}</template>
              </span>
            </div>

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
  name: 'materialDatail',
  beforeRouteEnter(to, from, next) {
    // ...
    next(async vm => {
      vm.servant_needs = await MaterialApi.needs(to.params.ID);
      vm.$setTitle(
        vm.$store.getters['material/getItemById'](to.params.ID).name
      );
    });
  },
  data() {
    return {
      servant_needs: [],
      active: 0,
      base: BASE_URL
    };
  },
  computed: {
    offsetTop() {
      return this.$store.state.system.isWeixin
        ? 0
        : 0 | (((window.innerWidth * 37.5) / 375) * 1.2267);
    },
    totals() {
      return this.servant_needs.reduce((prev, curr) => {
        return {
          total: (prev.total || 0) + curr.total,
          break: (prev.break || 0) + curr.break,
          skill: (prev.skill || 0) + curr.skill,
          cloth: (prev.cloth || 0) + curr.cloth
        };
      }, {});
    }
  }
};
</script>

<style scoped lang="scss">
.servant-item {
  align-items: center;
  &_title {
    display: flex;
  }
  &_infos {
    padding-left: 0.4em;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  &__avatar {
    width: 3.6em;
    height: 3.96em;
  }
  &__name {
    font-size: 1.2em;
  }
  &__subInfo {
    font-size: 0.9em;
    color: var(--muted-color);
  }
}
</style>