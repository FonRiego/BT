<template lang='pug'>
#battle
  .lance1(:class='{ "disabled": !isLance1Active }')
    .mech-container(
      v-for='(mech, index) in lancesData.lance1'
      :key='index'
    )
      Mech(
        :mech='mech'
        :active='isLance1Active'
        :index='index'
        @toogleRolled='(obj) => handleToogleRolled({ ...obj, lance: "lance1", mechIndex: index})'
      )
  
  .middle
    h1 {{ 'Turn ' + turn +  ' --- ' + statePhase + ' ' + lanceName() }}
    //- dice selection button
    button(
      v-if='isDiceSelectionPhase'
      @click='diceSelectionFinished'
    )
      span Continue
    //- dice rolling button
    button(
      v-if='isDiceAllocatingPhase'
      @click='diceAllocatingFinished'
    )
      span Continue

  .lance2(:class='{ "disabled": !isLance2Active }')
    .mech-container(
      v-for='(mech, index) in lancesData.lance2'
      :key='index'
    )
      Mech(
        :mech='mech'
        :active='isLance2Active'
        :index='index'
        reversed=true
        @toogleRolled='(obj) => handleToogleRolled({ ...obj, lance: "lance2", mechIndex: index})'
      )
</template>

<script>
// Vue
// import Vue from 'vue'

// components
import Mech from '../../components/Mech'

// constants
import { VIEWS_NAMES } from '../../constants/viewsNames'
import { 
  DICE_SELECTION,
  // ALL_PHASES,
  COMBINED_PHASES,
  DICE_ROLLING,
  DICE_ALLOCATING
} from '../../constants/battlePhases'

// vuex
import { mapState, mapActions } from 'vuex'
import { GET_PHASE } from '../../store/types'


export default {
  name: 'Battle',

  data() {
    return {
      lancesData: {
        lance1: [],
        lance2: []
      },
      turn: null,
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
      return COMBINED_PHASES.includes(this.statePhase)
    },
    isDiceSelectionPhase() {
      return this.statePhase === DICE_SELECTION
    },
    isDiceRollingPhase() {
      return this.statePhase === DICE_ROLLING
    },
    isDiceAllocatingPhase() {
      return this.statePhase === DICE_ALLOCATING
    }
  },

  components: { Mech },

  methods: {
    ...mapActions([GET_PHASE]),

    // Battle Summary
    startBattle() {
      this.turn = 1
      this.startTurn()
    },
    startTurn() {
      console.log(this.statePhase)
      this.GET_PHASE(DICE_SELECTION)
        .then((data) => {
          console.log(data)
        })
      console.log(this.statePhase)
      // this.startLanceTurn()
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
      this.toogleLance()
      this.GET_PHASE(DICE_ALLOCATING)
    
      // this.rollDice()
    },
    async diceSelectionFinished() {
      this.GET_PHASE(DICE_ROLLING)
      
      await this.applyHeatLance(this.lancesData.lance1)
      await this.applyHeatLance(this.lancesData.lance2)
      await this.clickCooled()   
      await this.clickAllDice()

      this.startLanceTurn()
    },
    diceAllocatingFinished() {
      console.log('dice allocating finished')
    },

    applyHeatLance(lance) {
      lance.forEach(mech => this.applyHeatMech(mech))
    },
    applyHeatMech(mech) {
      console.log(mech)
    },
    // to roll just one dice
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
    gainHeat() {

    },
    clickCooled() {
      document.getElementsByClassName('cooled').forEach(cooledDice => {
        cooledDice.click()
      })
    },

    clickAllDice() {
      document.getElementsByClassName('dice').forEach(cooledDice => {
        cooledDice.click()
      })
    },
    /**
     * This handler receives indexes of mech and optional dice and the value of
     * willBeRolled and will set that property in the mech object inside lance.
     */
    handleToogleRolled(object) {
      console.log(object)
      // console.log(this.lancesData[lance][mechIndex])
      // Vue.set(this.lancesData[lance][mechIndex].optionalDice[diceIndex], 'willBeRolled', willBeRolled)
    }
  },

  mounted() {
    this.lancesData.lance1 = this.stateLance1
    this.lancesData.lance2 = this.stateLance2
    this.startBattle()
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.stateLance1.length === 0 || vm.stateLance2.length === 0) {
        vm.$router.push({ name: VIEWS_NAMES.LANCES_VIEW })
      }
    })
  }
}
</script>

<style lang='scss'>
#battle {
  height: 100vh;
  max-height: 100vh;
  min-height: 100vh;
  .lance1, .lance2 {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(green, 0.1);
    height: calc((100% - 40px) / 2);
    & .mech-container {
      margin-left: 36px;
    }
    &.disabled {
      background-color: rgba(red, 0.1);
    }

  }
  .middle {
    position: relative;
    h1 {
      font-size: 32px;
      line-height: 40px;
      text-align: center;
      color: blue;
      background-color: rgba(blue, 0.1)
    }
    button {
      height: 32px;
      width: 144px;
      position: absolute;
      top: 4px;
      right: 24px;
      border-radius: 3px;
      background-color: red;
      color: white;
      font-weight: bold;
    }
  }
}

</style>
