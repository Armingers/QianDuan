<!-- App.vue相当于<div id="app"></div>-->
<template>
  <div id="app">
    <!-- <navBar/> -->
    <!-- <login-model></login-model> -->
    <router-view />
  </div>
</template>

<script>
// 引入子组件
// import navBar from './components/navBar.vue'

// import loginModel from './views/login'

export default {
  name: 'App',
  components: {   // 其子组件
    // navBar
    // loginModel
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
