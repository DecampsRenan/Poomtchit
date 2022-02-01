import React from 'react';

import { Switch, useRouteMatch } from 'react-router-dom';

import { PageDashboard } from '@/app/dashboard/PageDashboard';
import { RoutePublic } from '@/app/router';
import { Error404 } from '@/errors';

const DashboardRoutes = () => {
  const { url } = useRouteMatch();
  return (
    <Switch>
      <RoutePublic exact path={url} render={() => <PageDashboard />} />
      <RoutePublic path="*" render={() => <Error404 />} />
    </Switch>
  );
};

export default DashboardRoutes;
