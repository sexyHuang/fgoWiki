<template>
  <div class="servant-info" @touchmove="scrollHandler" @touchend="touchEnd" @touchstart="touchStart">
    <div class="servant-info-header" :style="headerStyle">
      <img class="servant-info-avatar" :src="pics.icon" @click="showPreview(previewPics)" />
      <div class="servant-info-base">
        <div class="servant-info-base_row">{{atk}}</div>
        <div class="servant-info-base_row">{{hp}}</div>
        <div class="servant-info-base_row" style="align-self: flex-end;-webkit-align-self: flex-end;">
          <span>灵基：</span>
          <my-rate v-model="servantSetting.state" :count="4" />
          <div class="reset-btn" @click="servantSetting.state = 0">
            <van-icon name="reset" size="1.2em" color="#4b0"></van-icon>
          </div>
        </div>
      </div>
      <div class="servant-info-right">
        <div class="follow-btn" @click="toggleFollow">
          <van-icon name="checked" size="2em" :color="isFollowing?'#4b0':'#ccc'"></van-icon>
        </div>
      </div>
    </div>
    <van-tabs v-model="active" swipeable>
      <van-tab v-for="(item,index) in tabs" :title="item.title" :key="index">
        <component :is="item.tabName" :data="item.data" v-model="servantSetting.lvs" @clickSkillIcon="showMaterialList">

        </component>
      </van-tab>
    </van-tabs>
    <van-popup v-model="show">
      <material-list :data="MaterialList"></material-list>
    </van-popup>
  </div>
</template>

<script>
import ServantApi from './../../api/imp/ServantApi';
import { getServantImages, BASE_URL } from './../../conf/image';
import { upperFirst } from 'lodash';
import MyRate from '@/components/MyRate';
import previewImage from './../../mixins/previewImage';
import MaterialList from './components/MaterialList';
import { mapMutations } from 'vuex';
let start = {
  X: -1,
  Y: -1
};
let perY = 0;
//let _not_goBack = false;
export default {
  mixins: [previewImage],
  name: 'servantInfo',
  components: {
    TabCraftEssence: () => import('@/components/CraftEssence.vue'),
    TabSkill: () => import('./components/TabSkill.vue'),
    TabTreasures: () => import('./components/TabTreasures.vue'),
    MaterialList,
    MyRate
  },
  data() {
    return {
      info: {},
      show: false,
      active: 0,
      MaterialList: [],
      headHeight: '2.88rem',
      translateY: 0,
      transition: 'none',
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
      },
      servantSetting: {
        lvs: [1, 1, 1],
        getCloth: false,
        state: 0
      }
    };
  },
  computed: {
    pics() {
      return this.info.id ? getServantImages(this.info.id) : '';
    },
    atk() {
      return `ATK：${this.info.maxAtk || ''}`;
    },
    hp() {
      return `HP：${this.info.maxHp || ''}`;
    },
    previewPics() {
      let keys = ['A', 'B', 'C', 'D'];
      if (this.info.hasFool) keys.push('fool');
      if (this.info.id === '001') keys.push('E');
      if (this.info.clothFlag === 'Y') keys.push('Z');

      let output = [];
      for (let _key of Object.keys(this.pics)) {
        if (keys.includes(_key))
          output.push(this.pics[_key] + '?imageMogr2/interlace/1');
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
    },
    headerStyle() {
      return {
        height: this.headHeight,
        '--bg-image': this.pics.D
          ? 'url(' + this.pics.D + '?imageMogr2/thumbnail/375x/interlace/1)'
          : '',
        transition: this.transition
      };
    },
    isFollowing() {
      return this.$store.state.userData.servant_map[this.info.id];
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
    //document.body.scrollTop = 0;
  },
  methods: {
    touchStart(ev) {
      start.Y = event.targetTouches[0].screenY;
      start.X = event.targetTouches[0].screenX;
    },
    scrollHandler(ev) {
      let wHeight = window.innerHeight,
        wWidth = window.innerWidth,
        rPx = wWidth / 16,
        dY = event.targetTouches[0].screenY - start.Y,
        dX = event.targetTouches[0].screenX - start.X;
      if (
        start.Y != -1 &&
        window.scrollY === 0 &&
        dY > 0 &&
        dX ** 2 < dY ** 2
      ) {
        ev.preventDefault();

        /*  if (start == -1) { */
        this.transition = 'none';
        /*   start = event.targetTouches[0].screenY;
        } */
        this.translateY = dY;
        this.headHeight = 'calc(2.88rem + ' + dY + 'px)';
      }
      if (dY > 0.7 * wHeight - 2.88 * rPx) {
        this.touchEnd();
      }
      perY = event.targetTouches[0].screenY;
    },
    touchEnd(ev) {
      this.transition = 'all 0.4s ease-out';
      this.headHeight = '2.88rem';
      // this.translateY = 0;
      start = {
        X: -1,
        Y: -1
      };
    },
    async showMaterialList() {
      try {
        this.MaterialList = await ServantApi.materialNeeds(this.info.id);
        this.show = true;
      } catch (e) {}
    },
    toggleFollow() {
      let noticeText = '已设置关注',
        servantID = this.info.id;
      if (this.isFollowing) {
        this.removeServantSetting(servantID);
        noticeText = '已取消关注';
      } else this.addServantSetting({ servantID });
      this.$toast.success({ message: noticeText, duration: 1500 });
    },
    ...mapMutations('userData', ['addServantSetting', 'removeServantSetting'])
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
  &__content {
    padding-bottom: 10px;
  }
}
</style>

<style scoped lang="scss">
.van-popup {
  border-radius: 0.5em;
}
.servant-info {
  // background: var(--bg-image) center top 10%/100% auto no-repeat;
  &-header {
    display: flex;
    height: 108px;
    padding: 10px;
    text-shadow: 1px 1px 1px var(--info-color);
    background: linear-gradient(rgba(255, 255, 255, 0.3), var(--border-color)),
      var(--bg-image) center top 10%/100% auto no-repeat;
  }
  &-avatar {
    width: 80px;
    height: 88px;
    clip-path: polygon(0 8%, 8% 0, 92% 0%, 100% 8%, 100% 100%, 0 100%);
  }
  &-base {
    padding: 4px 0 4px 8px;
    display: flex;
    height: 88px;
    flex-wrap: wrap;

    &_row {
      display: flex;

      height: 1.2em;
      width: 100%;
    }
  }
}
/* .van-rate {
  height: 1.3em;
} */
.reset-btn {
  text-shadow: none;
  display: flex;
  align-items: center;
  margin-left: 0.4em;

  line-height: 1;
  margin-top: -0.2em;
  background: radial-gradient(circle at center, #fff 50%, transparent 50%);
}
.follow-btn {
  background: radial-gradient(circle at center, #fff 50%, transparent 50%);
  text-shadow: none;
  line-height: 1;
}
</style>