<template>
  <div class="user">
    <div
      class="avatar"
      :style="infos.userAvatar|bgImage"
    ></div>
    <div>{{infos.userName}}</div>
    <div>
      <van-button @click="upload">上传本地数据</van-button>
      <van-button @click="getData">同步云端数据</van-button>
    </div>
    <van-button
      tag="div"
      @click="logout"
    >登出</van-button>
  </div>
</template>

<script>
import UserAPI from '@/api/imp/User';
import { mapState } from 'vuex';
import userData from '@/store/modules/userData';
export default {
  computed: {
    ...mapState('userData', ['infos'])
  },
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    next(vm => {
      vm.$setTitle('我的');
    });
  },
  methods: {
    logout() {
      UserAPI.logout().then(() => {
        console.log('登出成功');
      });
    },
    upload() {
      UserAPI.uploadData()
        .then(() => {
          this.$toast.success('上传成功');
        })
        .catch(e => {
          this.$toast.fail('上传失败');
        });
    },
    getData() {
      UserAPI.getData()
        .then(res => {
          let { servantMap, materialMap } = res;
          this.$store.dispatch('userData/init', {
            servantSettings: servantMap,
            materialSettings: materialMap
          });
          this.$toast.success('同步成功');
        })
        .catch(e => {
          this.$toast.fail('同步失败');
          console.error(e);
        });
    }
  }
};
</script>

<style scoped lang='scss'>
.user {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.avatar {
  margin: 20px 0 10px;
  width: 88px;
  height: 88px;
  background: center/100% no-repeat;
  border-radius: 50%;
}
</style>