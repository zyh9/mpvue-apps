<template>
 <div>
<p @click="click">点击进入个人店铺页</p>
 </div>
</template>

<script>
 export default {
   data () {
     return {

     }
   },
   mounted () {
     
   },
   methods: {
     click(){
       wx.navigateTo({
          url: '/pages/store/main'
        })
     }
   },
   components: {

   },
 }
</script>

<style>

 
</style>
