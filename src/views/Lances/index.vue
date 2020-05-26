<template lang='pug'>
  main
    form(@submit.prevent)
      input(
        label='Nombre de Lanza 1'
        v-model='lancesData.lance1Name'
      )

      input(
        label='Nombre de Lanza 2'
        v-model='lancesData.lance2Name'
      )

      button(
        submit
        @click='submitLances'
      )
        span Guardar lanzas

    button(
      @click='gotoBattle'
    )
      span Go to battle

    p {{ stateLance1Name }} 
</template>

<script>
// constants
import { VIEWS_NAMES } from '../../constants/viewsNames'

// vuex
import { mapActions, mapState } from 'vuex'
import { GET_LANCES } from '../../store/types'

export default {
  name: 'Lances',

   data() {
    return {
      lancesData: {
        lance1Name: null,
        lance2Name: null
      }
    }
  },

  computed: {
    ...mapState({
      stateLance1Name: 'lance1Name',
      stateLance2Name: 'lance2Name'
    }),
  },

  methods: {
    /**
     * Action used to update the lances.
     */
    ...mapActions([GET_LANCES]),

    submitLances() {
      this.GET_LANCES(this.lancesData)
    },

    gotoBattle() {
      this.$router.push({ name: VIEWS_NAMES.BATTLE_VIEW })
    }
  }
}
</script>

<style lang='scss'>

</style>
