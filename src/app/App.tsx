import React, { Suspense } from 'react';

import { BrowserRouter, Redirect, Switch } from 'react-router-dom';

import { Layout, Loader } from '@/app/layout';
import { RoutePublic } from '@/app/router';
import { Error404, ErrorBoundary } from '@/errors';

const SessionRoutes = React.lazy(() => import('@/app/session/SessionRoutes'));
const DashboardRoutes = React.lazy(
  () => import('@/app/dashboard/DashboardRoutes')
);

export const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter basename="/app/">
        <Layout>
          <Suspense fallback={<Loader />}>
            <Switch>
              <RoutePublic
                exact
                path="/"
                render={() => <Redirect to="/dashboard" />}
              />

              <RoutePublic
                path="/dashboard"
                render={() => <DashboardRoutes />}
              />

              <RoutePublic path="/session" render={() => <SessionRoutes />} />

              <RoutePublic path="*" render={() => <Error404 />} />
            </Switch>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </ErrorBoundary>
  );
};
