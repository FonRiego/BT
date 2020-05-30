<template lang='pug'>
#battle
  .lance1
    .mech-container(
      v-for='(mech, index) in lancesData.lance1'
      :key='index'
    )
      Mech(
        :mech='mech'
        :active='isLance1Active'
      )
  
  .middle
    h1 {{ 'Turn ' + turn +  ' --- ' + phase + ' ' + lanceName() }}
    button(
      v-if='isDiceSelectionPhase'
      @click='diceSelectionFinished()'
    )
      span Continue

  .lance2
    .mech-container(
      v-for='(mech, index) in lancesData.lance2'
      :key='index'
    )
      Mech(
        :mech='mech'
        :active='isLance2Active'
        reversed=true
      )
</template>

<script>
// components
import Mech from '../../components/Mech'

// constants
import { 
  DICE_SELECTION,
  // ALL_PHASES,
  COMBINED_PHASES
} from '../../constants/battlePhases'

// vuex
import { mapState } from 'vuex'


export default {
  name: 'Battle',

  data() {
    return {
      lancesData: {
        lance1: [],
        lance2: []
      },
      turn: null,
      phase: null,
      activeLance: null
    }
  },

  computed: {
    ...mapState({
      stateLance1Name: 'lance1Name',
      stateLance2Name: 'lance2Name',
      stateLance1: 'lance1',
      stateLance2: 'lance2',
      statePhase: 'phase'
    }),
    isLance1Active() {
      return this.activeLance === 1 || this.activeLance === null
    },
    isLance2Active() {
      return this.activeLance === 2 || this.activeLance === null
    },
    isCombinedPhase() {
      return COMBINED_PHASES.includes(this.phase)
    },
  },

  components: { Mech },

  methods: {
    // Battle Summary
    startBattle() {
      this.turn = 1
      this.startTurn()
    },
    startTurn() {
      this.startLanceTurn()
      // this.toogleLance()
      // this.startLanceTurn(this.activeLance)
      // this.checkFinal()
    },
    checkFinal() {
      console.log(this.activeLance)
      console.log('check final y si no startTurn de nuevo')
    },

    // Lance Turn
    startLanceTurn() {
      console.log(this.activeLance)
      this.phase = DICE_SELECTION
      // this.applyHeat()
      // this.rollDice()
    },
    diceSelectionFinished() {
      console.log('dice selection finished', this.activeLance)
    },
    applyHeat() {
      
    },
    rollDice() {

    },

    // Auxiliary methods
    toogleLance() {
      if (this.activeLance === 1) {
        this.activeLance = 2
      } else {
        this.activeLance = 1
      }
    },
    lanceName() {
      if (this.isCombinedPhase) return ''
      if (this.activeLance === 1) {
        return this.stateLance1Name
      } else if (this.activeLance === 2) {
        return this.stateLance2Name
      }
    },
    isDiceSelectionPhase() {
      return this.phase === DICE_SELECTION
    }
  },

  mounted() {
    this.lancesData.lance1 = this.stateLance1
    this.lancesData.lance2 = this.stateLance2
    this.startBattle()
  }
}
</script>

<style lang='scss'>
#battle {
  padding: 16px;
  .lance1, .lance2 {
     display: flex;
     justify-content: center;
      & .mech-container {
        margin-left: 36px;
      }
  }
  .middle {
    position: relative;
    h1 {
      font-size: 40px;
      line-height: 48px;
      text-align: center;
      padding: 16px;
      color: green;
      background-color: rgba(green, 0.1)
    }
    button {
      height: 32px;
      width: 144px;
      position: absolute;
      top: 24px;
      right: 24px;
      border-radius: 3px;
      background-color: red;
      color: white;
      font-weight: bold;
    }
  }
}

</style>
