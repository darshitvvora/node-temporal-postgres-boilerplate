import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Node.js Temporal Boilerplate',
  tagline: 'Production-ready Node.js REST API boilerplate with built-in reliability using Temporal workflows',
  favicon: 'img/logo.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://darshitvvora.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/node-temporal-postgres-boilerplate/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'darshitvvora', // Usually your GitHub org/user name.
  projectName: 'node-temporal-postgres-boilerplate', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/darshitvvora/node-temporal-postgres-boilerplate/tree/master/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Node.js Temporal Boilerplate',
      logo: {
        alt: 'Node.js Temporal Boilerplate',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          to: '/docs/quick-start',
          label: 'Quick Start',
          position: 'left',
        },
        {
          to: '/docs/features',
          label: 'Features',
          position: 'left',
        },
        {
          href: 'https://github.com/darshitvvora/node-temporal-postgres-boilerplate',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
            {
              label: 'Quick Start',
              to: '/docs/quick-start',
            },
            {
              label: 'Features',
              to: '/docs/features',
            },
            {
              label: 'Use Cases',
              to: '/docs/use-cases',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Temporal Documentation',
              href: 'https://docs.temporal.io/',
            },
            {
              label: 'Node.js Best Practices',
              href: 'https://github.com/goldbergyoni/nodebestpractices',
            },
            {
              label: 'Sequelize Docs',
              href: 'https://sequelize.org/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/darshitvvora/node-temporal-postgres-boilerplate',
            },
            {
              label: 'Issues',
              href: 'https://github.com/darshitvvora/node-temporal-postgres-boilerplate/issues',
            },
            {
              label: 'Discussions',
              href: 'https://github.com/darshitvvora/node-temporal-postgres-boilerplate/discussions',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Darshit Vora. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
