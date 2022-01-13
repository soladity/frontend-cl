import React from 'react'
import { Navigate } from 'react-router';
import Monsters from '../containers/Monsters/Monsters';
import Home from '../containers/Home/Home';
import Beasts from '../containers/Beasts/Beasts';
import Warriors from '../containers/Warriors/Warriors';
import Legions from '../containers/Legions/Legions';
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
                title: 'Welcome',
                subTitle: 'to CryptoLegions'
            },
            {
                type: 'divider'
            },
            {
                type: 'head',
                title: 'Main Game',
                subTitle: 'Play to earn'
            },
            {
                type: 'navlink',
                title: 'Beasts',
                icon: 'beasts',
                path: '/beasts'
            },
            {
                type: 'navlink',
                title: 'Warriors',
                icon: 'warriors',
                path: '/warriors'
            },
            {
                type: 'navlink',
                title: 'Legions',
                icon: 'legions',
                path: '/legions'
            },
            {
                type: 'navlink',
                title: 'Quests',
                icon: 'quests',
                path: '/monsters'
            },
            {
                type: 'divider'
            },
            {
                type: 'head',
                title: 'Marketplace',
                subTitle: 'Buy & Sell your NFTs'
            },
            {
                type: 'link',
                title: 'Beasts',
                icon: 'beasts',
                path: '/beasts'
            },
            {
                type: 'link',
                title: 'Warriors',
                icon: 'warriors',
                path: '/warrios'
            },
            {
                type: 'link',
                title: 'Legions',
                icon: 'legions',
                path: '/legions'
            },
            {
                type: 'divider'
            },
            {
                type: 'head',
                title: 'Get $Bloodstone',
                subTitle: 'With Another Cryptocurrencies'
            },
            {
                type: 'link',
                title: 'Pancakeswap',
                icon: 'pancakeswap',
                path: 'https://pancakeswap.com'
            },
            {
                type: 'divider'
            },
            {
                type: 'head',
                title: 'How To Play',
                subTitle: 'Learn About Game'
            },
            {
                type: 'link',
                title: 'WHITEPAPER',
                icon: 'whitepaper',
                path: 'https://pancakeswap.com'
            },
            {
                type: 'divider'
            },
            {
                type: 'head',
                title: 'Social',
                subTitle: 'Talk with us and other miners'
            },
            {
                type: 'link',
                title: 'Twitter',
                icon: 'beasts',
                path: 'https://www.twitter.com'
            },
            {
                type: 'link',
                title: 'Telegram',
                icon: 'beasts',
                path: 'https://www.telegram.com'
            },
            {
                type: 'link',
                title: 'Discord',
                icon: 'beasts',
                path: 'https://www.discord.com'
            },
            {
                type: 'divider'
            },
            {
                type: 'head',
                title: 'About',
                subTitle: 'Privacy policy'
            },
            {
                type: 'navlink',
                title: 'Policy',
                icon: 'policy',
                path: '/policy'
            },
        ],
        top: []
    } 
};
