<template lang='pug'>
  .mech(:class='classObject')
    img(
      :src='mech.imageSource'
      height='312'
      width='225'
    )
    life-display(
      :maxStructure='mech.maxStructure'
      :currentStructure='mech.currentStructure'
      :heat='mech.heat'
    )

    .dice-container
      .base-dice
        Dice(
          v-for='(dice, index) in mech.baseDice'
          :key='index + "base"'
          :index='index'
          :dice='mech.baseDice[index]'
          :active='active'
          @transformToCooling='ind => { transformCooledDice(ind) }'
        )

      .separator(v-if='mech.optionalDice.length > 0')

      .optional-dice
        Dice(
          v-for='(dice, index) in mech.optionalDice'
          :key='index + "optional"'
          :index='index'
          :dice='mech.optionalDice[index]'
          isOptionalDice=true
          :active='active'
        )

</template>

<script>
// utils
import { cloneDeep } from 'lodash'

// constants
import { COOLING } from '../constants/dice'

// components
import LifeDisplay from './LifeDisplay'
import Dice from './Dice'

export default {
  name: 'Mech',
 
  props: {
    mech: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    reversed: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      required: true
    }
  },

  computed: {
    classObject() {
      return {
        'reversed': this.reversed,
        'destroyed': this.mech.destroyed,
        'active': this.active
      }
    }
  },

  components: { LifeDisplay, Dice },

  methods: {
    transformCooledDice(ind) {
      const newCoolingDice = cloneDeep(COOLING)
      this.mech.baseDice.splice(ind, 1, newCoolingDice)
    }
  },

  beforeMount() {
    this.mech.currentStructure = this.mech.maxStructure
    this.mech.heat = 0
  }
}
</script>

<style lang='scss'>
.mech {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 225px;
  &.reversed {
    flex-direction: column-reverse;
  }
  &.destroyed {
    border: 1px solid red;
  }
  .life-display {
    margin: 8px;
  }

  .dice-container {
    width: 100%;
    display: flex;
    padding: 8px 0;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    .base-dice, .optional-dice {
      display: flex;
      justify-content: center;
    }
    .separator {
      height: 36px;
      margin: 0 6px;
      width: 3px;
      background-color: grey;
    }
  }
}
</style>