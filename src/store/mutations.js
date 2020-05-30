// types
import * as types from './types'

export default {
  [types.SET_LANCES]: (state, lancesData) => {
    state.lance1Name = lancesData.lance1Name
    state.lance2Name = lancesData.lance2Name
    state.lance1 = lancesData.lance1
    state.lance2 = lancesData.lance2
  },
  [types.SET_PHASE]: (state, phase) => {
    state.phase = phase
  }
}