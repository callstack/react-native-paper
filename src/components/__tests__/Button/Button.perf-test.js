import React from 'react';

import { measurePerformance } from 'reassure';

import Button from '../../Button/Button';

test('Simple test', async () => {
  await measurePerformance(<Button />);
});
