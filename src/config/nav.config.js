import React from 'react'
import { Navigate } from 'react-router';
import Monsters from '../containers/Monsters/Monsters';
import Home from '../containers/Home/Home';
import Beasts from '../containers/Beasts/Beasts';
import Warriors from '../containers/Warriors/Warriors';
import Legions from '../containers/Legions/Legions';
import CreateLegions from '../containers/CreateLegions/CreateLegions';
import UpdateLegions from '../containers/UpdateLegions';
import Profile from '../containers/Profile/Profile';
import Policy from '../containers/Policy/Policy';

export const navConfig = {
    drawerWidth: 250,
    routes: () => [
        {
            path: '/',
            // element: React.lazy(() => import('./../containers/Home/Home')),
            element: <Home />,
            children: [],
        },
        {
            path: '/monsters',
            // element: React.lazy(() => import('./../containers/Monsters/Monsters'))
            element: <Monsters />
        },
        {
            path: '/beasts',
            // element: React.lazy(() => import('./../containers/Beasts/Beasts'))
            element: <Beasts />
        },
        {
            path: '/warriors',
            // element: React.lazy(() => import('./../containers/Monsters/Monsters'))
            element: <Warriors />
        },
        {
            path: '/legions',
            // element: React.lazy(() => import('./../containers/Beasts/Beasts'))
            element: <Legions />
        },
        {
            path: '/createlegions',
            element: <CreateLegions />
        },
        {
            path: '/updatelegions',
            element: <UpdateLegions />
        },
        {
            path: '/profile',
            // element: React.lazy(() => import('./../containers/Beasts/Beasts'))
            element: <Profile />
        },
        {
            path: '/policy',
            // element: React.lazy(() => import('./../containers/Beasts/Beasts'))
            element: <Policy />
        },
        {
            path: '*',
            element: <Navigate to="/" />
        },
    ],

    navBar: {
        left: [
            {
                type: 'divider'
            },
            {
                type: 'head',
                title: 'play',
            },
            {
                type: 'navlink',
                title: 'beasts',
                icon: 'beasts',
                path: '/beasts'
            },
            {
                type: 'navlink',
                title: 'warriors',
                icon: 'warriors',
                path: '/warriors'
            },
            {
                type: 'navlink',
                title: 'legions',
                icon: 'legions',
                path: '/legions'
            },
            {
                type: 'navlink',
                title: 'hunt',
                icon: 'hunt',
                path: '/monsters'
            },
            {
                type: 'divider'
            },
            {
                type: 'head',
                title: 'market',
            },
            {
                type: 'link',
                title: 'beasts',
                icon: 'beasts',
                path: '/beasts'
            },
            {
                type: 'link',
                title: 'warriors',
                icon: 'warriors',
                path: '/warrios'
            },
            {
                type: 'link',
                title: 'legions',
                icon: 'legions',
                path: '/legions'
            },
            {
                type: 'divider'
            },
            {
                type: 'head',
                title: 'usefulLinks',
            },
            {
                type: 'link',
                title: 'buyBlst',
                icon: 'pancakeswap',
                path: 'https://pancakeswap.com'
            },
            {
                type: 'link',
                title: 'whitepaper',
                icon: 'whitepaper',
                path: 'https://pancakeswap.com'
            },
            {
                type: 'navlink',
                title: 'help',
                icon: 'Help',
                path: '/help'
            },
            {
                type: 'divider'
            },
            {
                type: 'head',
                title: 'social',
            },
            {
                type: 'link',
                title: 'twitter',
                icon: 'beasts',
                path: 'https://www.twitter.com'
            },
            {
                type: 'link',
                title: 'telegram',
                icon: 'beasts',
                path: 'https://www.telegram.com'
            },
            {
                type: 'link',
                title: 'discord',
                icon: 'beasts',
                path: 'https://www.discord.com'
            },
            {
                type: 'divider'
            },
            {
                type: 'head',
                title: 'privacy',
            },
            {
                type: 'navlink',
                title: 'policy',
                icon: 'policy',
                path: '/policy'
            },
        ],
        top: []
    }
};
