import {
  HARD_ATTACK,
  SOFT_ATTACK,
  HEAT_ATTACK,
  DODGE
  // COOLING
} from './dice'

import {
  TRAITS
} from './traits'

export const LCT_1V = {
  name: 'Locust',
  model: 'LCT_1V',
  fullName: 'Locust-1V',
  imageSource: '/img/mechs/1_LOCUST.jpg',
  tons: 20,
  maxStructure: 6,
  baseDice: [SOFT_ATTACK, DODGE, DODGE],
  optionalDice: [],
  traits: []
}

export const WSP_1A = {
  name: 'Wasp',
  model: 'WSP_1A',
  fullName: 'Wasp-1A',
  imageSource: '/img/mechs/2_WASP.jpg',
  tons: 20,
  maxStructure: 5,
  baseDice: [SOFT_ATTACK, DODGE, DODGE],
  optionalDice: [],
  traits: []
}

export const STG_3R = {
  name: 'Stinger',
  model: 'STG_3R',
  fullName: 'Stinger-3R',
  imageSource: '/img/mechs/3_STINGER.jpg',
  tons: 20,
  maxStructure: 5,
  baseDice: [SOFT_ATTACK, DODGE, DODGE],
  optionalDice: [],
  traits: []
}

export const COM_2D = {
  name: 'Commando',
  model: 'COM_2D',
  fullName: 'Commando-2D',
  imageSource: '/img/mechs/4_COMMANDO.jpg',
  tons: 25,
  maxStructure: 7,
  baseDice: [SOFT_ATTACK, DODGE],
  optionalDice: [SOFT_ATTACK],
  traits: []
}

export const JVN_10N = {
  name: 'Javelin',
  model: 'JVN_10N',
  fullName: 'Javelin-10N',
  imageSource: '/img/mechs/5_JAVELIN.jpg',
  tons: 30,
  maxStructure: 8,
  baseDice: [DODGE, DODGE],
  optionalDice: [HARD_ATTACK],
  traits: []
}

export const SDR_5V = {
  name: 'Spider',
  model: 'SDR_5V',
  fullName: 'Spider-5V',
  imageSource: '/img/mechs/6_SPIDER.jpg',
  tons: 30,
  maxStructure: 7,
  baseDice: [SOFT_ATTACK, DODGE, DODGE],
  optionalDice: [SOFT_ATTACK],
  traits: [TRAITS.FAULTY_EJECTION]
}

export const UM_R60 = {
  name: 'Urbanmech',
  model: 'UM_R60',
  fullName: 'Urbanmech-R60',
  imageSource: '/img/mechs/7_URBANMECH.jpg',
  tons: 30,
  maxStructure: 10,
  baseDice: [HARD_ATTACK],
  optionalDice: [],
  traits: [TRAITS.URBAN_COMBAT]
}

export const VLK_QA = {
  name: 'Valkyrie',
  model: 'VLK_QA',
  fullName: 'Valkyrie-QA',
  imageSource: '/img/mechs/8_VALKYRIE.jpg',
  tons: 30,
  maxStructure: 10,
  baseDice: [SOFT_ATTACK, SOFT_ATTACK, DODGE],
  optionalDice: [],
  traits: []
}

export const FS9_H = {
  name: 'Firestarter',
  model: 'FS9_H',
  fullName: 'Firestarter-9-H',
  imageSource: '/img/mechs/9_FIRESTARTER.jpg',
  tons: 35,
  maxStructure: 10,
  baseDice: [HEAT_ATTACK, HEAT_ATTACK],
  optionalDice: [SOFT_ATTACK, DODGE],
  traits: [TRAITS.URBAN_COMBAT]
}

export const JR7_D = {
  name: 'Jenner',
  fullName: 'Jenner-7-D',
  imageSource: '/img/mechs/10_JENNER.jpg',
  tons: 35,
  maxStructure: 8,
  baseDice: [SOFT_ATTACK, DODGE],
  optionalDice: [DODGE, HARD_ATTACK],
  traits: []
}

export const OTT_7J = {
  name: 'Ostscout',
  model: 'OTT_7J',
  fullName: 'Ostscout-7J',
  imageSource: '/img/mechs/11_OSTSCOUT.jpg',
  tons: 35,
  maxStructure: 9,
  baseDice: [SOFT_ATTACK, DODGE],
  optionalDice: [DODGE],
  traits: []
}

export const PNT_9R = {
  name: 'Panther',
  model: 'PNT_9R',
  fullName: 'Panther-9R',
  imageSource: '/img/mechs/12_PANTHER.jpg',
  tons: 35,
  maxStructure: 11,
  baseDice: [HARD_ATTACK, DODGE],
  optionalDice: [],
  traits: [TRAITS.URBAN_COMBAT]
}


// mechs
export const MECHS = [
  LCT_1V,
  WSP_1A,
  STG_3R,
  COM_2D,
  JVN_10N,
  SDR_5V,
  UM_R60,
  VLK_QA,
  FS9_H,
  JR7_D,
  OTT_7J,
  PNT_9R
]