import { GetStaticPaths, GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Footer from 'src/components/Footer';
import Header from 'src/components/Header';
import PracticeLevelCard from 'src/components/PracticeLevelCard';
import SupportButton from 'src/components/SupportButton';
import { getPracticeChallenges, practiceLevels } from 'src/data/practice';
import { defaultLocale, locales } from 'src/localization';
import { PracticeProgress } from 'src/types';
import globalIntl from 'src/utils/globalIntl';
import { emptyPracticeProgress, getPracticeProgress } from 'src/utils/practiceProgress';

const PagePractice = () => {
  const [progress, setProgress] = useState<PracticeProgress>(emptyPracticeProgress());

  useEffect(() => {
    setProgress(getPracticeProgress());
  }, []);

  return (
    <div className="container flex flex-1 flex-col min-h-screen">
      <Header page="practice" />
      <main className="flex flex-col justify-center flex-1 py-8">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className="w-full lg:w-2/5">
            <img src="/Practise.webp" alt="" className="w-52 h-52 mb-4 drop-shadow-xl" />
            <h1 className="text-3xl text-white font-bold">
              <FormattedMessage id="practice.title" />
            </h1>
            <p className="text-neutral-300 mt-4 max-w-lg">
              <FormattedMessage id="practice.description" />
            </p>
          </div>
          <div className="w-full lg:w-3/5 flex flex-col gap-5">
            {practiceLevels.map(level => {
              const challenges = getPracticeChallenges(level.id);
              const completed = challenges.filter(challenge =>
                progress.completed.includes(challenge.id),
              ).length;

              return (
                <PracticeLevelCard
                  key={level.id}
                  level={level}
                  completed={completed}
                  total={challenges.length}
                />
              );
            })}
          </div>
        </div>
      </main>
      <SupportButton />
      <Footer />
    </div>
  );
};

export default PagePractice;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const lang = params.lang || defaultLocale;
  const messages = require(`src/localization/${lang}/`)?.default;
  const intl = globalIntl(lang, { ...require('src/localization/en/practice.json'), ...messages });

  return {
    props: {
      lang,
      messages,
      metadata: {
        title: intl.formatMessage({ id: 'page.practice.title' }),
        description: intl.formatMessage({ id: 'page.practice.description' }),
        hrefLang: 'practice',
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  fallback: false,
  paths: locales.map(lang => ({ params: { lang } })),
});
