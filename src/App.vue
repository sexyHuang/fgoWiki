<template>
  <div id="app">
    <keep-alive :include="$store.state.system.aliveList">
      <router-view/>
    </keep-alive>

  </div>
</template>

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
.van-image-preview{
  background: #000;
}
</style>
