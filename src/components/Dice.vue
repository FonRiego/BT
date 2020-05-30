<template lang='pug'>
  .dice(
    :class='classArray'
    @click='diceClick'
  )
    img(
      v-if='dataDice.rolledFace'
      :src='dataDice.rolledFace.image'
      height='36'
      width='36'
    )

</template>

<script>
// constants
import { 
  DICE_SELECTION,
  DICE_ROLLING
} from '../constants/battlePhases'

// utils
import { cloneDeep } from 'lodash'

// vuex
import { mapState } from 'vuex'

export default {
  name: 'Dice',

  data() {
    return {
      dataDice: cloneDeep(this.dice)
    }
  },

  props: {
    dice: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    isOptionalDice: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      required: true
    }
  },

  computed: {
    ...mapState({
      statePhase: 'phase'
    }),
    classArray() {
      return [
        this.dataDice.color,
        {
          'disabled': !this.active,
          'discarded': !this.dataDice.willBeRolled,
          'cooled': this.dataDice.willBeCooled
        }
      ]
    }
  },

  methods: {
    toogleWillBeRolled() {
      this.dataDice.willBeRolled ? this.dataDice.willBeRolled = false : this.dataDice.willBeRolled = true
    },

    toogleWillBeCooled() {
      if (this.dataDice.type === 'COOLING') return
      this.dataDice.willBeCooled ? this.dataDice.willBeCooled = false : this.dataDice.willBeCooled = true
    },

    diceClick() {
      if (this.statePhase === DICE_SELECTION) {
        if (this.isOptionalDice) {
          this.toogleWillBeRolled()
        } else if (!this.isOptionalDice) {
          this.toogleWillBeCooled()
        }
      }

      if (this.statePhase === DICE_ROLLING) {
        if (!this.dataDice.willBeRolled) return
        if (this.dataDice.willBeCooled) {
          this.transformCooledDice()
        } else if (!this.dataDice.rolledFace) {
          this.rollDice()
        }
      }      
      // this.$emit('rolledFace', this.rolledFace)
    },

    transformCooledDice() {
      this.$emit('transformToCooling', this.index)
    },

    rollDice() {
      const faceIndex = Math.round(Math.random()*5)
      this.dataDice.rolledFace = this.dataDice.faces[faceIndex]
    }
  },

  watch: {
    dice: {
      deep: true,
      handler() {
        this.dataDice = cloneDeep(this.dice)
      }
    }
  }
}
</script>

<style lang='scss'>
.dice {
  width: 36px;
  height: 36px;
  margin: 0 3px;
  cursor: pointer;
  box-shadow: 0 0 1px 1px grey;
}
.red {
  background-color: red;
  &:hover {
    box-shadow: 0 0 2px 2px purple;
  }
  &.disabled {
    background-color: rgba(red, 0.2);
    pointer-events: none;
  }
}
.black {
  background-color: black;
  &:hover {
    box-shadow: 0 0 2px 2px purple;
  }
  &.disabled {
    background-color: rgba(black, 0.2);
    pointer-events: none;
  }
}
.yellow {
  background-color: yellow;
  &:hover {
    box-shadow: 0 0 2px 2px purple;
  }

  &.disabled {
    background-color: rgba(yellow, 0.2);
    pointer-events: none;
  }
}
.green {
  background-color: green;
  &:hover {
    box-shadow: 0 0 2px 2px purple;
  }
  &.disabled {
    background-color: rgba(green, 0.2);
    pointer-events: none;
  }
}
.white {
  background-color:white;
  &:hover {
    box-shadow: 0 0 2px 2px purple;
  }
  &.disabled {
    background-color: rgba(grey, 0.2);
    pointer-events: none;
  }
}
.blue {
  background-color: blue;
  &:hover {
    box-shadow: 0 0 2px 2px purple;
  }
  &.disabled {
    background-color: rgba(blue, 0.2);
    pointer-events: none;
  }
}
.cooled {
  position: relative;
  background-color: blue;
  &:before, &:after {
    position: absolute;
    left: 16px;
    content: ' ';
    height: 32px;
    width: 4px;
    background-color: rgb(0, 175, 255);
  }
  &:before {
    transform: rotate(90deg);
    bottom: 8px;
  }
  &:after {
    transform: rotate(90deg);
    top: 8px;
  }
}
.discarded {
  position: relative;

  &:before, &:after {
    position: absolute;
    left: 16px;
    content: ' ';
    height: 36px;
    width: 4px;
    background-color: rgb(66, 65, 66);
  }
  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
}
</style>