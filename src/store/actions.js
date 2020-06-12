// types
import * as types from './types'

export default {
  [types.GET_LANCES]({ commit }, lances) {
    commit(types.SET_LANCES, lances)
    return lances
  },
  [types.GET_PHASE]({ commit }, phase) {
    commit(types.SET_PHASE, phase)
    return phase
  }
}
