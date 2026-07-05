import { FormattedMessage, useIntl } from 'react-intl';

import Icon from 'src/components/Icon';
import IntlLink from 'src/components/IntlLink';
import Progress from 'src/components/Progress';
import { PracticeLevel } from 'src/types';

interface Props {
  level: PracticeLevel;
  completed: number;
  total: number;
}

const PracticeLevelCard = ({ level, completed, total }: Props) => {
  const { formatMessage } = useIntl();
  const hasProgress = completed > 0;
  const levelColors = {
    beginner: 'bg-[#324A34]/80 hover:bg-[#324A34]',
    intermediate: 'bg-[#af6b21]/80 hover:bg-[#af6b21]',
    advanced: 'bg-[#51406f]/80 hover:bg-[#51406f]',
  };

  return (
    <IntlLink href="/[lang]/practice/[level]" query={{ level: level.id }}>
      <div
        className={`bg-[url(/images/noise.png)] ${levelColors[level.id]} relative bg-repeat bg-contain transition-all duration-300 w-full min-h-[190px] rounded-xl py-4 px-5 flex flex-col shadow-xl hover:shadow-2xl select-none`}
      >
        <h2 className="text-xl font-bold">
          <FormattedMessage id={level.title} />
        </h2>
        <p className="text-sm text-neutral-300 mt-3 max-w-[90%]">
          <FormattedMessage id={level.description} />
        </p>
        <div className="flex items-end justify-between flex-1 mt-5">
          <div>
            <Progress current={completed} total={total} showProgressText={false} />
            <span className="text-xs text-neutral-400 mt-2 block">
              {completed}/{total} {formatMessage({ id: 'practice.completed' })}
            </span>
          </div>
          <span className="inline-flex items-center bg-neutral-800 px-3 py-2 rounded-md text-xs text-neutral-300 hover:text-neutral-50">
            <FormattedMessage id={hasProgress ? 'practice.continue' : 'practice.start'} />
            <Icon icon="arrow-right" size={14} className="ltr:ml-1 rtl:mr-1 rtl:rotate-180" />
          </span>
        </div>
      </div>
    </IntlLink>
  );
};

export default PracticeLevelCard;
