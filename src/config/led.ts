import { getHex } from '@utils/hex';

const led = {
  '0': '57aa020061',
  '1': `57aa02${getHex(20)}61`,
  '2': `57aa02${getHex(40)}61`,
  '3': `57aa02${getHex(60)}61`,
  '4': `57aa02${getHex(80)}61`,
  reverseRight: '57ce020661',
  reverseLeft: '57ce020561',
  Marquee: '57ce020761',
  Meteor: '57ce020861',
  Laser: '57ce020961',
  'Flowing Water': '57ce021061',
  Curtain: '57ce021161',
  Rainbow: '57ce021261',
  Chasing: '57ce021361',
};
export { led };
