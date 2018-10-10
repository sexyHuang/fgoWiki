<template>
    <div>
        CraftEssenceList
    </div>
</template>

<script>
export default {
  name: 'craftEssenceList',
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    next(vm => {
      vm.$store.commit('setShowTitle', false);
      vm.$setTitle('礼装列表');
    });
  }
};
</script>

<style scoped lang='scss'>
</style>