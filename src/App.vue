<template lang='pug'>
  #app
    transition(name='fade' mode='out-in')
      router-view
</template>

<style lang='scss'>
  @import './scss/app.scss';

  #app {
    min-height: 100vh;
    overflow-x: hidden;
  }
</style>
