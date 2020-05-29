<template lang='pug'>
#battle
  .lance1
    .mech-container(
      v-for='(mech, index) in lancesData.lance1'
      :key='index'
    )
      Mech(
        :mech='mech'
      )
  .lance2
    .mech-container(
      v-for='(mech, index) in lancesData.lance2'
      :key='index'
    )
      Mech-Reverse(
        :mech='mech'
      )    
</template>

<script>
// components
import Mech from '../../components/Mech'
import MechReverse from '../../components/MechReverse'

// vuex
import { mapState } from 'vuex'


export default {
  name: 'Battle',

  data() {
    return {
      lancesData: {
        lance1: [],
        lance2: []
      }
    }
  },

  computed: {
    ...mapState({
      stateLance1Name: 'lance1Name',
      stateLance2Name: 'lance2Name',
      stateLance1: 'lance1',
      stateLance2: 'lance2'
    }),
  },

  components: { Mech, MechReverse},

  mounted() {
    this.lancesData.lance1 = this.stateLance1
    this.lancesData.lance2 = this.stateLance2
  }
}
</script>

<style lang='scss'>
#battle {
  .lance1, .lance2 {
     display: flex;
      & .mech-container {
        margin-left: 24px;
      }
  }
  .lance1 {
    margin-bottom: 16px;
  }
}

</style>
