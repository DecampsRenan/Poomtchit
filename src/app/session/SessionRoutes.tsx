import React from 'react';

import { Switch, useRouteMatch } from 'react-router-dom';

import { Route } from '@/app/router';
import { Error404 } from '@/errors';

import { SessionPlayer } from './SessionPlayer';

const SessionRoutes = () => {
  const { url } = useRouteMatch();

  return (
    <Switch>
      <Route
        exact
        path={`${url}/:sessionId`}
        render={() => <SessionPlayer />}
      />
      <Route path="*" render={() => <Error404 />} />
    </Switch>
  );
};

export default SessionRoutes;
