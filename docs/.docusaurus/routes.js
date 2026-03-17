import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/docs/__docusaurus/debug',
    component: ComponentCreator('/docs/__docusaurus/debug', 'e58'),
    exact: true
  },
  {
    path: '/docs/__docusaurus/debug/config',
    component: ComponentCreator('/docs/__docusaurus/debug/config', '2ce'),
    exact: true
  },
  {
    path: '/docs/__docusaurus/debug/content',
    component: ComponentCreator('/docs/__docusaurus/debug/content', '11b'),
    exact: true
  },
  {
    path: '/docs/__docusaurus/debug/globalData',
    component: ComponentCreator('/docs/__docusaurus/debug/globalData', 'f13'),
    exact: true
  },
  {
    path: '/docs/__docusaurus/debug/metadata',
    component: ComponentCreator('/docs/__docusaurus/debug/metadata', 'bff'),
    exact: true
  },
  {
    path: '/docs/__docusaurus/debug/registry',
    component: ComponentCreator('/docs/__docusaurus/debug/registry', '830'),
    exact: true
  },
  {
    path: '/docs/__docusaurus/debug/routes',
    component: ComponentCreator('/docs/__docusaurus/debug/routes', '13e'),
    exact: true
  },
  {
    path: '/docs/blog',
    component: ComponentCreator('/docs/blog', 'e7c'),
    exact: true
  },
  {
    path: '/docs/blog/archive',
    component: ComponentCreator('/docs/blog/archive', '5ff'),
    exact: true
  },
  {
    path: '/docs/blog/tags',
    component: ComponentCreator('/docs/blog/tags', 'a37'),
    exact: true
  },
  {
    path: '/docs/blog/tags/announcement',
    component: ComponentCreator('/docs/blog/tags/announcement', 'be1'),
    exact: true
  },
  {
    path: '/docs/blog/tags/documentation',
    component: ComponentCreator('/docs/blog/tags/documentation', '6f7'),
    exact: true
  },
  {
    path: '/docs/blog/tags/welcome',
    component: ComponentCreator('/docs/blog/tags/welcome', '4f5'),
    exact: true
  },
  {
    path: '/docs/blog/welcome',
    component: ComponentCreator('/docs/blog/welcome', 'e9d'),
    exact: true
  },
  {
    path: '/docs/',
    component: ComponentCreator('/docs/', '5b3'),
    routes: [
      {
        path: '/docs/',
        component: ComponentCreator('/docs/', 'bf2'),
        routes: [
          {
            path: '/docs/',
            component: ComponentCreator('/docs/', 'd4b'),
            routes: [
              {
                path: '/docs/api/admins-api',
                component: ComponentCreator('/docs/api/admins-api', '091'),
                exact: true
              },
              {
                path: '/docs/api/authentication-api',
                component: ComponentCreator('/docs/api/authentication-api', '2e1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/members-api',
                component: ComponentCreator('/docs/api/members-api', 'a93'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/overview',
                component: ComponentCreator('/docs/api/overview', '211'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/documentation-guide',
                component: ComponentCreator('/docs/documentation-guide', '8d3'),
                exact: true
              },
              {
                path: '/docs/faq/common-issues',
                component: ComponentCreator('/docs/faq/common-issues', '4ab'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/faq/troubleshooting',
                component: ComponentCreator('/docs/faq/troubleshooting', '9a6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started',
                component: ComponentCreator('/docs/getting-started', '2a1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/authentication',
                component: ComponentCreator('/docs/guides/authentication', 'e99'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/database',
                component: ComponentCreator('/docs/guides/database', '00b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/deployment',
                component: ComponentCreator('/docs/guides/deployment', 'e31'),
                exact: true
              },
              {
                path: '/docs/guides/introduction',
                component: ComponentCreator('/docs/guides/introduction', '40c'),
                exact: true
              },
              {
                path: '/docs/introduction/architecture',
                component: ComponentCreator('/docs/introduction/architecture', 'e66'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/introduction/installation',
                component: ComponentCreator('/docs/introduction/installation', '9ce'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/introduction/overview',
                component: ComponentCreator('/docs/introduction/overview', '607'),
                exact: true
              },
              {
                path: '/docs/',
                component: ComponentCreator('/docs/', '0ee'),
                exact: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
