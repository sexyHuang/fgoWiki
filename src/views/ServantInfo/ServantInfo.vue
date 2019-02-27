<template>
  <div
    class="servant-info"
    @touchmove="scrollHandler"
    @touchend="touchEnd"
    @touchstart="touchStart"
  >
    <div
      class="servant-info-header"
      :style="headerStyle"
    >
      <img
        class="servant-info-avatar"
        :src="pics.icon"
        @click="showPreview(previewPics)"
      />
      <div class="servant-info-base">
        <div class="servant-info-base_row">{{atk}}</div>
        <div class="servant-info-base_row">{{hp}}</div>
        <div
          class="servant-info-base_row"
          style="align-self: flex-end;-webkit-align-self: flex-end;"
        >
          <span>灵基：</span>
          <my-rate
            v-model="servantSetting.state"
            :count="4"
          />
          <div
            class="reset-btn"
            @click="servantSetting.state = 0"
          >
            <van-icon
              name="reset"
              size="1.2em"
              color="#4b0"
            ></van-icon>
          </div>
        </div>
      </div>
      <div class="servant-info-right">
        <div
          class="follow-btn"
          v-if="info.clothFlag==='Y'"
        >
          <van-icon
            name="cloth"
            size="2.3em"
            :color="servantSetting.getCloth?'#fab70d': '#ccc'"
            @click="toggleCloth"
          ></van-icon>
        </div>
        <div
          class="follow-btn"
          @click="toggleFollow"
        >
          <van-icon
            name="checked"
            size="2em"
            :color="isFollowing?'#4b0':'#ccc'"
          ></van-icon>
        </div>
      </div>
    </div>
    <van-tabs
      v-model="active"
      swipeable
      :line-width="winWidth/tabs.length"
    >
      <van-tab
        v-for="(item,index) in tabs"
        :title="item.title"
        :key="index"
      >
        <component
          :is="item.tabName"
          :data="item.data"
          v-model="servantSetting.lvs"
          @clickSkillIcon="showMaterialList"
        >

        </component>
      </van-tab>
    </van-tabs>
    <van-popup v-model="show">
      <material-list :data="fmtMaterialList"></material-list>
    </van-popup>
    <van-popup
      position="right"
      v-model="result_show"
      :overlay="false"
      :class="['l-flex-fd--column',{'show-title': hasTitle}]"
    >
      <div class="l-flex l-flex-shrink icon-cout">
        <div
          class="icon"
          v-for="(item, index) in settingChangeList"
          :key="index"
          :data-text="item.text"
          :style="item.icon|bgImage"
        />
      </div>
      <material-calc-result-list
        :data="result"
        :lacks="lacks"
        :material_map="material_map"
      ></material-calc-result-list>
      <van-button
        type="primary"
        block
        :disabled="Object.keys(lacks).length > 0"
        class="l-flex-shrink"
        @click="deductButtonHandler"
      >扣除素材</van-button>
    </van-popup>
    <div class="l-fixed--bottom l-flex l-flex-jc--flex-end l-flex-ai--center m-button-cout">
      <van-button
        type="primary"
        plain
        size="small"
        @click="toggleSkill310Set"
        :disabled="skill310btnType>1"
      >{{toggleSkill310btnTexts[skill310btnType]}}</van-button>
      <van-button
        type="primary"
        size="small"
        @click="settingHandler"
        :disabled="settingNotChange"
      >设置</van-button>
      <van-button
        type="primary"
        size="small"
        @click="calcMaterialCost"
        :disabled="!canCalc"
      >计算素材</van-button>
    </div>

  </div>
</template>

