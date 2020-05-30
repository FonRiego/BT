<template lang='pug'>
  .dice(
    :class='[dice.color, { disabled: !active }]'
    @click='diceClick(dice)'
  )
    img(
      v-if='this.rolledFace'
      :src='this.rolledFace.image'
      height='36'
      width='36'
    )

</template>

<script>
// components
export default {
  name: 'Dice',

  data() {
    return {
      rolledFace: null
    }
  },

  props: {
    dice: {
      type: Object,
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

  methods: {
    diceClick(dice) {
      console.log(dice, this.rolledFace, this.isOptionalDice)

      if (!this.rolledFace) {
        this.rollDice()
      } else if (this.rolledFace) {
        this.$emit('rolledFace', this.rolledFace)
      }
    },
    rollDice() {
      const faceIndex = Math.round(Math.random()*5)
      this.rolledFace = this.dice.faces[faceIndex]
      console.log(this.rolledFace)
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
</style>