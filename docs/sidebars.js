/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a set of docs in the sidebar
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'getting-started',
      label: 'Getting Started',
    },
    {
      type: 'category',
      label: 'Setup & Installation',
      items: [
        'introduction/installation',
        'introduction/architecture',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/authentication',
        'guides/database',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/overview',
        'api/authentication-api',
        'api/members-api',
      ],
    },
    {
      type: 'category',
      label: 'Help & Support',
      items: [
        'faq/troubleshooting',
        'faq/common-issues',
      ],
    },
  ],
};

module.exports = sidebars;
