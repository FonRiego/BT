<template lang='pug'>
  .life-display
    span {{ currentStructure }} / {{ maxStructure }}
</template>

<script>
export default {
  name: 'LifeDisplay',

  props: {
    currentStructure: {
      type: Number,
      required: true
    },
    maxStructure: {
      type: Number,
      required: true
    }
  }
}
</script>

<style lang='scss'>
.life-display {
  border: 2px solid red;
  border-radius: 3px;
  width: 100%;
  background-color: rgba(red, 0.2);
  // background-color:rgba(255,0,0,0.3);
  color: red;
  text-align: center;
  padding: 0.125em;
  font-size: 2rem;
  box-sizing: border-box;
}
</style>