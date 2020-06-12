<template lang='pug'>
#battle
  .lance(
    v-for='lance in lances'
    :key='lance.lance'
    :class='{ "disabled": !isLanceActive, "reversed": lance.lance === 2 }'
  )
    .mech-container
      .mech(
        v-for='mech in lance.mechs'
        :key='mech.id'
        :class='mechClassObject(lance, mech)'
        :id='mech.id'
        @click='mechClick(mech)'
      ) 
        img(
          :src='mech.imageSource'
          height='277'
          width='200'
        )
        .effects-container(:class='{ "reversed": lance.lance === 2 }')
          .targets-container
            .assigned-target(
              v-for='(target, index) in mech.assignedTargets'
            )
              img(
                :src='target.image'
                height='20'
                width='20'
              )
            .target(v-for='target in targets(mech)')
          
          .dodge-container
            .dodge(
              v-for='dodge in mech.dodge'
              @click='dodgeDamageHandler(mech)'
              :class='{ "disabled": !isEffectsResolvingPhase && !resolvingDodgeMechId }'
            )

        .life-display
          .aimed
            span D: {{ mech.damageAimed }}  H: {{ mech.heatAimed}}
          span >>>
          .current
            span {{ mech.currentStructure }}/{{ mech.maxStructure }}  H: {{ mech.heat }}

        .dice-container
          .base-dice(
            v-for='(dice, index) in mech.baseDice'
            :key='dice.id'
          )
            .dice(
              :class='diceClassObject(lance, dice)'
              @click='diceClick(dice, optional=false, index, mech.baseDice, mech)'
            )
              img(
                v-if='dice.rolledFace'
                :src='dice.rolledFace.image'
                height='36'
                width='36'
              )

          .separator(v-if='mech.optionalDice.length > 0')

          .optional-dice(
            v-for='(dice, index) in mech.optionalDice'
            :key='dice.id'
          )
            .dice(
              :class='diceClassObject(lance, dice)'
              @click='diceClick(dice, optional=true, index, mech.optionalDice, mech)'
            )
              img(
                v-if='dice.rolledFace'
                :src='dice.rolledFace.image'
                height='36'
                width='36'
              )
  
    .middle(v-if='lance.lance === 1')
      .turn-and-phase
        h2 {{ 'Turn ' + turn }}
        h2 {{ statePhase }}
        h2(v-if='activeLance') {{ lances[activeLance-1].name }}

      .winner(v-if='victoriousLance')
        h1 {{ victoriousLance }}
      .actions(v-else)
        h2(v-if='isDiceSelectionPhase') Select optional dice to be rolled and base ones to be cooled.
        h2(v-if='isDiceResolvingPhase && !diceSelected && !isChoice && !selectToReroll && !checkAllDiceUsed') Select a dice to be used.
        h2(v-if='isDiceResolvingPhase && checkAllDiceUsed && isLance1Active') Continue to next lance.
        h2(v-if='isDiceResolvingPhase && checkAllDiceUsed && !isLance1Active') Continue to next phase.
        h2(v-if='isEffectsResolvingPhase && !checkAllEffectsResolved && !resolvingDodgeMechId') Choose an effect to resolve.
        h2(v-if='isEffectsResolvingPhase && checkAllEffectsResolved') Click continue for next turn.

        .dialog(v-if='isChoice && !selectObjective && !showTacticMenu && !selectToReroll && !assigningTarget')
          h2 Select action.
          .buttons
            button(
              v-if='isDamageToAssign'
              @click='prepareDamageAssignment'
            )
              span Assign Damage
            button(
              v-if='isDodgeToApply'
              @click='assignDodge'  
            )
              span Get Dodge
            button(
              v-if='isTacticToResolve'
              @click='prepareTacticMenu'  
            )
              span Use Tactic
        
        .dialog(v-if='isDiceResolvingPhase && diceSelected && assigningDamage')
          h2 Select mech to receive damage.
          .buttons
            button(@click='wasteDamage')
              span Waste Damage  

        .dialog(v-if='showTacticMenu')
          h2 Select tactic to apply
          .buttons
            button(@click='chooseDiceToReroll')
              span Reroll
            button(@click='prepareAddTarget')
              span Add Target
            button(@click='useSkill')
              span Use Skill
            button(@click='wasteTactic')
              span Waste Tactic
        
        .dialog(v-if='selectToReroll') 
          h2 Select another dice to reroll.
          .buttons
            button(@click='wasteReroll')
              span Waste Reroll

        .dialog(v-if='assigningTarget')
          h2 Select a mech to add a target.
          .buttons
            button(@click='wasteTarget')
              span Waste Target
        
        .dialog(v-if='isEffectsResolvingPhase && resolvingDodgeMechId')
          h2 Select effect to dodge.
          .buttons
            button(
              v-if='checkDamageAimed'
              @click='dodgeDamage'
            )
              span Dodge Damage
            button(
              v-if='checkHeatAimed'
              @click='dodgeHeat'
            )
              span Dodge Heat

      .phase-buttons
        //- dice selection button
        button(
          v-if='isDiceSelectionPhase'
          @click='diceSelectionFinished'
        )
          span Continue
        //- dice resolving button
        button(
          v-if='isDiceResolvingPhase && checkAllDiceUsed'
          @click='diceResolvingFinished'
        )
          span Continue
        //- effects resolving button
        button(
          v-if='isEffectsResolvingPhase && checkAllEffectsResolved && !victoriousLance'
          @click='effectsResolvingFinished'
        )
          span Continue
        //- battle finished
        button(
          v-if='victoriousLance'
          @click='endBattle'
        )
          span Back


