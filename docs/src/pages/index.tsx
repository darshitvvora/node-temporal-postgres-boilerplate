import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div style={{marginBottom: '2rem'}}>
          <img
            src="img/logo.png"
            alt="Node.js Temporal Boilerplate Logo"
            style={{width: '150px', height: '150px', borderRadius: '20px'}}
          />
        </div>
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/quick-start">
            Get Started in 5 Minutes
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/intro"
            style={{marginLeft: '1rem'}}>
            View Documentation
          </Link>
        </div>
        <div style={{marginTop: '2rem'}}>
          <img
            src="https://img.shields.io/badge/node-%3E%3D24.12.0-brightgreen"
            alt="Node.js Version"
            style={{marginRight: '0.5rem'}}
          />
          <img
            src="https://img.shields.io/badge/TypeScript-5.x-blue"
            alt="TypeScript"
            style={{marginRight: '0.5rem'}}
          />
          <img
            src="https://img.shields.io/badge/License-MIT-yellow.svg"
            alt="License"
            style={{marginRight: '0.5rem'}}
          />
          <img
            src="https://img.shields.io/github/stars/darshitvvora/node-temporal-postgres-boilerplate?style=social"
            alt="GitHub stars"
          />
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Production-ready Node.js REST API boilerplate with TypeScript, Temporal workflows, PostgreSQL, and complete Docker/Kubernetes deployment solutions">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
