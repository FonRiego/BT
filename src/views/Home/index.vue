<template lang='pug'>
  main
    button(
      @click='gotoBattle'
    )
      span Go to battle
</template>

<script>
// constants
import { VIEWS_NAMES } from '../../constants/viewsNames'

export default {
  name: 'Home',

  methods: {
    gotoBattle() {
      this.$router.push({ name: VIEWS_NAMES.BATTLE_VIEW })
    }
  }
}
</script>

<style lang='scss'>

</style>
