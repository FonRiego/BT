<template lang='pug'>
  .mech
    img(
      :src='imgSource'
      height='312'
      width='225'
    )
    life-display(
      :maxLife='maxLife'
      :currentLife='currentLife'
    )
</template>

<script>
// components
import LifeDisplay from './LifeDisplay'
export default {
  name: 'Mech',
  data() {
    return {
      currentLife: null
    }
  },

  props: {
    image: {
      type: String,
      required: true
    },
    maxLife: {
      type: String,
      required: true
    }
  },

  computed: {
    imgSource() {
      return `/img/mechs/${this.image}`
    }
  },

  components: { LifeDisplay },

  beforeMount() {
    this.currentLife = this.maxLife
  }
}
</script>

<style lang='scss'>
.mech {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 225px;
}
</style>