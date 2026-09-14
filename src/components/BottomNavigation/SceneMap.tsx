import * as React from 'react';

import type { BaseRoute } from './types';

type SceneProps<Route extends BaseRoute> = {
  route: Route;
  jumpTo: (key: string) => void;
};

const SceneComponent = React.memo(
  ({
    component,
    ...rest
  }: {
    component: React.ComponentType<SceneProps<BaseRoute>>;
    route: BaseRoute;
    jumpTo: (key: string) => void;
  }) => React.createElement(component, rest)
);

/**
 * Function which takes a map of route keys to components.
 * Pure components are used to minimize re-rendering of the pages.
 */
const SceneMap = <Route extends BaseRoute>(scenes: {
  [key: string]: React.ComponentType<SceneProps<Route>>;
}) => {
  return ({ route, jumpTo }: SceneProps<Route>) => (
    <SceneComponent
      key={route.key}
      component={
        // SceneMap is generic over Route; the memoized shell is shared.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        scenes[route.key ? route.key : ''] as React.ComponentType<
          SceneProps<BaseRoute>
        >
      }
      route={route}
      jumpTo={jumpTo}
    />
  );
};

export default SceneMap;
