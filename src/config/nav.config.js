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
                type: 'head',
                title: 'play',
            },
            {
                type: 'navlink',
                title: 'warriors',
                icon: 'warriors',
                path: '/warriors'
            },
            {
                type: 'navlink',
                title: 'beasts',
                icon: 'beasts',
                path: '/beasts'
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
                title: 'warriors',
                icon: 'warriors',
                path: '/warrios'
            },
            {
                type: 'link',
                title: 'beasts',
                icon: 'beasts',
                path: '/beasts'
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
                type: 'social',
                title: 'twitter',
                icon: '/assets/images/twitter.png',
                path: 'https://www.twitter.com'
            },
            {
                type: 'social',
                title: 'telegram',
                icon: '/assets/images/telegram.png',
                path: 'https://www.telegram.com'
            },
            {
                type: 'social',
                title: 'discord',
                icon: '/assets/images/discord.png',
                path: 'https://www.discord.com'
            },
            {
                type: 'social',
                title: 'youtube',
                icon: '/assets/images/youtube.png',
                path: 'https://www.youtube.com'
            },
            {
                type: 'social',
                title: 'medium',
                icon: '/assets/images/medium.png',
                path: 'https://medium.com'
            },
            {
                type: 'privacy',
                title: 'policy',
                icon: 'policy',
                path: '/policy'
            },
            {
                type: 'footer',
                title1: 'madeWith',
                title2: 'cryptoAgency'
            }
        ],
        top: []
    }
};