</template>

<script>
// utils
import { cloneDeep } from 'lodash'
import generateUniqueId from '../../utils/generateUniqueId'
import createDiceArray from '../../utils/createDiceArray'
import dateToString from '../../utils/dateToString'

// constants
import { VIEWS_NAMES } from '../../constants/viewsNames'
import { 
  DICE_SELECTION,
  // ALL_PHASES,
  COMBINED_PHASES,
  DICE_ROLLING,
  DICE_RESOLVING,
  EFFECTS_RESOLVING
} from '../../constants/battlePhases'
import {
  NOTY_COOLING,
  NOTY_DAMAGE,
  NOTY_DAMAGE_DODGED,
  NOTY_HEAT,
  NOTY_DODGE,
  NOTY_HEAT_DODGED,
  NOTY_TARGET,
  NOTY_STRUCTURE,
  NOTY_DESTROYED
} from '../../constants/notificationTypes'
import { COOLING } from '../../constants/dice'

// vuex
import { mapState, mapActions } from 'vuex'
import { GET_PHASE } from '../../store/types'

const diceActionBlank = {
  damage: 0,
  heat: 0,
  tactic: 0,
  dodge: 0,
  image: '',
  diceId: '',
  originalMechId: '',
  mechLance: 0,
  objectiveLance: 0,
  objectiveMechId: '',
  type: ''
}

