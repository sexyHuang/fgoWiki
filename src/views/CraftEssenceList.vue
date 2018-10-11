<template>
  <div>
    <search-bar :searchObj="searchObj" @search="onSearch"></search-bar>

  </div>
</template>

<script>
import SearchBar from './../components/SearchBar';
import { mapState } from 'vuex';
export default {
  name: 'craftEssenceList',
  components: {
    SearchBar
  },
  data() {
    return {
      show_list: [],
      page: 1
    };
  },
  computed: {
    ...mapState('craftessence', ['list', 'attrs', 'types']),
    searchObj() {
      return [
        {
          title: '稀有度',
          key: 'star',
          lists: [
            [
              {
                title: '5星',
                name: 5,
                'select-color': '#f3bd07'
              },
              {
                title: '4星',
                name: 4,
                'select-color': '#f3bd07'
              },
              {
                title: '3星',
                name: 3,
                'select-color': '#b1b1b1'
              },
              {
                title: '2星',
                name: 2,
                'select-color': '#6f6259'
              },
              {
                title: '1星',
                name: 1,
                'select-color': '#6f6259'
              }
            ]
          ]
        },
        {
          title: '类型',
          key: 'types',
          match_keys: ['attr'],
          lists: [this.types]
        },
        {
          title: '特性',
          match_keys: ['attr'],
          key: 'attrs',
          match_type: 'or',
          lists: [this.attrs]
        },
        {
          key: 'search',
          match_keys: ['illust', 'name', 'nameJp'],
          match_mode: 'like'
        }
      ];
    }
  },
  methods: {
    onSearch(res) {
      this.show_list = this.$store.getters['craftessence/getList']({
        searchObj: res,
        page: this.page
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    next(vm => {
      vm.$store.commit('setShowTitle', false);
      vm.$setTitle('礼装列表');
    });
  }
};
</script>

<style scoped lang='scss'>
</style>