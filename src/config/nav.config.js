import React from 'react'
import { Navigate } from 'react-router';
import Fleets from '../containers/Fleets/Fleets';
import Home from '../containers/Home/Home';
import Ships from '../containers/Ships/Ships';

export const navConfig = {
    drawerWidth: 240,
    routes: () => [
        {
            path: '/',
            // element: React.lazy(() => import('./../containers/Home/Home')),
            element: <Home />,
            children: [],
        },
        {
            path: '/fleet',
            // element: React.lazy(() => import('./../containers/Fleets/Fleets'))
            element: <Fleets />
        },
        {
            path: '/ship',
            // element: React.lazy(() => import('./../containers/Ships/Ships'))
            element: <Ships />
        },
        {
            path: '*',
            element: <Navigate to="/" />
        },
    ]
};
