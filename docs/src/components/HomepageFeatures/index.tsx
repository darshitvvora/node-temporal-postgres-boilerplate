import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg?: React.ComponentType<React.ComponentProps<'svg'>>;
  Image?: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Temporal Workflows',
    Image: require('@site/static/img/TemporalLogo.png').default,
    description: (
      <>
        Built-in durable execution with Temporal. Automatic retries, workflow state persistence,
        and fault-tolerant task execution out of the box.
      </>
    ),
  },
  {
    title: 'Production Ready',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Complete Docker and Kubernetes configurations, security best practices,
        monitoring, health checks, and horizontal auto-scaling built in.
      </>
    ),
  },
  {
    title: 'TypeScript First',
    Image: require('@site/static/img/Typescript.png').default,
    description: (
      <>
        Full type safety with TypeScript 5.x. Express.js 5, PostgreSQL with Sequelize,
        OpenAPI documentation, and modern development workflow.
      </>
    ),
  },
];

function Feature({title, Svg, Image, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {Svg && <Svg className={styles.featureSvg} role="img" />}
        {Image && (
          <img
            src={Image}
            alt={title}
            className={styles.featureSvg}
            style={{height: '200px', width: 'auto'}}
          />
        )}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
