export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? '//image.mooyuer.com/'
    : 'http://timg.mooyuer.com/';
export const SERVANT = `${BASE_URL}fgo/Servant/`;
/* const SKILL = `${BASE_URL}fgo/Skill/`;
const CraftEssences = `${BASE_URL}fgo/CraftEssences/`; */
const SERVANT_ARTS = [
  'A',
  'B',
  'C',
  'D',
  'fool',
  'icon',
  'E',
  'Z',
  'cloth_icon.png'
];
export const getServantImages = id => {
  let output = {};
  SERVANT_ARTS.map(val => {
    output[val.split('.')[0]] = `${SERVANT}${id}/${
      val.indexOf('.') > 0 ? val : val + '.jpg'
    }`;
    return val;
  });
  return output;
};
