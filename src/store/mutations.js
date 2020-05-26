// types
import * as types from './types'

export default {
  [types.SET_LANCES]: (state, lancesData) => {
    console.log(state)
    console.log(lancesData)
    state.lance1Name = lancesData.lance1Name
    state.lance2Name = lancesData.lance2Name
    // state.lance1 = lancesData.lance1
    // state.lance2 = lancesData.lance2
  }
}