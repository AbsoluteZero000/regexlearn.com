import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

import PracticeChallengeView from 'src/components/PracticeChallengeView';
import {
  getPracticeChallenges,
  isPracticeLevel,
  practiceLevels,
} from 'src/data/practice';
import { defaultLocale, locales } from 'src/localization';
import { PracticeChallenge, PracticeLevel } from 'src/types';
import globalIntl from 'src/utils/globalIntl';

interface Props {
  level: PracticeLevel;
  challenges: PracticeChallenge[];
}

const PagePracticeLevel = ({ level, challenges }: Props) => (
  <>
    <Head>
      <link rel="stylesheet" href="/css/animate.css" />
    </Head>
    <PracticeChallengeView level={level} challenges={challenges} />
  </>
);

export default PagePracticeLevel;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const lang = params.lang || defaultLocale;
  const levelId = String(params.level);
  if (!isPracticeLevel(levelId)) return { notFound: true };

  const messages = require(`src/localization/${lang}/`)?.default;
  const allMessages = { ...require('src/localization/en/practice.json'), ...messages };
  const intl = globalIntl(lang, allMessages);
  const level = practiceLevels.find(item => item.id === levelId);

  return {
    props: {
      lang,
      messages,
      level,
      challenges: getPracticeChallenges(levelId),
      metadata: {
        title: `${intl.formatMessage({ id: level.title })} - ${intl.formatMessage({
          id: 'page.practice.title',
        })}`,
        description: intl.formatMessage({ id: level.description }),
        hrefLang: `practice/${level.id}`,
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [];
  locales.forEach(lang => {
    practiceLevels.forEach(level => paths.push({ params: { lang, level: level.id } }));
  });
  return { fallback: false, paths };
};
