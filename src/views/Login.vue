<template>
  <div>
    <van-cell-group>
      <van-field
        v-model="userID"
        label="用户ID"
        placeholder="请输入用户ID"
        required
      />
      <van-field
        v-model="password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        required
      />
      <van-button
        type="primary"
        text="登录"
        block
        @click="login"
      />
    </van-cell-group>
  </div>
</template>

<script>
import User from '@/api/imp/User';
export default {
  name: 'home',

  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    next(vm => {
      vm.$setTitle('登录');
    });
  },
  data() {
    return {
      userID: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        let response = await User.login({
          userID: this.userID,
          password: this.password
        });
        this.$store.dispatch('userData/setInfo', response.data);
        this.$router.replace('/user');
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>

<style scoped>
</style>