// constants
import { VIEWS_NAMES } from '../constants/viewsNames'
import Lances from '../views/Lances'
import Battle from '../views/Battle'

const routes = [
  {
    name: VIEWS_NAMES.LANCES_VIEW,
    path: '/',
    component: Lances
  },
  {
    name: VIEWS_NAMES.BATTLE_VIEW,
    path: '/battle',
    component: Battle
  }
]

export default routes
