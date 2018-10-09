<template>
  <div id="app">
    <van-nav-bar v-show="showTitle" :title="$store.state.system.title" fixed :z-index='100'></van-nav-bar>
    <keep-alive :include="$store.state.system.aliveList">
      <router-view :style="style" />
    </keep-alive>

  </div>
</template>
<script>
export default {
  data() {
    return {
      isWeixin:
        navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
        'micromessenger'
    };
  },
  computed: {
    style() {
      return {
        'margin-top': !this.showTitle ? 0 : '1.22667rem'
      };
    },
    showTitle() {
      return !this.isWeixin && this.$store.state.system.showTitle;
    }
  }
};
</script>
<style lang="scss">
@import './scss/reset/_reset';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //text-align: center;
  color: var(--main-color);
  font-size: 14px;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.van-image-preview {
  background: #000;
}
</style>
