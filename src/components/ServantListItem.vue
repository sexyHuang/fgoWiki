<template>

  <div
    :class="['servant-list-item',{card: isCard},{show: isShow},{following: isFollowing}]"
    :style="style"
    @click="clickHandler"
  >
    <div
      class="following-icon"
      v-show="isFollowing&&isCard"
    >
      <van-icon
        name="checked"
        color="#4b0"
        size="1.2em"
      />
    </div>

    <div
      :class="[unloadIconClass,'unload-icon']"
      v-lazy:background-image="loadedImgSrc"
    ></div>
    <div class="main">{{data.name}}</div>
    <div class="sub">{{addition}}</div>
    <van-icon
      name="arrow"
      class="icon"
      v-show="! editMode"
    />
  </div>

</template>

<script>
import { BASE_URL } from './../conf/image';
import { upperFirst } from 'lodash';
import { search } from '@/common/common';
import { mapMutations } from 'vuex';
export default {
  data() {
    return {
      rarityColor: ['', 'Bronze', 'Bronze', 'Silver', 'Gold', 'Gold'],
      loadedImgSrc: {
        src: BASE_URL + this.data.imgPath + '?imageMogr2/interlace/1',
        loading: require('./../assets/icons.png'),
        error: require('./../assets/icons.png')
      }
    };
  },
  props: {
    isCard: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return {
          addition: []
        };
      }
    },
    order: {
      type: Number,
      default: 0
    },
    showOptions: {
      type: Object,
      default() {
        return {};
      }
    },
    showType: {
      type: Number,
      default: 0
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    style() {
      let output = {
        order: this.order
      };
      return output;
    },
    isFollowing() {
      return this.$store.state.userData.servant_map[this.data.id];
    },
    addition() {
      let sexs = ['男性', '女性', '？', '男性&女性'],
        party = ['天', '地', '人', '星', '兽'],
        type1 = ['秩序', '混沌', '中立'],
        type2 = ['善', '恶', '中庸', '夏', '狂', '花嫁'],
        ignore = [
          'Shielder',
          'Saber',
          'Lancer',
          'Archer',
          'Caster',
          'Rider',
          'Assassin',
          'Berserker',
          'Foreigner',
          'Ruler',
          'MoonCancer',
          'Alterego',
          'Avenger',
          'Buster',
          'Arts',
          'Quick',
          '从者（被EA克制）',
          '从者（不被EA克制）',
          '群体',
          '单体',
          '辅助',
          '天/地从者'
        ],
        output = ['？', '', '', ''];
      this.data.addition.map(val => {
        val = val.trim();
        if (sexs.includes(val)) output[0] = val;
        else if (party.includes(val)) output[1] = val;
        else if (type1.includes(val)) output[2] = val;
        else if (type2.includes(val)) output[3] = val;
        else if (!ignore.includes(val)) output.push(val);
      });
      return output.join(', ');
    },
    isShow() {
      let showType =
        this.showType === 0 ||
        (this.showType === 1 && this.isFollowing) ||
        (this.showType === 2 && !this.isFollowing);
      let output = showType && search(this.data, this.showOptions);
      if (output) this.$emit('show');
      return output;
    },
    unloadIconClass() {
      let classes = ['icon-Icon_Class'];
      classes.push(upperFirst(this.data.class.toLowerCase()));
      classes.push(this.rarityColor[this.data.rarity]);
      return classes.join('_');
    }
  },
  methods: {
    clickHandler() {
      this.editMode ? this.toggleFollow() : this.jumpToInfo();
    },
    jumpToInfo() {
      this.$router.push(`/servantInfo/${this.data.id}`);
    },
    async toggleFollow() {
      if (!this.isFollowing)
        this.addServantSetting({ servantID: this.data.id });
      else
        await this.$dialog
          .confirm({
            title: '提示',
            message: '取消关注会清除练度数据，<br>确定要取消关注？',
            className: 'dialog'
          })
          .then(() => this.removeServantSetting(this.data.id));
    },
    ...mapMutations('userData', ['addServantSetting', 'removeServantSetting'])
  },
  created() {
    /*  let image = new Image();
    image.onload = () => {
      this.loadedImgSrc = image.src;
    };

    image.src = BASE_URL + this.data.imgPath; */
  }
};
</script>

<style lang="scss" scoped>
@import './../scss//fgo-icon';
.servant-list-item {
  font-size: 14px;
  height: 6em;
  padding: 1.2em 4em 1em 5em;
  margin-left: 1em;
  box-sizing: border-box;
  background: left center/auto 5em no-repeat;
  display: none;
  flex-direction: column;
  justify-content: space-between;
  line-height: 1;
  border-bottom: 1px solid var(--border-color);
  position: relative;
  width: 100%;
  transition: all 0.5s;
  &.show {
    display: flex;
  }
  .unload-icon {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate3d(-4%, -50%, 0) scale(0.86);
    transform-origin: left;
    background-color: rgba(235, 235, 235, 0.6);
    border-radius: 10%;
    &[lazy='loaded'] {
      background: center/auto 100% no-repeat;
    }
  }
  .main {
    font-size: 1.2em;
    font-weight: 600;
  }
  .sub {
    font-size: 0.8em;
    line-height: 1.2;
    color: var(--info-color);
  }
  .icon {
    color: var(--info-color);
    position: absolute;
    top: 50%;
    right: 1em;
    transform: translate3d(0, -50%, 0);
  }
  .main,
  .sub,
  .icon {
    opacity: 1;
    transition: all 0.1s ease-out 0.4s;
    // pointer-events: none;
  }
  &.card {
    padding: 0;
    width: 2rem;
    height: 2rem;
    border-width: 0;
    margin: 0;
    overflow: hidden;
    background: center/auto 86% no-repeat;
    .main,
    .sub,
    .icon {
      opacity: 0;
      transition: none;
    }
    .unload-icon {
      left: 50%;
      transform: translate3d(-50%, -50%, 0) scale(0.86);
      transform-origin: center;
    }
  }
  &:not(.card).following {
    color: #4b0;
  }
  .following-icon {
    position: absolute;
    right: 0.2em;
    top: 0.2em;
    z-index: 1;
    width: 1.2em;
    height: 1.2em;
    background: white;
    border-radius: 100%;
  }
}
</style>
