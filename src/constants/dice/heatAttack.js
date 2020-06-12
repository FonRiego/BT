export default {
  type: 'HEAT_ATTACK',
  color: 'yellow',
  rolledFace: null,
  willBeCooled: false,
  willBeRolled: true,
  used: false,
  selected: false,
  faces: [
    { 
      image:'/img/dice/heat/1.png',
      damage: 0,
      tactic: 0,
      heat: 0,
      dodge: 0,
      cooling: 0
    },
    {
      image:'/img/dice/heat/2.png',
      damage: 0,
      tactic: 0,
      heat: 1,
      dodge: 0,
      cooling: 0
    },
    {
      image:'/img/dice/heat/2.png',
      damage: 0,
      tactic: 0,
      heat: 1,
      dodge: 0,
      cooling: 0
    },
    {
      image:'/img/dice/heat/4.png',
      damage: 1,
      tactic: 0,
      heat: 1,
      dodge: 0,
      cooling: 0
    },
    {
      image:'/img/dice/heat/5.png',
      damage: 0,
      tactic: 0,
      heat: 2,
      dodge: 0,
      cooling: 0
    },
    {
      image:'/img/dice/heat/6.png',
      damage: 1,
      tactic: 0,
      heat: 2,
      dodge: 0,
      cooling: 0
    }
  ]
}