export default {
  name: 'Battle',

  data() {
    return {
      lances: null,
      turn: 0,
      activeLance: null,
      victoriousLance: null,
      diceSelected: false,
      selectObjective: false,
      assigningDamage: false,
      assigningTarget: false,
      showTacticMenu: false,
      selectToReroll: false,
      resolvingDodgeMechId: '',
      diceAction: cloneDeep(diceActionBlank)
    }
  },

  computed: {
    ...mapState({
      stateLances: 'lances',
      statePhase: 'phase'
    }),
    isLance1Active() {
      return this.activeLance === 1
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
    isDiceResolvingPhase() {
      return this.statePhase === DICE_RESOLVING
    },
    isEffectsResolvingPhase() {
      return this.statePhase === EFFECTS_RESOLVING
    },
    isDamageToAssign() {
      return this.diceAction.damage > 0 || this.diceAction.heat > 0
    },
    isDodgeToApply() {
      return this.diceAction.dodge > 0
    },
    isTacticToResolve() {
      return this.diceAction.tactic > 0
    },
    isChoice() {
      return ((this.isDamageToAssign && this.isDodgeToApply) ||
        (this.isDamageToAssign && this.isTacticToResolve) ||
        (this.isDodgeToApply && this.isTacticToResolve))
    },
    checkAllDiceUsed() {
      return this.activeLance > 0 && this.lances[this.activeLance -1].mechs.every(mech => this.checkUsedDiceMech(mech))
    },
    checkAllEffectsResolved() {
      return this.lances.every(lance => lance.mechs.every(mech => this.checkEffectsResolvedMech(mech)))
    },

    checkDamageAimed() {
      return this.lances.some(lance => lance.mechs.some(mech => this.checkIsDamageAimedMech(mech)))
    },

    checkHeatAimed() {
      return this.lances.some(lance => lance.mechs.some(mech => this.checkIsHeatAimedMech(mech)))
    }
  },

  methods: {
    ...mapActions([GET_PHASE]),

    checkUsedDiceMech(mech) {
      return mech.baseDice.every(dice => dice.used) && mech.optionalDice.every(dice => dice.used)
    },

    checkEffectsResolvedMech(mech) {
      return (mech.damageAimed === 0 && mech.heatAimed === 0) || mech.dodge === 0
    },

    checkIsDamageAimedMech(mech) {
      return mech.id === this.resolvingDodgeMechId && mech.damageAimed > 0
    },

    checkIsHeatAimedMech(mech) {
      return mech.id === this.resolvingDodgeMechId && mech.heatAimed > 0
    },

    checkCanDodge(mech) {
      return mech.damageAimed > 0 || mech.heatAimed > 0
    },

    isLanceActive(lance) {
      return this.activeLance === lance.lance || this.activeLance === null
    },

    isMechClickable(mech) {
      if (this.assigningDamage) {
        return this.diceAction.objectiveLance === mech.lance && mech.targets > mech.assignedTargets.length && !mech.destroyed
      } else {
        return this.diceAction.objectiveLance === mech.lance
      }
    },

    mechClassObject(lance, mech) {
      return {
        'reversed': lance.lance === 2,
        'destroyed': mech.destroyed,
        'active': this.isLanceActive(lance),
        'clickable': this.isMechClickable(mech)
      }
    },

    diceClassObject(lance, dice) {
      return [
        dice.color,
        {
          'disabled': !this.isLanceActive(lance) || dice.used,
          'discarded': !dice.willBeRolled,
          'cooled': dice.willBeCooled,
          'selected': dice.selected
        }
      ]
    },

    // Battle Summary
    startBattle() {
      this.startTurn()
    },

    startTurn() {
      this.turn += 1
      this.GET_PHASE(DICE_SELECTION)
    },

    // Lance Turn
    startLanceTurn() {
      console.log('start lance turn')
      this.toogleLance()
      this.GET_PHASE(DICE_RESOLVING)
    },

    checkEffects() {
      this.GET_PHASE(EFFECTS_RESOLVING)
    },

    dodgeDamageHandler(mech) {
      if(!this.isEffectsResolvingPhase || mech.dodge === 0) return
      if (mech.damageAimed === 0 && mech.heatAimed === 0) {
        mech.dodge = 0
      } else {
        this.resolvingDodgeMechId = mech.id
      }
    },

    dodgeDamage() {
      this.lances.forEach(lance => {
        lance.mechs.forEach(mech => {
          if (mech.id === this.resolvingDodgeMechId) {
            mech.damageAimed -= 1
            mech.dodge -= 1
            let mechToNoty = {
              id: mech.id
            }
            this.notification(mechToNoty, NOTY_DAMAGE_DODGED, 1)
          }
        })
      })
      this.resolvingDodgeMechId = ''
    },

    dodgeHeat() {
      this.lances.forEach(lance => {
        lance.mechs.forEach(mech => {
          if (mech.id === this.resolvingDodgeMechId) {
            mech.heatAimed -= 1
            mech.dodge -= 1
            let mechToNoty = {
              id: mech.id
            }
            this.notification(mechToNoty, NOTY_HEAT_DODGED, 1)
          }
        })
      })
      this.resolvingDodgeMechId = ''
    },

    applyFinalDamages() {
      this.lances.forEach(lance => {
        lance.mechs.forEach(mech => {
          if (mech.damageAimed > 0) {
            mech.currentStructure -= mech.damageAimed
          }
          if (mech.heatAimed > 0) {
            mech.heat += mech.heatAimed
          }
          mech.damageAimed = 0
          mech.heatAimed = 0
          mech.dodge = 0
          mech.assignedTargets = []
          mech.targets = mech.originalTargets
        })
      })
    },

    checkDestroyed() {
      // calor, de momento lo dejo en que a 5 es destruido
      
      this.lances.forEach(lance => {
        lance.mechs.forEach(mech => {
          if (mech.currentStructure <= 0 || mech.heat >= 5) {
            mech.destroyed = true
            let mechToNoty = {
              id: mech.id
            }
            this.notification(mechToNoty, NOTY_DESTROYED, 0)
          }
        })
      })
    },

    resetLances() {
      this.diceSelected = false
      this.selectObjective = false
      this.assigningDamage = false
      this.assigningTarget = false
      this.showTacticMenu = false
      this.selectToReroll = false
      this.diceAction = cloneDeep(diceActionBlank)
      this.copyOriginalDice()
      this.activeLance = null
    },

    checkForVictory() {
      let lance1IsDestroyed = this.lances[0].mechs.every(mech => mech.destroyed)
      let lance2IsDestroyed = this.lances[1].mechs.every(mech => mech.destroyed)
      if (!lance1IsDestroyed && lance2IsDestroyed) {
        this.victoriousLance = `${this.lances[0].name} is the winner.`
      } else if (lance1IsDestroyed && !lance2IsDestroyed) {
        this.victoriousLance = `${this.lances[1].name} is the winner.`
      } else if (lance1IsDestroyed && lance2IsDestroyed) {
        this.victoriousLance = 'Both lances are destroyed'
      } else {
        this.startTurn()
      }
    },

    endBattle() {
      let lance1 = {
        tons: 0,
        mechs: []
      }
      this.lances[0].mechs.forEach(mech => {
        let mechStatus = {
          name: mech.fullName,
          tons: mech.tons,
          status: `H: ${mech.heat}---St: ${mech.currentStructure}/${mech.maxStructure}---Destroyed: ${mech.destroyed}`
        }
        lance1.tons += mech.tons
        lance1.mechs.push(mechStatus)
      })

      let lance2 = {
        tons: 0,
        mechs: []
      }
      this.lances[1].mechs.forEach(mech => {
        let mechStatus = {
          name: mech.fullName,
          tons: mech.tons,
          status: `H: ${mech.heat}---St: ${mech.currentStructure}/${mech.maxStructure}---Destroyed: ${mech.destroyed}`
        }
        lance2.tons += mech.tons
        lance2.mechs.push(mechStatus)
      })

      let battle = {
        lance1,
        victoriousLance: this.victoriousLance,
        lance2
      }

      let blob = new Blob([JSON.stringify(battle, null, 2)],{type: 'text/plain'});
      let fileName = `battle_${dateToString(Date.now())}`
			this.downloadBattle(blob, fileName)
       
      this.$router.push({ name: VIEWS_NAMES.LANCES_VIEW })
    },

    downloadBattle(blob,name) {
      let url = URL.createObjectURL(blob)
      let div = document.createElement("div")
      let anch = document.createElement("a")

      document.body.appendChild(div);
      div.appendChild(anch);

      anch.innerHTML = "&nbsp;";
      div.style.width = "0";
      div.style.height = "0";
      anch.href = url;
      anch.download = name;
      
      let ev = new MouseEvent("click",{});
      anch.dispatchEvent(ev);
      document.body.removeChild(div);
    },
    

    // dice click
    diceClick(dice, optional, index, array, mech) {
      if (this.statePhase === DICE_SELECTION) {
        if (optional) {
          this.toogleWillBeRolled(dice)
        } else if (!optional) {
          this.toogleWillBeCooled(dice)
        }
      }

      if (this.statePhase === DICE_ROLLING) {
        if (!dice.willBeRolled) return
        if (dice.willBeCooled) {
          this.transformCooledDice(index, array)
        } else if (!dice.rolledFace) {
          this.rollDice(dice)
        }
      }

      if (this.selectToReroll) {
        this.rollDice(dice)
        // añadir noty al reroll????
        this.diceAction.tactic -= 1
        this.diceAction.objectiveLance = 0
        this.selectToReroll = false
        this.showTacticMenu = false
        this.setDiceToUnused(this.diceAction.diceId)
        this.diceSelected = true
        this.setDiceToSelected(this.diceAction.diceId)
        
        this.changesAfterApplyDice()

        return
      }

      /**
       * Meter un if para fase DICE_RESOLVING donde si tengo a true algún flag que implique qyue voy a rerollear, llamar
       * a un método para reroll. Enganchar en él como else ifs los ifs de debajo.
       */

      if (this.statePhase === DICE_RESOLVING && dice.type === 'COOLING') {
        const cooling = dice.rolledFace.cooling
        if (mech.heat > 0 && cooling > 0) {
          this.notification(mech, NOTY_COOLING, cooling)
        }
        mech.heat -= cooling
        if (mech.heat <= 0) mech.heat = 0
        dice.used = true
      }

      if (this.statePhase === DICE_RESOLVING &&
        !this.diceSelected && 
        (dice.type === 'HARD_ATTACK' || dice.type === 'SOFT_ATTACK' || dice.type === 'HEAT_ATTACK' || dice.type === 'COMMAND')
      ) {
        this.diceAction.damage = dice.rolledFace.damage
        this.diceAction.tactic = dice.rolledFace.tactic
        this.diceAction.heat = dice.rolledFace.heat
        this.diceAction.image = dice.rolledFace.image
        this.diceAction.originalMechId = mech.id
        this.diceAction.type = dice.type
        this.diceAction.diceId = dice.id
        this.diceAction.mechLance = mech.lance

        this.setDiceToSelected(dice.id)
        this.diceSelected = true

        if (this.diceAction.damage === 0 && this.diceAction.tactic === 0 && this.diceAction.heat === 0) {
          dice.used = true
          this.diceSelected = false
          this.setDiceToUnselected(dice.id)
          this.diceAction = cloneDeep(diceActionBlank)
        } else if (this.diceAction.tactic === 0) {
          this.prepareDamageAssignment()
        } else if (this.diceAction.damage === 0 && this.diceAction.heat === 0) {
          this.prepareTacticMenu()
        }
      }

      if (this.statePhase === DICE_RESOLVING &&
        !this.diceSelected && 
        dice.type === 'DODGE'
      ) {
        this.diceAction.tactic = dice.rolledFace.tactic
        this.diceAction.dodge = dice.rolledFace.dodge
        this.diceAction.originalMechId = mech.id
        this.diceAction.type = dice.type
        this.diceAction.diceId = dice.id
        this.diceAction.mechLance = mech.lance

        this.setDiceToSelected(dice.id)
        this.diceSelected = true

        if (this.diceAction.dodge === 0 && this.diceAction.tactic === 0) {
          dice.used = true
          this.diceSelected = false
          this.setDiceToUnselected(dice.id)
          this.diceAction = cloneDeep(diceActionBlank)
        } else if (this.diceAction.tactic === 0) {
          this.assignDodge()
        } else if (this.diceAction.dodge === 0) {
          this.prepareTacticMenu()
        }
      }
    },

    /**
     * After applying one of the effects of an active dice, determine what to do
     * based in the possible actions left in the dice.
     */
    changesAfterApplyDice() {
      if (this.isDamageToAssign && (!this.isTacticToResolve && !this.isDodgeToApply)) {
        this.prepareDamageAssignment()
      } else if (this.isTacticToResolve && (!this.isDamageToAssign && !this.isDodgeToApply)) {
        this.prepareTacticMenu()
      } else if (this.isDodgeToApply && (!this.isDamageToAssign && !this.isTacticToResolve)) {
        this.assignDodge()
      } else if (!this.isDamageToAssign && !this.isTacticToResolve && !this.isDodgeToApply) {
        this.setDiceToUsed(this.diceAction.diceId)
        this.setDiceToUnselected(this.diceAction.diceId)
        this.diceSelected = false
        this.diceAction = cloneDeep(diceActionBlank)
      }
    },

    prepareDamageAssignment() {
      this.selectObjective = true
      this.assigningDamage = true
      if (this.diceAction.mechLance === 1) {
        this.diceAction.objectiveLance = 2
      } else if (this.diceAction.mechLance === 2) {
        this.diceAction.objectiveLance = 1
      }
    },

    prepareTacticMenu() {
      this.showTacticMenu = true
    },

    assignDodge() {
      const dodge = this.diceAction.dodge

      this.lances.forEach(lance => {
        lance.mechs.forEach(mech => {
          if (mech.id === this.diceAction.originalMechId) {
            mech.dodge += dodge
          }
        })
      })
      this.diceAction.dodge = 0

      let mechToNoty = {
        id: this.diceAction.originalMechId
      }
      this.notification(mechToNoty, NOTY_DODGE, dodge)
      this.changesAfterApplyDice()
    },

    mechClick(mech) {
      if (this.statePhase === DICE_RESOLVING && this.selectObjective && this.isMechClickable(mech)) {
        if (this.diceAction.type === 'HEAT_ATTACK') {
          const heat = this.diceAction.heat
          const damage = this.diceAction.damage

          if (heat > 0) {
            mech.heatAimed += heat
            this.notification(mech, NOTY_HEAT, heat)
          }
          if (damage > 0) {
            mech.damageAimed += damage
            this.notification(mech, NOTY_DAMAGE, damage)
          }

          let target = {
            damage,
            heat,
            image: this.diceAction.image
          }
          mech.assignedTargets.push(target)

          this.selectObjective = false
          this.assigningDamage = false
          this.setDiceToUsed(this.diceAction.diceId)
          this.diceAction = cloneDeep(diceActionBlank)
          this.changesAfterApplyDice()
        }
        if (this.assigningDamage) {
          // sobra diceAction.type si tengo flags como assigningDamage???? YO CREO QUE SI
          const damage = this.diceAction.damage
          mech.damageAimed += damage

          this.notification(mech, NOTY_DAMAGE, damage)

          let target = {
            damage,
            heat: 0,
            image: this.diceAction.image
          }
          mech.assignedTargets.push(target)

          this.diceAction.damage = 0

          this.selectObjective = false
          this.assigningDamage = false

          if (this.isTacticToResolve) {
            this.prepareTacticMenu()
          } else {
            this.setDiceToUsed(this.diceAction.diceId)
            this.diceSelected = false
            this.setDiceToUnselected(this.diceAction.diceId)
            this.diceAction = cloneDeep(diceActionBlank)
          }        
        }
        if(this.assigningTarget) {
          mech.targets += 1
          this.diceAction.tactic -= 1
          this.selectObjective = false
          this.assigningTarget = false

          this.notification(mech, NOTY_TARGET)
          this.changesAfterApplyDice()
        }
      }
    },

    /**
     * Method for create a notification over a mech when something has changed.
     */
    notification(mech, type, value) {
      let noty = document.createElement('DIV')
      noty.classList.add('noty')
      noty.classList.add(`${type}`)
      let setText = () => {
        let text
        if (type === NOTY_COOLING) {
          if (mech.heat < value) {
            text = `-${mech.heat} heat`
          } else {
            text = `-${value} heat`
          }
        }
        if (type === NOTY_HEAT) {
          text = `+${value} heat`
        }
        if (type === NOTY_HEAT_DODGED) {
          text = `-${value} heat`
        }
        if (type === NOTY_DAMAGE) {
          text = `+${value} damage`
        }
        if (type === NOTY_DAMAGE_DODGED) {
          text = `-${value} damage`
        }
        if (type === NOTY_DODGE) {
          text = `+${value} dodge`
        }
        if (type === NOTY_TARGET) {
          text = 'Target added'
        }
        if (type === NOTY_STRUCTURE) {
          text = `+${value} dodged`
        }
        if (type === NOTY_DESTROYED) {
          text = 'Destroyed'
        }
        return text
      }
      noty.appendChild(document.createTextNode(setText()))
      document.getElementById(`${mech.id}`).appendChild(noty)
      setTimeout(() => {
        noty.remove()
      }, 5000)
    },

    copyOriginalDice() {
      this.lances.forEach(lance => {
        lance.mechs.forEach(mech => {
          if (!mech.destroyed) {
            mech.baseDice = createDiceArray(mech.originalBaseDice)
            mech.optionalDice = createDiceArray(mech.originalOptionalDice)
          }
        })
      })
    },

    toogleWillBeRolled(dice) {
      dice.willBeRolled ? dice.willBeRolled = false : dice.willBeRolled = true
    },

    toogleWillBeCooled(dice) {
      if (dice.type === 'COOLING') return
      dice.willBeCooled ? dice.willBeCooled = false : dice.willBeCooled = true
    },

    async diceSelectionFinished() {
      this.GET_PHASE(DICE_ROLLING)
      
      // Apply heat for each mech.
      this.lances.forEach(lance => {
        lance.mechs.forEach(mech => this.applyHeatMech(mech))
      })

      /**
       * Remove unrolled dice for each mech. Needs to be called twice because
       * an array might have up to 2 optional dices, and the first array iterated
       * is not modified during the loop, so the index for the splice won't serve.
       */
      this.lances.forEach(lance => {
        lance.mechs.forEach(mech => {
          this.removeUnrolledDice(mech)
          this.removeUnrolledDice(mech)
        })
      })

      await this.clickCooled()   
      await this.clickAllDice()

      this.startLanceTurn()
    },

    diceResolvingFinished() {
      if (this.activeLance === 1) {
        this.toogleLance()
      } else {
        this.checkEffects()
      }
      console.log('dice resolving finished')
    },

    effectsResolvingFinished() {
      this.applyFinalDamages()
      this.checkDestroyed()
      this.resetLances()
      this.checkForVictory()
    },

    /**
     * Mech heat will be reduced by 1 for each optional dice that will not be
     * rolled.
     */
    applyHeatMech(mech) {
      mech.optionalDice.forEach(dice => {
        if (dice.willBeRolled) {
          mech.heat += 1
        }
      })
    },

    removeUnrolledDice(mech) {
      mech.optionalDice.forEach((dice, index) => {
        if (!dice.willBeRolled) {
          mech.optionalDice.splice(index, 1)
        }
      })
    },

    // to roll just one dice
    rollDice(dice) {
      const faceIndex = Math.round(Math.random()*5)
      dice.rolledFace = dice.faces[faceIndex]
    },


    chooseDiceToReroll() {
      this.showTacticMenu = false
      this.selectToReroll = true
      this.setDiceToUsed(this.diceAction.diceId)
      this.diceSelected = false
      this.diceAction.objectiveLance = this.diceAction.mechLance
    },

    prepareAddTarget() {
      this.showTacticMenu = false
      this.selectObjective = true
      this.assigningTarget = true
      if (this.diceAction.mechLance === 1) {
        this.diceAction.objectiveLance = 2
      } else if (this.diceAction.mechLance === 2) {
        this.diceAction.objectiveLance = 1
      }
    },

    useSkill() {
      console.log('skill')
    },

    wasteTactic() {
      this.diceAction.tactic -= 1
      this.showTacticMenu = false
      this.changesAfterApplyDice()
    },

    wasteDamage() {
      this.diceAction.damage = 0
      this.diceAction.heat = 0
      this.assigningDamage = false
      this.selectObjective = false
      this.changesAfterApplyDice()
    },

    wasteReroll() {
      this.diceAction.tactic -= 1
      this.diceAction.objectiveLance = 0
      this.selectToReroll = false
      this.showTacticMenu = false
      this.setDiceToUnused(this.diceAction.diceId)
      this.diceSelected = true
      this.setDiceToSelected(this.diceAction.diceId)
      this.changesAfterApplyDice()
    },

    wasteTarget() {
      this.diceAction.tactic -= 1
      this.selectObjective = false
      this.assigningTarget = false
      this.changesAfterApplyDice()
    },

    // Auxiliary methods
    targets(mech) {
      let possibleTargets = mech.targets - mech.assignedTargets.length
      return possibleTargets > 0 ? possibleTargets : 0
    },

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
        return this.stateLances[0].name
      } else if (this.activeLance === 2) {
        return this.stateLances[1].name
      }
    },

    clickCooled() {
      document.getElementsByClassName('cooled').forEach(cooledDice => {
        cooledDice.click()
      })
    },

    clickAllDice() {
      document.getElementsByClassName('dice').forEach(dice => {
        dice.click()
      })
    },

    /**
     * Method to get an array of base dice and substitute a given dice for a
     * Cooling one.
     */
    transformCooledDice(index, array) {
      const newCoolingDice = cloneDeep(COOLING)
      newCoolingDice.id = generateUniqueId('dice')
      array.splice(index, 1, newCoolingDice)
    },

    setDiceToUsed(diceId) {
      this.lances.forEach(lance => {
        lance.mechs.forEach(mech => {
          mech.baseDice.forEach(dice => {
            if (dice.id === diceId) dice.used = true
          })
          mech.optionalDice.forEach(dice => {
            if (dice.id === diceId) dice.used = true
          })
        })
      })
    },

    setDiceToUnused(diceId) {
      this.lances.forEach(lance => {
        lance.mechs.forEach(mech => {
          mech.baseDice.forEach(dice => {
            if (dice.id === diceId) dice.used = false
          })
          mech.optionalDice.forEach(dice => {
            if (dice.id === diceId) dice.used = false
          })
        })
      })
    },

    setDiceToSelected(diceId) {
      this.lances.forEach(lance => {
        lance.mechs.forEach(mech => {
          mech.baseDice.forEach(dice => {
            if (dice.id === diceId) dice.selected = true
          })
          mech.optionalDice.forEach(dice => {
            if (dice.id === diceId) dice.selected = true
          })
        })
      })
    },

    setDiceToUnselected(diceId) {
      this.lances.forEach(lance => {
        lance.mechs.forEach(mech => {
          mech.baseDice.forEach(dice => {
            if (dice.id === diceId) dice.selected = false
          })
          mech.optionalDice.forEach(dice => {
            if (dice.id === diceId) dice.selected = false
          })
        })
      })
    }

    // cancelDamageAssignment() {
    //   this.selectObjective = false
    //   this.assigningDamage = false
    //   if (!this.isChoice) {
    //     this.diceSelected = false
    //     this.setDiceToUnselected(this.diceAction.diceId)
    //     this.diceAction = cloneDeep(diceActionBlank)
    //   }
    // },

    // cancelTacticMenu() {
    //   this.showTacticMenu = false
    //   if (!this.isChoice) {
    //     this.diceSelected = false
    //     this.setDiceToUnselected(this.diceAction.diceId)
    //     this.diceAction = cloneDeep(diceActionBlank)
    //   }
    // },

    // cancelRerollDice() {
    //   this.showTacticMenu = true
    //   this.selectToReroll = false
    //   this.setDiceToUnused(this.diceAction.diceId)
    //   this.diceSelected = true
    // },

    // cancelAddTarget() {
    //   this.showTacticMenu = true
    //   this.selectObjective = false
    //   this.assigningTarget = false
    // },

    // to go back when choosing a dice
    // unblockDice() {
      // this.selectObjective = false
      // this.showTacticMenu = false
      // this.diceSelected = false
      // this.setDiceToUnselected(this.diceAction.diceId)
      // this.diceAction = cloneDeep(diceActionBlank)
    // }
  },

  mounted() {
    this.lances = cloneDeep(this.stateLances)
    console.log('lances', this.lances)
    this.startBattle()
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.stateLances.some(lance => lance.length === 0)) {
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
  display: flex;
  flex-direction: column;
  .lance {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(green, 0.1);
    & .mech-container {
      margin-left: 36px;
      display: flex;
      padding: 16px;
    }
    &.disabled {
      background-color: rgba(red, 0.1);
    }
    &.reversed {
      flex: 0 0 auto;
    }
    .middle {
      flex: 100 100 auto;
      position: relative;
      width: 100%;
      min-height: 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: rgba(blue, 0.1);
      .turn-and-phase {
        margin-left: 24px;
        max-width: 196px;
        min-width: 196px;
        h2 {
          font-size: 24px;
          line-height: 30px;
          font-weight: bold;
          color: blue;
        }
      }
      .winner {
        h1 {
          font-size: 3em;
          color: red;
        }
      }
      .actions {
        width: 100%;
        h2 {
          font-size: 24px;
          line-height: 30px;
          font-weight: bold;
          color: green;
          text-align: center;
        }
        .dialog {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .buttons {
            display: flex;
            justify-content: center;
            margin: 16px 0;
            button {
              margin: 0 8px;
              height: 32px;
              min-width: 120px;
              width: auto;
              border-radius: 3px;
              background-color: blue;
              color: white;
              font-weight: bold;
            }
          }
        }
      }

      .phase-buttons {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-right:24px;
        button {
          height: 32px;
          width: 120px;
          border-radius: 3px;
          background-color: red;
          color: white;
          font-weight: bold;
        }
      }
    }
  }
  .mech {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 8px;
    width: 222px;
    max-width: 222px;
    position: relative;

    &.reversed {
      flex-direction: column-reverse;
    }
    &.destroyed {
      pointer-events: none;
      position: relative;
      opacity: 0.5;
      &:before, &:after {
        position: absolute;
        left: 102px;
        content: ' ';
        height: 360px;
        width: 16px;
        background-color: red;
      }
      &:before {
        transform: rotate(30deg);
      }
      &:after {
        transform: rotate(-30deg);
      }
    }
    &.clickable {
      box-shadow: 0 0 2px 2px purple;
      cursor: pointer;
    }
    .effects-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 16px;
      width: 90%;
      &.reversed {
        padding-top: 0;
        padding-bottom: 4px;
      }
      .targets-container {
        display: flex;
        .assigned-target, .target {
          margin: 0 2px;
          border: 2px solid black;
        }
        .target {
          width: 20px;
          height: 20px;
        }
      }
      .dodge-container {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .dodge {
          width: 24px;
          height: 24px;
          margin: 0 2px;
          border: 2px solid black;
          box-sizing: border-box;
          border-radius: 50%;
          background-color: green;
          cursor: pointer;
          &.disabled {
            pointer-events: none;
            opacity: 0.5;
          }
        }
      }
    }
    .life-display {
      display:flex;
      justify-content: space-around;
      align-items: center;
      border: 2px solid red;
      background-color: rgba(red, 0.2);
      margin: 4px;
      border-radius: 3px;
      width: 100%;
      padding: 0.5em 0.125em;
      box-sizing: border-box;
      .aimed {
        color: blue;
      }
      .current {
        color: red;
        font-size: 1.5rem;
      }
    }

    .noty {
      position: absolute;
      top: 33%;
      min-width: 96px;
      max-width: 128px;
      height: 32px;
      margin: 0 auto;
      font-size: 20px;
      line-height: 28px;
      text-align: center;
      padding: 2px 8px;

      animation-name: hideit;
      -webkit-animation-name: hideit;
      animation-duration: 1s;
      -webkit-animation-duration: 1s;
      animation-timing-function: ease-in-out;
      -webkit-animation-timing-function: ease-in-out;
      animation-delay: 4s;
      -webkit-animation-delay: 4s;
      animation-iteration-count: 1;
      -webkit-animation-iteration-count: 1;
      animation-fill-mode: forwards;
      -webkit-animation-fill-mode: forwards;

      @keyframes hideit {
        0% { opacity: 0; }
        100% { opacity: 0; }  
      }

      & + .noty {
        top: calc(33% + 40px);
      }

      &.noty-cooling {
        border: 2px solid white;
        border-radius: 5px;
        background-color: blue;
        color: white;
      }

      &.noty-heat, &.noty-heat-dodged {
        border: 2px solid rgb(255, 115, 0);
        border-radius: 5px;
        background-color: yellow;
        color: rgb(255, 115, 0);
      }

      &.noty-damage, &.noty-damage-dodged {
        border: 2px solid black;
        border-radius: 5px;
        background-color: red;
        color: black;
      }

      &.noty-dodge {
        border: 2px solid white;
        border-radius: 5px;
        background-color: green;
        color: white;
      }

      &.noty-target {
        border: 2px solid black;
        border-radius: 5px;
        background-color: white;
        color: black;
      }

      &.noty-structure {
        border: 2px solid green;
        border-radius: 5px;
        background-color: white;
        color: green;
      }

      &.noty-destroyed {
        border: 2px solid white;
        border-radius: 5px;
        background-color: red;
        color: black;
      }
    }

    .dice-container {
      width: 100%;
      display: flex;
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
      .dice {
        width: 36px;
        height: 36px;
        margin: 0 3px;
        cursor: pointer;
        box-shadow: 0 0 1px 1px grey;
        border-radius: 2px;
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
      .disabled {
        opacity: 0.1;
        pointer-events: none;
      }
      .selected {
        box-shadow: 0 0 4px 5px pink;
      }
    }
  }
}

</style>
