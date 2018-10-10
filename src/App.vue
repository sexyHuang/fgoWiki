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

.van-collapse-item__content {
  padding: 0 0 0 0.4rem;
}
.van-hairline--top-bottom::after {
  border-width: 0;
}
.van-checkbox-group {
  display: flex;
  flex-wrap: wrap;
}
.van-checkbox {
  margin: 0.4em 0.6em;

  .van-checkbox__icon {
    display: none;
  }
  .van-checkbox__label {
    margin: 0;
    display: flex;
    height: 1.6em;
    line-height: 1;
    align-items: center;
    padding: 0 0.5em;
    border: 1px solid var(--border-color);
    color: var(--info-color);
    border-radius: 0.2em;
  }
  .van-checkbox__icon--checked + .van-checkbox__label {
    border-color: var(--select-color);
    background: var(--select-color);
    color: white;
  }
}
</style>
