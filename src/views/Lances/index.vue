<template lang='pug'>
  #mech-selection
    .lance
      .selection-box
        label Lance 1 name
        input(
          v-model='lance1.name'
        )
        select(
          v-model='mechSelected1'
        )
          option(
            v-for='mech in mechsData'
            :key='mech.name'
            :value='mech'
          ) {{ mech.name }}
        button(
          @click='addToLance("1")'
        )
          span Add to Lance 1
      .selection-display
        div(
          v-for='(mech, index) in lance1.mechs'
          :key='index'
        )
          img(
            :src='mech.imageSource'
            height='312'
            width='225'
          )

    .lance
      .selection-box
        label Lance 2 name
        input(
          v-model='lance2.name'
        )
        select(
          v-model='mechSelected2'
        )
          option(
            v-for='mech in mechsData'
            :key='mech.name'
            :value='mech'
          ) {{ mech.name }}
        button(
          @click='addToLance("2")'
        )
          span Add to Lance 2
      .selection-display
        div(
          v-for='(mech, index) in lance2.mechs'
          :key='index'
        )
          img(
            :src='mech.imageSource'
            height='312'
            width='225'
          )

    button.battle-button(
      @click='gotoBattle'
    )
      span Go to battle

</template>

<script>
// utils
import { cloneDeep } from 'lodash'
import generateUniqueId from '../../utils/generateUniqueId'
import createDiceArray from '../../utils/createDiceArray'

// constants
import { VIEWS_NAMES } from '../../constants/viewsNames'
import { MECHS } from '../../constants/mechs'

// vuex
import { mapActions } from 'vuex'
import { GET_LANCES } from '../../store/types'

export default {
  name: 'Lances',

   data() {
    return {
      lances: [],
      lance1: {
        lance: 1,
        name: 'Lance 1',
        mechs: []
      },
      lance2: {
        lance: 2,
        name: 'Lance 2',
        mechs: []
      },
      mechsData: MECHS,
      mechSelected1: '',
      mechSelected2: ''
    }
  },

  methods: {
    /**
     * Action used to update the lances.
     */
    ...mapActions([GET_LANCES]),

    addToLance(lance) {
      if (lance === '1') {
        if (!this.mechSelected1 || this.lance1.mechs.length > 3) return
        let mech1 = cloneDeep(this.mechSelected1)
        mech1.lance = 1
        mech1.index = this.lance1.mechs.length
        mech1.id = generateUniqueId('mech')
        mech1.baseDice = createDiceArray(mech1.originalBaseDice)
        mech1.optionalDice = createDiceArray(mech1.originalOptionalDice)
        this.lance1.mechs.push(mech1)
      } else if (lance === '2') {
        if (!this.mechSelected2 || this.lance2.mechs.length > 3) return
        let mech2 = cloneDeep(this.mechSelected2)
        mech2.lance = 2
        mech2.index = this.lance2.mechs.length
        mech2.id = generateUniqueId('mech')
        mech2.baseDice = createDiceArray(mech2.originalBaseDice)
        mech2.optionalDice = createDiceArray(mech2.originalOptionalDice)
        this.lance2.mechs.push(mech2)
      }
    },

    gotoBattle() {
      this.lances.push(this.lance1)
      this.lances.push(this.lance2)
      console.log(this.lances)
      this.GET_LANCES(this.lances)
        .then(() => {
          this.$router.push({ name: VIEWS_NAMES.BATTLE_VIEW })
        })
    }
  },

  mounted() {
    console.log(this.mechsData)
  }
}
</script>

<style lang='scss'>
#mech-selection {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  position: relative;
  padding: 1rem;

  .lance {
    display: flex;
    align-items: flex-start;
    margin-bottom: 60px;
    .selection-box {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-right: 24px;
      height: 312px;
      label {
        margin-bottom: 8px;
      }
      input {
        width: 240px;
        box-sizing: border-box;
        margin-bottom: 24px;
      }
      select {
        width: 240px;
        margin-bottom: 24px;
      }
    }
    .selection-display {
      display: flex;
      & div {
        margin-right: 8px;
      }
    }
  }
  button {
    width: 240px;
    border-radius: 3px;
    background-color: red;
    color: white;
    height: 32px;
    font-weight: bold;
    &.battle-button {
      align-self: center;
    }
  }
}
</style>
