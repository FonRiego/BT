// utils
import { cloneDeep } from 'lodash'
import generateUniqueId from '../utils/generateUniqueId'

// constants
import DICES from '../constants/dice'


const createDiceArray = (diceNames) => {
  let diceArray = []
  diceNames.forEach(dice => {
    let newDice = cloneDeep(DICES[dice])
    newDice.id = generateUniqueId('dice')
    diceArray.push(newDice)
  })
  return diceArray
}

export default createDiceArray