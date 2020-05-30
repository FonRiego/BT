/**
 * @property {String} lance1Name Name of lance 1 team.
 * @property {String} lance2Name Name of lance 2 team.
 * @property {Array} lance1 Lance 1 array of mechs.
 * @property {Array} lance2 Lance 2 array of mechs.
 * @property {String} phase Current phase of the battle.
 */

const getDefaultState = () => ({
  lance1Name: null,
  lance2Name: null,
  lance1: [],
  lance2: [],
  phase: null
})

export default getDefaultState
