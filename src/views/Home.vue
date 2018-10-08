<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import ServantApi from './../api/imp/ServantApi';
export default {
  name: 'home',
  components: {
    HelloWorld
  },
  mounted() {
    ServantApi.servantList().then(res=>{
      console.log(res);
    })
  },
}
</script>
