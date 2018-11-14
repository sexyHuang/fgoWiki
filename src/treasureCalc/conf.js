const upClasses = JSON.stringify({
  ruler: 0.5,
  berserker: 2
});
const downClasses = JSON.stringify({
  ruler: 0.5,
  berserker: 2,
  beastI: 2
});

export const CLASS_MAP = {
  saber: {
    lancer: 2,
    archer: 0.5,
    ...JSON.parse(upClasses)
  },
  archer: {
    fixed: 0.95,
    saber: 2,
    lancer: 0.5,
    ...JSON.parse(upClasses)
  },
  lancer: {
    fixed: 1.05,
    saber: 0.5,
    archer: 2,
    ...JSON.parse(upClasses)
  },
  rider: {
    ...JSON.parse(downClasses),
    caster: 2,
    assassin: 0.5
  },
  caster: {
    fixed: 0.9,
    ...JSON.parse(downClasses),
    assassin: 2,
    rider: 0.5
  },
  assassin: {
    fixed: 0.9,
    ...JSON.parse(downClasses),
    rider: 2,
    caster: 0.5
  },
  berserker: {
    fixed: 1.1,
    saber: 1.5,
    lancer: 1.5,
    archer: 1.5,
    rider: 1.5,
    caster: 1.5,
    assassin: 1.5,
    berserker: 1.5,
    foreigner: 0.5,
    beastI: 1.5
  },
  ruler: {
    fixed: 1.1,
    mooncancer: 2,
    berserker: 2,
    avenger: 0.5
  },
  avenger: {
    fixed: 1.1,
    mooncancer: 0.5,
    berserker: 2,
    ruler: 2
  },
  mooncancer: {
    ruler: 0.5,
    avenger: 2,
    berserker: 2,
    beastIII: 1.2
  },
  alterego: {
    saber: 0.5,
    lancer: 0.5,
    archer: 0.5,
    rider: 1.5,
    caster: 1.5,
    assassin: 1.5,
    berserker: 2,
    foreigner: 2,
    beastIII: 1.2
  },
  foreigner: {
    foreigner: 2,
    berserker: 2,
    alterego: 0.5
  }
};

export const PARTY_KEYS = {
  天: 'sky',
  地: 'earth',
  人: 'man',
  星: 'star',
  兽: 'beast'
};

export const PARTY_MAP = {
  man: {
    sky: 1.1,
    earth: 0.9
  },
  sky: {
    man: 0.9,
    earth: 1.1
  },
  earth: {
    man: 1.1,
    sky: 0.9
  },
  star: {
    beast: 1.1
  },
  beast: {
    star: 1.1
  }
};

export const ATK_FIX = 0.23;

export const RANDOM_FIX = [0.9, 1.1];

export const CARD_MAP = {
  quick: 0.8,
  arts: 1.0,
  buster: 1.5,
  extra: 1.0
};
