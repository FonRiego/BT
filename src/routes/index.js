// constants
import { VIEWS_NAMES } from '../constants/viewsNames'
import Home from '../views/Home'
import Battle from '../views/Battle'

const routes = [
  {
    name: VIEWS_NAMES.HOME_VIEW,
    path: '/',
    component: Home
  },
  {
    name: VIEWS_NAMES.BATTLE_VIEW,
    path: '/battle',
    component: Battle
  }
]

export default routes
