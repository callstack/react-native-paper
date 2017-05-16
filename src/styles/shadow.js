/* @flow */

import * as Colors from './colors';

export default function shadow(elevation: number) {
  let height, radius;
  switch (elevation) {
    case 1:
      height = 0.5;
      radius = 0.75;
      break;
    case 2:
      height = 0.75;
      radius = 1.5;
      break;
    default:
      height = elevation - 1;
      radius = elevation;
  }
  return {
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height,
    },
    shadowOpacity: 0.24,
    shadowRadius: radius,
  };
}
