<template>
  <div id="app">
    <photograph v-model="headImage" @upload="upload"></photograph>
  </div>
</template>

<script>
import Photograph from './components/photograph.vue'

export default {
  name: 'app',
  components: {
    Photograph
  },
  data(){
    return{
      headImage:''
    }
  },
  methods:{
    upload(){
      console.log('上传事件')
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
