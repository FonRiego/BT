<template lang='pug'>
  .mech(:class='classObject')
    img(
      :src='mechData.imageSource'
      height='312'
      width='225'
    )
    life-display(
      :maxStructure='mechData.maxStructure'
      :currentStructure='currentStructure'
      :heat='heat'
    )

    .dice-container
      .base-dice
        Dice(
          v-for='(dice, index) in mechData.baseDice'
          :key='index + "base"'
          :index='index'
          :dice='dice'
          :active='active'
          @transformToCooling='ind => { transformCooledDice(ind) }'
        )

      .separator(v-if='mechData.optionalDice.length > 0')

      .optional-dice
        Dice(
          v-for='(dice, index) in mechData.optionalDice'
          :key='index + "optional"'
          :index='index'
          :dice='dice'
          isOptionalDice=true
          :active='active'
        )

</template>

<script>
// Vue
import Vue from 'vue'

// utils
import { cloneDeep } from 'lodash'

// constants
import { COOLING } from '../constants/dice'

// components
import LifeDisplay from './LifeDisplay'
import Dice from './Dice'

export default {
  name: 'Mech',
  data() {
    return {
      mechData: cloneDeep(this.mech),
      currentStructure: null,
      heat: null,
      destroyed: false
    }
  },

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
        'destroyed': this.destroyed,
        'active': this.active
      }
    }
  },

  components: { LifeDisplay, Dice },

  methods: {
    transformCooledDice(ind) {
      console.log(ind)
      console.log(this.mechData.baseDice)
      const newCoolingDice = cloneDeep(COOLING)
      Vue.set(this.mechData.baseDice, ind, newCoolingDice)
      // this.mechData.baseDice.splice(ind, 1, newCoolingDice)
      console.log(this.mechData.baseDice)
    }
  },

  beforeMount() {
    this.currentStructure = this.mechData.maxStructure
    this.heat = 0
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