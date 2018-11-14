<template>
  <div class="servant-list-page">
    <search-bar :searchObj="searchObj" @search="onSearch">
      <template slot="before-add">
        <van-collapse-item title="显示" name="add_1">
          
            <van-switch-cell v-model="isCard" :title="mode" size="20px" />
            <van-switch-cell v-model="isDesc" :title="desc" size="20px" />
          
        </van-collapse-item>
      </template>
    </search-bar>
    <div class="servant-list">

      <servant-list-item v-for="item in list" :key="item.id" :data="item" :isCard="isCard" :order="setOrder(item.id)" :showOptions="selectOptions" @show="nothing = false"></servant-list-item>

      <div class="nothing" v-if="nothing"></div>
    </div>
    <div class="tab">
      <div :class="['tab-li',{'active': item.select.toString() == currentClass.toString()}]" v-for="(item, index) in classes" :key="index" @click="setCurrentClass(item.select)" :style="'width:'+ (100/classes.length).toFixed(2)+'%'">{{item.text}}</div>
    </div>

  </div>

</template>

<script>
import { mapState } from 'vuex';

import ServantListItem from './../components/ServantListItem';
import SearchBar from './../components/SearchBar';
export default {
  name: 'servantList',
  data() {
    return {
      isCard: true,
      isDesc: true,
      classes: [
        {
          text: 'ALL',
          select: /.*/
        },
        {
          text: '剑',
          select: /saber/i
        },
        {
          text: '弓',
          select: /archer/i
        },
        {
          text: '枪',
          select: /lancer/i
        },
        {
          text: '骑',
          select: /rider/i
        },
        {
          text: '术',
          select: /caster/i
        },
        {
          text: '杀',
          select: /assassin/i
        },
        {
          text: '狂',
          select: /berserker/i
        },
        {
          text: '特殊',
          select: /^((?!saber|archer|lancer|rider|caster|assassin|berserker).)+$/i
        }
      ],
      currentClass: /.*/,
      nothing: false,
      searchObj: [
        {
          title: '稀有度',
          key: 'rarity',
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
              },
              {
                title: '0星',
                name: 0,
                'select-color': '#0d0d0d'
              }
            ]
          ]
        },
        {
          title: '宝具',
          key: 'treasure',
          match_keys: ['addition'],
          lists: [
            [
              {
                name: 'Buster',
                'select-color': '#790b0b'
              },
              {
                name: 'Arts',
                'select-color': '#15419a'
              },
              {
                name: 'Quick',
                'select-color': '#21790b'
              }
            ],
            ['群体', '单体', '辅助']
          ]
        },
        {
          title: '阵营&性别',
          key: 'party_sex',
          match_keys: ['addition'],
          lists: [
            ['天', '地', '人', '星', '兽'],
            ['秩序', '混沌', '中立'],
            ['善', '恶', '中庸', '夏', '狂', '花嫁'],
            ['男性', '女性', '？']
          ]
        },
        {
          title: '特性',
          key: 'r_addition',
          match_keys: ['addition'],
          match_type: 'or',
          lists: [
            [
              '骑乘',
              '人型',
              '从者（不被EA克制）',
              '半从者',
              '拟似从者',
              '龙',
              '亚瑟',
              'Saber脸',
              '王',
              '罗马',
              '所爱之人',
              '神性',
              '魔性',
              '猛兽',
              '希腊神话系男性'
            ]
          ]
        },
        {
          key: 'search',
          match_keys: [
            'cv',
            'illust',
            'name',
            'name_en',
            'name_jp',
            'origin',
            'region',
            'sex'
          ],
          match_mode: 'like'
        }
      ],
      rarity: null,
      search: null,
      r_addition: null,
      party_sex: null,
      treasure: null
    };
  },
  components: {
    ServantListItem,
    SearchBar
  },
  computed: {
    ...mapState('servant', ['list']),
    mode() {
      return this.isCard ? '头像' : '列表';
    },
    desc() {
      return this.isDesc ? '倒序' : '顺序';
    },
    selectOptions() {
      let output = {
        class: { querys: [this.currentClass] }
      };
      if (this.search) output.search = this.search;
      if (this.rarity) output.rarity = this.rarity;
      if (this.r_addition) output.r_addition = this.r_addition;
      if (this.party_sex) output.party_sex = this.party_sex;
      if (this.treasure) output.party_sex = this.treasure;

      return output;
    }
  },
  watch: {
    selectOptions() {
      this.nothing = true;
    }
  },

  methods: {
    setOrder(val) {
      val = val * 1;
      if (this.isDesc) val = this.list.length - val;
      return val;
    },

    setCurrentClass(select) {
      this.currentClass = select;
    },
    onSearch(res) {
      let { rarity, treasure, party_sex, r_addition, search } = res;
      this.rarity = rarity;
      this.treasure = treasure;
      this.party_sex = party_sex;
      this.r_addition = r_addition;
      this.search = search;
    }
  },
  
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    next(vm => {
      vm.$store.commit('setShowTitle', false);
      vm.$setTitle('英灵列表');
    });
  }
  /* created() {},
  activated() {
    this.$store.commit('setShowTitle', false);
  } */
};
</script>


<style scoped lang='scss'>
.servant-list-page {
}
.servant-list {
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  padding: 44px 0 42px;
  .nothing {
    width: 100%;
    height: calc(100vh - 86px);
    background: url('./../assets/nothing.jpg') center/auto 100% no-repeat;
    position: relative;
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
}
.btn-menu {
  font-size: 1.4em;
  width: 1.2em;
  height: 1.2em;

  display: flex;
  margin-right: 0.4rem;

  justify-content: center;
  align-items: center;
  border-radius: 0.2em;
  opacity: 0.8;
}
.tab {
  position: fixed;
  bottom: 0;
  left: 0;
  flex-shrink: 0;
  width: 100%;
  background: white;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid var(--border-color);
  .tab-li {
    text-align: center;
    line-height: 3;
  }
  .active {
    color: #fab70d;
  }
}
.controllers {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  flex-shrink: 0;
  z-index: 10;
  background: var(--border-color);
  .form {
    display: flex;
    align-items: center;
  }
  .van-search {
    flex-grow: 1;
  }
  &-hr {
    width: 100%;
    flex-shrink: 0;
    height: 1px;
    margin: 0 0 0 0.6em;
    background: var(--border-color);
  }
}
.radio-group {
  display: flex;
  height: 2.4em;
  padding: 0.2em 0.8em;
  color: var(--info-color);
}
.van-radio {
  margin-right: 1em;
  line-height: 1;
  display: flex;
  align-items: center;
}
</style>