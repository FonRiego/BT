<template lang='pug'>
  .mech-reverse
    dice-pack(
      :baseDice='mech.baseDice'
      :optionalDice='mech.optionalDice'
    )
    life-display(
      :maxStructure='mech.maxStructure'
      :currentStructure='currentStructure'
    )
    img(
      :src='mech.imageSource'
      height='312'
      width='225'
    )
</template>

<script>
// components
import DicePack from './DicePack'
import LifeDisplay from './LifeDisplay'

export default {
  name: 'MechReverse',
  data() {
    return {
      currentStructure: null
    }
  },

  props: {
    mech: {
      type: Object,
      required: true
    }
  },

  components: { LifeDisplay, DicePack },

  beforeMount() {
    this.currentStructure = this.mech.maxStructure
  }
}
</script>

<style lang='scss'>
.mech-reverse {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 225px;
  .life-display {
    margin-bottom: 8px;
  }
}
</style>