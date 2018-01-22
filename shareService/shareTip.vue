<template>
  <div class="shareTip" @click="close()">
    <div class="tip"></div>
  </div>
</template>
<script>
  export default{
    methods: {
      close(){
        this.$emit('close')
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .shareTip {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10000;
    background-image: url("../../assets/img/bgb.png");
    background-repeat: repeat;
  }

  .tip {
    width: 100%;
    height: 100%;
    background-image: url("../../assets/img/shareTip.png");
    background-repeat: no-repeat;
    background-position: right top;
    background-size: 80% auto;
  }
</style>
