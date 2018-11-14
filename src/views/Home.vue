<template>
  <div class="home">
    <router-link to="/servantList">英灵列表</router-link>
    <router-link to="/craftEssenceList">礼装列表</router-link>
    <router-link to="/treasureCalc">宝具伤害</router-link>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'home',

  beforeRouteEnter(to, from, next) {
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
.home{
  display: flex;
  a {
    margin: 10px;
  }
}
</style> 

