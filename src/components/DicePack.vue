<template lang='pug'>
  .dice-container
    .baseDice(
      v-for='(dice, index) in baseDice'
      :key='index + "base"'
    )
      .dice(
        :class='dice.color'
      )

    .separator(v-if='optionalDice.length > 0')

    .optionalDice(
      v-for='(dice, index) in optionalDice'
      :key='index + "optional"'
    )
      .dice(
        :class='dice.color'
      )

</template>

<script>
// components
export default {
  name: 'DicePack',

  props: {
     baseDice: {
      type: Array,
      required: true
    },
    optionalDice: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang='scss'>
.dice-container {
  width: 100%;
  padding: 8px;
  display: flex;
  justify-content: center;
  .dice {
    width: 24px;
    height: 24px;
    margin: 0 8px;
    cursor: pointer;
    box-shadow: 0 0 1px 1px grey;
  }
  .red {
    background-color: red;
    &:hover {
      box-shadow: 0 0 2px 2px purple;
    }
  }
  .black {
    background-color: black;
    &:hover {
      box-shadow: 0 0 2px 2px purple;
    }
  }
  .yellow {
    background-color: yellow;
    &:hover {
      box-shadow: 0 0 2px 2px purple;
    }
  }
  .green {
    background-color: green;
    &:hover {
      box-shadow: 0 0 2px 2px purple;
    }
  }
  .white {
    background-color:white;
    &:hover {
      box-shadow: 0 0 2px 2px purple;
    }
  }
  .blue {
    background-color: blue;
    &:hover {
      box-shadow: 0 0 2px 2px purple;
    }
  }
  .separator {
    height: 24px;
    width: 2px;
    background-color: grey;
  }
}
</style>