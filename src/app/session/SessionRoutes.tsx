import React from 'react';

import { Switch, useRouteMatch } from 'react-router-dom';

import { RoutePublic } from '@/app/router';
import { Error404 } from '@/errors';

import { SessionPlayer } from './SessionPlayer';

const SessionRoutes = () => {
  const { url } = useRouteMatch();
  console.log('url', url);
  return (
    <Switch>
      <RoutePublic
        exact
        path={`${url}/:sessionId`}
        render={() => <SessionPlayer />}
      />
      <RoutePublic path="*" render={() => <Error404 />} />
    </Switch>
  );
};

export default SessionRoutes;
