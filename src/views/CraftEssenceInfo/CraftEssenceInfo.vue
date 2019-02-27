<template>
  <div
    :class="['ce_cout',bgMode]"
    :style="style"
    v-cloak
  >
    <craft-essence :data="info"></craft-essence>
  </div>
</template>

<script>
import CraftEssenceApi from '@/api/imp/CraftEssenceApi';
import CraftEssence from '@/components/CraftEssence';
import { BASE_URL } from '@/library/conf/image';
export default {
  name: 'craftEssenceInfo',
  components: {
    CraftEssence
  },
  data() {
    return {
      info: {
        intro: ''
      }
    };
  },
  computed: {
    style() {
      return {
        '--bg-image': this.info.pic
          ? `url(${BASE_URL}${
              this.info.pic
            }?imageMogr2/thumbnail/375x/blur/10x5/interlace/1)`
          : ''
      };
    },
    bgMode() {
      let rWH = window.innerWidth / window.innerHeight;
      let rBG = 572 / 978;
      return rWH > rBG ? '' : 'long';
    }
  },
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    next(async vm => {
      //vm.$store.commit('setShowTitle', false);
      try {
        vm.info = await CraftEssenceApi.info(vm.$route.params.ID);

        vm.$setTitle(vm.info.name);
      } catch (e) {
        vm.$router.go(-1);
      }
    });
  }
};
</script>

<style scoped lang='scss'>
.ce_cout {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  --bg-image: '';
  &.long {
    &::before {
      background-size: auto 100vh;
    }
  }
  &::before {
    content: '';
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: center/100% no-repeat;

    opacity: 1;
    background-image: var(--bg-image);
  }
  &::after {
    content: '';
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    opacity: 0.74;
  }
}
.craft-essence {
  position: relative;
  z-index: 1;
  margin: 0 0 10px;
}
</style>