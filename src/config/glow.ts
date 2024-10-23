import { getHex } from '@utils/hex';

const glow = {
  '0': '57aa020061',
  '1': `57aa02${getHex(20)}61`,
  '2': `57aa02${getHex(40)}61`,
  '3': `57aa02${getHex(60)}61`,
  '4': `57aa02${getHex(80)}61`,
  reverseRight: '57de020661',
  reverseLeft: '57de020561',
  Marquee: '57de020761',
  Meteor: '57de020861',
  Laser: '57de020961',
  'Flowing Water': '57de021061',
  Curtain: '57de021161',
  Rainbow: '57de021261',
  Chasing: '57de021361',
};
export { glow };
