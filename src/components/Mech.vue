<template lang="pug">
  #mech
    .mech-image
    life-display(
      :maxLife='maxLife',
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
      type: Number,
      required: true
    }
  },

  components: { LifeDisplay },

  beforeMount() {
    this.currentLife = this.maxLife
  }
}
</script>

<style scoped>
#mech {

}
</style>