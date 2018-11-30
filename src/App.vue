<template>
  <div id="app">
    <van-nav-bar
      v-show="showTitle"
      :title="$store.state.system.title"
      fixed
      :z-index='100'
      :left-arrow="showGoBack"
      :left-text="goBackText"
      @click-left="goBack"
    ></van-nav-bar>
    <!-- <transition :name="transitionName">
 -->
    <keep-alive :include="$store.state.system.aliveList">

      <router-view :style="style" />

    </keep-alive>
    <!-- </transition> -->

  </div>
</template>
<script>
export default {
  data() {
    return {
      transitionName: "slide-left"
    };
  },
  computed: {
    style() {
      return {
        "padding-top": !this.showTitle ? 0 : "1.22667rem"
      };
    },
    showTitle() {
      return (
        !this.$store.state.system.isWeixin && this.$store.state.system.showTitle
      );
    },
    showGoBack() {
      return this.$store.state.system.canGoBack;
    },
    goBackText() {
      return this.showGoBack ? "" : "";
    }
  },
  watch: {
    $route() {
      this.transitionName = this.$store.state.system.isBack
        ? "slide-right"
        : "slide-left";
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss">
@import './scss/reset/_reset';
@import './scss/_layout';
[v-cloak] {
  opacity: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //text-align: center;
  color: var(--main-color);
  font-size: 14px;
}
.van-nav-bar .van-icon {
  color: var(--main-color);
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
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: transform 0.3s cubic-bezier(0.55, 0, 0.1, 1);
  //position: absolute;
  width: 100%;
  left: 0;
}
.slide-right-enter {
  transform: translateX(-100%);
}
.slide-right-leave-active {
  transform: translateX(100%);
}
.slide-left-enter {
  transform: translateX(100%);
}
.slide-left-leave-active {
  transform: translateX(-100%);
}
.dialog {
  text-align: center;
}

@font-face {
  font-family: 'custom-iconfont';
  src: url('./assets/iconfont.ttf') format('truetype');

}
%van-icon {
  
  font-family: 'custom-iconfont' !important;
  font: normal normal normal 1em/1 custom-iconfont;
 
}

.van-icon-reset:before {
   @extend %van-icon;
  content: '\e612';
  position: relative;
    display: inline-block;
    
    text-rendering: auto;
}
.van-icon-cloth{

  position: relative;
  width: 1em;
  height: 0.9em;
}
.van-icon-cloth:before {
  @extend %van-icon;
  content: '\e605';
  margin-top: -0.16em;
  display: block;
}
</style>
