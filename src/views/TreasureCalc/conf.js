export const CLASS = [
  'SABER',
  'ARCHER',
  'LANCER',
  'RIDER',
  'CASTER',
  'ASSASSIN',
  'BERSERKER',
  'SHIELDER',
  'RULER',
  'AVENGER',
  'ALTEREGO',
  'MOONCANCER',
  'FOREIGNER',
  'BEASTI'
];

export const SUPPORT = [
  {
    name: '无'
  },
  {
    name: '梅林',
    value: {
      atk_buff: 20,
      buster_buff: 50
    }
  },
  {
    name: 'c狐',
    value: {
      arts_buff: 50
    }
  },
  {
    name: '孔明',
    value: {
      atk_buff: 30
    }
  },
  {
    name: 'CBA',
    value: {
      def_debuff: 30,
      quick_buff: 50
    }
  }
];

export const CRAFT_CSSENCE = [
  {
    name: '其他'
  },
  {
    name: '黑杯',
    value: {
      trea_buff: 60
    }
  },
  {
    name: '破满黑杯',
    value: {
      trea_buff: 80
    }
  },
  {
    name: '破满醉贞',
    value: {
      trea_buff: 15
    }
  },
  {
    name: '破满相扑',
    value: {
      atk_buff: 15
    }
  },
  {
    name: '破满小伊利',
    value: {
      trea_buff: 25,
      buster: 15
    }
  }
];

export const CLOTHES = [
  {
    name: '无'
  },
  {
    name: '初始',
    value: {
      atk_buff: 50
    }
  },
  {
    name: '战斗服',
    value: {
      atk_buff: 50
    }
  },
  {
    name: '红魔放',
    value: {
      buster_buff: 60
    }
  },
  {
    name: '蓝魔放',
    value: {
      arts_buff: 50
    }
  },
  {
    name: '绿魔放',
    value: {
      quick_buff: 50
    }
  }
];
let _e_p_m = {},
  _s_p_m = {};
for (let _class of CLASS) {
  _e_p_m[_class] = {
    英灵: []
  };
}
for (let _class of CLASS) {
  _s_p_m[_class] = [];
}
export const ENEMY_PICKER_MODEL = JSON.stringify(_e_p_m);
export const SERVANT_PICKER_MODEL = JSON.stringify(_s_p_m);
