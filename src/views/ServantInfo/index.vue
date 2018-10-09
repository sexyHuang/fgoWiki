<template>
  <div class="servant-info">
    <div class="servant-info-header">
      <img class="servant-info-avatar" :src="pics.icon" @click="showPreview(previewPics)"/>
      <div class="servant-info-base">
        <div class="servant-info-base_row">{{atk}}</div>
        <div class="servant-info-base_row">{{hp}}</div>
      </div>
    </div>
    <van-tabs v-model="active" swipeable>
      <van-tab v-for="(item,index) in tabs" :title="item.title" :key="index">
        <component :is="item.tabName" :data="item.data">

        </component>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import ServantApi from './../../api/imp/ServantApi';
import { getServantImages } from './../../conf/image';
import { upperFirst } from 'lodash';
import previewImage from './../../mixins/previewImage';
//let _not_goBack = false;
export default {
  mixins: [previewImage],
  name: 'servantInfo',
  components: {
    TabCraftEssence: () => import('./components/TabCraftEssence.vue'),
    TabSkill: () => import('./components/TabSkill.vue'),
    TabTreasures: () => import('./components/TabTreasures.vue')
  },
  data() {
    return {
      info: {},
      active: 0,
      tabsList: {
        skill: {
          title: '技能'
        },
        treasures: {
          title: '宝具'
        },
        craftEssence: {
          title: '礼装'
        }
      }
    };
  },
  computed: {
    pics() {
      return getServantImages(this.info.id);
    },
    atk() {
      return `ATK：${this.info.maxAtk}`;
    },
    hp() {
      return `HP：${this.info.maxHp}`;
    },
    previewPics() {
      let keys = ['A', 'B', 'C', 'D', 'fool'];
      let output = [];
      for (let _key of Object.keys(this.pics)) {
        if (keys.includes(_key)) output.push(this.pics[_key]);
      }
      return output;
    },
    tabs() {
      let _keys = Object.keys(this.tabsList);
      let _output = [];
      for (let _key of _keys) {
        if (this.info[_key]) {
          let _data = this.info[_key];
          if (_key === 'skill') {
            _data = { skill: _data, passiveSkill: this.info.passiveSkill };
          }
          _output.push({
            tabName: `Tab${upperFirst(_key)}`,
            title: this.tabsList[_key].title,
            data: _data
          });
        }
      }
      return _output;
    }
  },
  /*  async created() {
    this.info = await ServantApi.info(this.$route.params.ID);
    document.querySelector('title').innerHTML = this.info.name;
  }, */
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    next(async vm => {
      vm.info = await ServantApi.info(vm.$route.params.ID);

      vm.$setTitle(vm.info.name);
    });
  },
  mounted() {
    document.body.scrollTop = 0;
  }
  /*  methods: {
    showPreview(picList) {
      this.$router.push({
        query: {
          open: 1
        }
      });
      this.instance = ImagePreview({
        images: picList,
        startPosition: 0,
        onClose: () => {
          if (!_not_goBack) this.$router.go(-1);
          else _not_goBack = false;
        }
      });
    }
  },
  watch: {
    $route: {
      deep: true,
      handler(val) {
        _not_goBack = false;
        if (!val.query.open) {
          _not_goBack = true;
          try {
            this.instance.close();
          } catch (e) {}
        }
      }
    }
  } */
};
</script>
<style lang="scss">
.van-tabs {
  background: white;
  padding-left: 10px;
  padding-right: 10px;

  &__wrap {
    border: 1px solid var(--border-color);
  }
}
</style>

<style scoped lang="scss">
.servant-info {
  &-header {
    display: flex;
    align-items: flex-start;
    padding: 10px;
    background: linear-gradient(white ,var(--border-color));
  }
  &-avatar {
    width: 80px;
  }
  &-base {
    padding: 4px 0 4px 8px;
  }
}
</style>