<script>
import isEqual from 'lodash/isEqual';
import ServantApi from '@/api/imp/ServantApi';
import { getServantImages, BASE_URL } from '@/library/conf/image';
import { upperFirst } from 'lodash';
//import {BASE_URL} from './../../conf/image';
import MyRate from '@/components/MyRate';
import previewImage from '@/mixins/previewImage';
import MaterialList from './components/MaterialList';
import { mapMutations, mapGetters, mapState, mapActions } from 'vuex';
import { materialCal } from '@/library/common/common';
import MaterialCalcResultList from '@/components/MaterialCalcResultList';
let start = {
  X: -1,
  Y: -1
};
//let perY = 0;
//let _not_goBack = false;
export default {
  mixins: [previewImage],
  name: 'servantInfo',
  components: {
    TabCraftEssence: () => import('@/components/CraftEssence.vue'),
    TabSkill: () => import('./components/TabSkill.vue'),
    TabTreasures: () => import('./components/TabTreasures.vue'),
    MaterialList,
    MyRate,
    MaterialCalcResultList
  },
  data() {
    return {
      info: {},
      show: false,
      active: 0,
      MaterialList: [],
      headHeight: '2.88rem',
      winWidth: window.innerWidth,
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
      },
      result_show: false,
      result: [],
      toggleSkill310btnTexts: ['310', '还原', '已310']
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
      return this.$store.getters['userData/getServantSettingById'](
        this.info.id
      );
    },
    settingChangeList() {
      let output = [];
      let { state: f_state, lvs: f_lvs, getCloth: f_getCloth } = this
        .isFollowing || { state: 0, lvs: [1, 1, 1], getCloth: false };
      let { state, lvs, getCloth } = this.servantSetting;
      let { imgPath, skill } = this.info;
      if (f_state < state) {
        output.push({
          icon: BASE_URL + imgPath,
          text: `${f_state}→${state}`
        });
      }
      lvs.map((val, idx) => {
        let _f_val = f_lvs[idx];
        if (_f_val >= val) return;
        output.push({
          icon: BASE_URL + skill[idx][skill[idx].length - 1].imgPath,
          text: `${_f_val}→${val}`
        });
      });
      if (getCloth && !f_getCloth)
        output.push({
          icon: this.pics.cloth_icon,
          text: '灵衣'
        });
      return output;
    },
    skill310btnType() {
      let type = 0,
        lvs310 = JSON.stringify([10, 10, 10]),
        state = 4;
      if (
        JSON.stringify(this.servantSetting.lvs) === lvs310 &&
        this.servantSetting.state === state
      ) {
        type = 1;
        if (
          this.isFollowing &&
          JSON.stringify(this.isFollowing.lvs) === lvs310 &&
          this.isFollowing.state === state
        )
          type = 2;
      }
      return type;
    },
    settingNotChange() {
      return this.isFollowing && isEqual(this.servantSetting, this.isFollowing);
    },
    canCalc() {
      let { state: f_state, lvs: f_lvs, getCloth: f_getCloth } = this
        .isFollowing || { state: 0, lvs: [1, 1, 1], getCloth: false };
      let { state, lvs, getCloth } = this.servantSetting;
      if (state > f_state) return true;
      if (getCloth && !f_getCloth) return true;
      return lvs.some((val, idx) => val > f_lvs[idx]);
    },
    fmtMaterialList() {
      if (this.MaterialList.length <= 0) return [];
      let output = {};
      this.MaterialList.map(val => {
        let key = val.state;
        if (!output[key]) output[key] = [];
        output[key].push(val);
      });
      return Object.entries(output);
    },
    lacks() {
      let output = {};
      this.result.map(({ materialId, count }) => {
        let _has = this.material_map[materialId] || 0;
        if (count > _has) output[materialId] = count - _has;
      });
      return output;
    },
    ...mapState('userData', ['material_map']),
    ...mapGetters(['hasTitle'])
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
      let _servantID = vm.$route.params.ID,
        infoPromise = ServantApi.info(_servantID),
        materialPromise = ServantApi.materialNeeds(_servantID);
      try {
        vm.info = await infoPromise;
      } catch (e) {
        vm.$router.go(-1);
      }

      vm.MaterialList = await materialPromise;
      vm.$setTitle(vm.info.name);
      vm.isFollowing &&
        (vm.servantSetting = JSON.parse(JSON.stringify(vm.isFollowing)));
    });
  },
  mounted() {
    //document.body.scrollTop = 0;
  },
  methods: {
    touchStart() {
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
      //perY = event.targetTouches[0].screenY;
    },
    touchEnd() {
      this.transition = 'all 0.4s ease-out';
      this.headHeight = '2.88rem';
      // this.translateY = 0;
      start = {
        X: -1,
        Y: -1
      };
    },
    async showMaterialList() {
      this.show = true;
    },
    settingHandler() {
      let servantID = this.info.id,
        data = JSON.parse(JSON.stringify(this.servantSetting));
      let material_arr = materialCal(
        this.fmtMaterialList,
        {
          getCloth: false,
          lvs: [1, 1, 1],
          state: 0
        },
        this.servantSetting
      );
      data.material_arr = material_arr;
      this.addServantSetting({ servantID, data });
      this.$toast.success({ message: '设置成功', duration: 1500 });
    },
    toggleSkill310Set() {
      switch (this.skill310btnType) {
        case 0:
          this.servantSetting.lvs = [10, 10, 10];
          this.servantSetting.state = 4;
          break;
        case 1:
          this.servantSetting = this.isFollowing
            ? JSON.parse(JSON.stringify(this.isFollowing))
            : {
                lvs: [1, 1, 1],
                getCloth: false,
                state: 0
              };
      }
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
    toggleCloth() {
      this.servantSetting.getCloth = !this.servantSetting.getCloth;
    },
    calcMaterialCost() {
      this.$router.push({
        query: {
          open: 1
        }
      });
      if (!this.isFollowing)
        this.addServantSetting({ servantID: this.info.id });
      let material_arr = materialCal(
        this.fmtMaterialList,
        this.isFollowing,
        this.servantSetting
      );
      this.result = material_arr;
      this.result_show = true;
    },
    deductButtonHandler() {
      this.$router.go(-1);
      this.deductMaterial();
      this.settingHandler();
    },
    deductMaterial() {
      let deductList = this.result.map(({ materialId, count }) => {
        return {
          materialID: materialId,
          dCount: -1 * count
        };
      });
      this.materialsCalc(deductList);
    },
    ...mapMutations('userData', ['addServantSetting', 'removeServantSetting']),
    ...mapActions('userData', ['materialsCalc'])
  },
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
  },*/

  watch: {
    $route: {
      deep: true,
      handler(val) {
        if (!val.query.open) {
          this.result_show = false;
        }
      }
    }
  }
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
  &.show-title {
    height: calc(100% - 46px);
    top: calc(50% + 23px);
  }
}
.van-popup--right {
  width: 100%;
  height: 100%;
  border-radius: 0;
}
.servant-info {
  // background: var(--bg-image) center top 10%/100% auto no-repeat;
  padding-bottom: 52px;
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
  &-right {
    display: flex;
    align-items: flex-start;
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
  background: radial-gradient(circle at center, #fff 50%, transparent 50%);
}
.follow-btn {
  background: radial-gradient(circle at center 40%, #fff 50%, transparent 50%);
  text-shadow: none;
  line-height: 1;
  margin-left: 0.2em;
}
.m-button-cout {
  width: 100%;
  border-top: 1px solid var(--muted-color);
  background: white;
  z-index: 9;
  padding: 8px;
  & > button {
    margin: 0 4px;
  }
}

.icon {
  @extend %icon-card;
  background: center/auto 100% no-repeat;
  font-size: 3em;
  margin: 0 6px;
}
.icon-cout {
  padding: 4px 8px;
  background: var(--border-color);
}
</style>