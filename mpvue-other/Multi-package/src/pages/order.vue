<template>
  <div>
    <h3>获取到vuex的值：{{num}}</h3>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex';
  export default {
    config: {
      navigationBarTitleText: '订单'
    },
    data() {
      return {}
    },
    onLoad() {},
    onReady() {},
    onShow() {
      console.log(this.$store.state.mutations.num)
    },
    methods: {},
    computed: { ...mapGetters([
        'num'
      ])
    },
    watch: {},
    components: {}
  }
</script>

<style lang="less">

</style>
