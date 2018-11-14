<template>
  <div>
    <search-bar :searchObj="searchObj" @search="onSearch"></search-bar>
    <van-list v-model="loading" :finished="finished" @load="onLoad" class="list">
      <router-link :to="'/craftEssenceInfo/'+item.id" v-for="(item, index) in show_list" :key="item.imgPath+'?imageMogr2/interlace/1'" class="list-item__card" v-lazy:background-image="base+item.imgPath">
        <van-loading type="spinner" class="loading" />
      </router-link>

    </van-list>
    <div class="nothing" v-if="!show_list.length"></div>
  </div>
</template>

<script>
import SearchBar from './../components/SearchBar';
import { BASE_URL } from './../conf/image';
import { mapState } from 'vuex';
export default {
  name: 'craftEssenceList',
  components: {
    SearchBar
  },
  data() {
    return {
      show_list: [],
      finished: false,
      page: 1,
      loading: false,
      base: BASE_URL
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
      this.page = 1;
      this._loadData(res);
    },
    onLoad() {
      this.page += 1;
      this._loadData();
      this.loading = false;
    },
    _loadData(searchObj) {
      let _obj = this.$store.getters['craftessence/getList']({
        searchObj,
        page: this.page
      });
      this.show_list = _obj.list;
      this.finished = _obj.finished;
    }
  },
  created() {
    this._loadData();
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
.nothing {
  width: 100%;
  height: calc(100vh - 44px);
  background: url('./../assets/nothing.jpg') center/auto 100% no-repeat;
  position: absolute;
  top: 44px;
  &::before {
    position: absolute;
    width: 168px;
    height: 168px;
    padding-top: 16%;
    top: -10px;
    box-sizing: border-box;
    text-align: center;
    font-size: 16px;
    content: '';
    color: var(--info-color);
    background: url('./../assets/dialog.png') center/100% no-repeat;
  }
}
.list {
  display: flex;
  flex-wrap: wrap;
  padding: 50px 5px 10px;

  &-item {
    &__card {
      font-size: 63px;
      width: 1em;
      height: 1.1em;
      overflow: hidden;
      margin: 5px;
      background: center/100% no-repeat;
      display: flex;
      align-items: center;
      justify-content: center;
      .loading {
        display: none;
      }
      &[lazy='loading'] {
        background-color: #eee;
        border-radius: 0.1em;
        .loading {
          display: block;
        }
      }
    }
  }
}
</style>