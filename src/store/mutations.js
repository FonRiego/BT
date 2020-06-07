// types
import * as types from './types'

export default {
  [types.SET_LANCES]: (state, lances) => {
    console.log(lances)
    state.lances = lances
  },
  [types.SET_PHASE]: (state, phase) => {
    state.phase = phase
  }
}