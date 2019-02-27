<template>
  <div class="home">
    <router-link
      v-for="{to,text} in navgator"
      :key="to"
      :to="to"
    >
      {{ text }}
    </router-link>
  </div>
</template>

<script>
// @ is an alias to /src

import { home_page_unlogin, home_page_login } from '@/library/conf/navgator';
export default {
  name: 'home',

  computed: {
    navgator() {
      return this.$store.getters['userData/isLogin']
        ? home_page_login
        : home_page_unlogin;
    }
  },
  async beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    next(vm => {
      vm.$setTitle('首页');
    });
  }
};
</script>
<style lang="scss" scoped>
.home {
  display: flex;
  flex-wrap: wrap;
  a {
    margin: 8px;
  }
}
</style> 

