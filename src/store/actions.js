// types
import * as types from './types'

export default {
  [types.GET_LANCES]({ commit }, lancesData) {
    commit(types.SET_LANCES, lancesData)
    return lancesData
  }
}
