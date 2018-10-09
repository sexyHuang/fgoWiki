<template>
  <div class="servant-list-page">

    <van-popup v-model="show" position="top">
      <van-collapse v-model="activeName">
        <van-collapse-item title="显示" name="1">
          <van-cell-group>
            <van-switch-cell v-model="isCard" :title="mode" size="20px" />
            <van-switch-cell v-model="isDesc" :title="desc" size="20px" />
          </van-cell-group>
        </van-collapse-item>
        <van-collapse-item title="稀有度" name="2">
          <van-checkbox-group v-model="rarity">
            <van-checkbox v-for="item in rarityList" :key="item.name" :name="item.name" :style="'--select-color:'+ item['select-color']">
              {{ item.title }}
            </van-checkbox>
          </van-checkbox-group>
        </van-collapse-item>
        <van-collapse-item title="宝具" name="3">

          <template v-for="(item, index) in treasure_list">
            <van-checkbox-group v-model="treasure[index]" :key="index">
              <van-checkbox :name="_item" :key="_item" v-for="(_item, _idx) in item" :style="index===0?'--select-color:'+ cardColor[_idx]:''">
                {{ _item }}
              </van-checkbox>
            </van-checkbox-group>
            <div class="controllers-hr" v-if="index+1<treasure_list.length" :key="index"> </div>
          </template>

        </van-collapse-item>
        <van-collapse-item title="阵营&性别" name="4">
          <template v-for="(item, index) in party_sex_list">
            <van-checkbox-group v-model="party_sex[index]" :key="index">
              <van-checkbox :name="_item" :key="_item" v-for="_item in item">
                {{ _item }}
              </van-checkbox>
            </van-checkbox-group>
            <div class="controllers-hr" v-if="index+1<party_sex_list.length" :key="index"> </div>
          </template>
        </van-collapse-item>
        <van-collapse-item title="特性" name="5">
          <van-radio-group v-model="addition_search_type" class="radio-group">
            <van-radio name="or">任意匹配</van-radio>
            <van-radio name="and">同时匹配</van-radio>
          </van-radio-group>
          <van-checkbox-group v-model="r_addition">
            <van-checkbox :name="_item" :key="_item" v-for="_item in additions">
              {{ _item }}
            </van-checkbox>
          </van-checkbox-group>

        </van-collapse-item>
      </van-collapse>
      <van-button type="primary" block @click="onSearch_2">确定</van-button>
    </van-popup>
    <div class="controllers">
      <form action="/" class="form">
        <van-search v-model="sreachValue" placeholder="请输入搜索关键词" @search="onSearch" background="transparent" />
        <div class="btn-menu" @click="openMenu">
          <van-icon name="wap-nav" />
        </div>
      </form>

    </div>
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
export default {
  name: 'servantList',
  data() {
    return {
      isCard: true,
      isDesc: true,
      show: false,
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
      sreachValue: '',
      sreach: '',
      activeName: ['0'],
      rarityList: [
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
      ],
      additions: [
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
      ],
      addition_search_type: 'or',
      treasure_list: [['Buster', 'Arts', 'Quick'], ['群体', '单体', '辅助']],
      party_sex_list: [
        ['天', '地', '人', '星', '兽'],
        ['秩序', '混沌', '中立'],
        ['善', '恶', '中庸', '夏', '狂', '花嫁'],
        ['男性', '女性', '？']
      ],

      rarity: [],
      party_sex: new Array(4).fill([]),
      treasure: new Array(2).fill([]),
      r_addition: [],
      addition: [],
      Rarity: '',
      nothing: false,
      cardColor: ['#790b0b', '#15419a', '#21790b']
    };
  },
  components: {
    ServantListItem
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
        class: this.currentClass
      };
      if (this.sreach) output.sreach = this.sreach;
      if (this.Rarity) output.rarity = this.Rarity;
      if (this.addition.length > 0) output.addition = this.addition;
      return output;
    }
  },
  watch: {
    sreachValue(val) {
      if (val === '') {
        this.sreach = '';
      }
    },
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
    openMenu() {
      this.show = true;
    },
    setCurrentClass(select) {
      this.currentClass = select;
    },
    onSearch() {
      this.sreach = this.sreachValue;
    },
    onSearch_2() {
      let {
        rarity,
        treasure,
        party_sex,
        r_addition,
        addition_search_type
      } = this;
      let _r = rarity.join('|'),
        _t = treasure.map(val => val.join('|')).filter(val => val),
        _p = party_sex.map(val => val.join('|')).filter(val => val);
      this.Rarity = _r ? new RegExp(_r) : '';
      this.addition = [];
      if (_t.join('')) this.addition = [...this.addition, ..._t];
      if (_p.join('')) this.addition = [...this.addition, ..._p];
      if (r_addition.length > 0) {
        switch (addition_search_type) {
          case 'or': {
            this.addition = [...this.addition, r_addition.join('|')];
            break;
          }
          case 'and': {
            this.addition = [...this.addition, ...r_addition];
            break;
          }
        }
      }
      this.show = false;
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
  },
  /* created() {},
  activated() {
    this.$store.commit('setShowTitle', false);
  } */
};
</script>
<style lang="scss">
.van-collapse-item__content {
  padding: 0 0 0 0.4rem;
}
.van-hairline--top-bottom::after {
  border-width: 0;
}
.van-checkbox-group {
  display: flex;
  flex-wrap: wrap;
}
.van-checkbox {
  margin: 0.4em 0.6em;

  .van-checkbox__icon {
    display: none;
  }
  .van-checkbox__label {
    margin: 0;
    display: flex;
    height: 1.6em;
    line-height: 1;
    align-items: center;
    padding: 0 0.5em;
    border: 1px solid var(--border-color);
    color: var(--info-color);
    border-radius: 0.2em;
  }
  .van-checkbox__icon--checked + .van-checkbox__label {
    border-color: var(--select-color);
    background: var(--select-color);
    color: white;
  }
}
</style>

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