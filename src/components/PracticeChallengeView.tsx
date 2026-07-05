import { createPortal } from 'react-dom';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import confetti from 'canvas-confetti';
import cx from 'clsx';
import useEventListener from '@use-it/event-listener';

import Button, { ButtonVariants } from 'src/components/Button';
import FlagBox from 'src/components/FlagBox';
import Header from 'src/components/Header';
import HighlightedText from 'src/components/HighlightedText';
import Icon from 'src/components/Icon';
import IntlLink from 'src/components/IntlLink';
import Progress from 'src/components/Progress';
import {
  PracticeChallenge,
  PracticeLevel,
  PracticeProgress,
} from 'src/types';
import {
  completePracticeChallenge,
  getPracticeProgress,
  resetPracticeLevel,
  setCurrentPracticeChallenge,
  setPracticeProgress,
} from 'src/utils/practiceProgress';
import validatePracticeSolution from 'src/utils/practiceValidation';

interface Props {
  level: PracticeLevel;
  challenges: PracticeChallenge[];
}

const renderMatches = (content: string, source: string, flags: string) => {
  if (!source) return content;

  try {
    const isGlobal = flags.includes('g');
    const expression = new RegExp(source, isGlobal ? flags : `${flags}g`);
    const nodes = [];
    let lastIndex = 0;
    let match = expression.exec(content);

    while (match) {
      nodes.push(content.slice(lastIndex, match.index));
      nodes.push(
        <mark
          key={`${match.index}-${nodes.length}`}
          className="bg-yellow-600 shadow-sm mx-[1px] px-1 py-[2px] rounded-md text-black"
        >
          {match[0]}
        </mark>,
      );
      lastIndex = match.index + match[0].length;
      if (!isGlobal || match[0] === '') break;
      match = expression.exec(content);
    }

    nodes.push(content.slice(lastIndex));
    return nodes.map((node, index) => <Fragment key={index}>{node}</Fragment>);
  } catch {
    return content;
  }
};

const PracticeChallengeView = ({ level, challenges }: Props) => {
  const { formatMessage } = useIntl();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgressState] = useState<PracticeProgress>(null);
  const [index, setIndex] = useState(0);
  const [regex, setRegex] = useState('');
  const [flags, setFlags] = useState('');
  const [hasEdited, setHasEdited] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const challenge = challenges[index];
  const validation = useMemo(
    () => validatePracticeSolution(challenge, regex, flags),
    [challenge, regex, flags],
  );
  const isCompleted = progress?.completed.includes(challenge.id);
  const passed = hasEdited && validation.passed;
  const completedCount =
    progress?.completed.filter(id => challenges.some(challenge => challenge.id === id)).length || 0;

  useEffect(() => {
    const stored = getPracticeProgress();
    const storedChallenge = stored.currentByLevel[level.id];
    const storedIndex = challenges.findIndex(item => item.id === storedChallenge);
    setIndex(storedIndex >= 0 ? storedIndex : 0);
    setProgressState(stored);
    setMounted(true);
  }, [challenges, level.id]);

  useEffect(() => {
    setRegex(challenge.initialValue || '');
    setFlags(challenge.initialFlags || '');
    setHasEdited(false);
    setHintCount(0);
    setShowSolution(false);
    inputRef.current?.focus();

    if (progress) {
      const next = setCurrentPracticeChallenge(progress, level.id, challenge.id);
      setProgressState(next);
      setPracticeProgress(next);
    }
    // The progress object is intentionally excluded to avoid a persistence loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge.id, level.id]);

  useEffect(() => {
    if (!passed || !progress || isCompleted) return;

    const next = completePracticeChallenge(progress, challenge.id);
    setProgressState(next);
    setPracticeProgress(next);
    confetti({
      particleCount: index === challenges.length - 1 ? 300 : 100,
      spread: 100,
      origin: { y: 0.65 },
    });
  }, [challenge.id, challenges.length, index, isCompleted, passed, progress]);

  const goTo = (nextIndex: number) => {
    if (nextIndex >= 0 && nextIndex < challenges.length) setIndex(nextIndex);
  };

  useEventListener('keypress', event => {
    if (event.ctrlKey || event.key !== 'Enter') return;

    event.preventDefault();
    goTo(event.shiftKey ? index - 1 : index + 1);
  });

  const handleRegexChange = value => {
    setHasEdited(true);
    setRegex(value);
  };

  const handleFlagsChange = value => {
    setHasEdited(true);
    setFlags(value);
  };

  const handleReset = () => {
    if (!window.confirm(formatMessage({ id: 'practice.resetConfirm' }))) return;
    const next = resetPracticeLevel(
      progress,
      level.id,
      challenges.map(item => item.id),
    );
    setProgressState(next);
    setPracticeProgress(next);
    setHasEdited(false);
    setRegex(challenges[0].initialValue || '');
    setFlags(challenges[0].initialFlags || '');
    setIndex(0);
  };

  const status = hasEdited
    ? !validation.valid
      ? 'practice.invalidRegex'
      : passed
      ? 'practice.correct'
      : 'practice.keepTrying'
    : null;

  return (
    <div className="px-3 flex flex-col flex-1 min-h-screen relative overflow-x-hidden">
      <Header page="practice-detail" />

      <div className="flex flex-1 w-full max-w-6xl mx-auto gap-7 pb-4">
        <aside className="hidden lg:block w-64 shrink-0 my-auto max-h-[520px] overflow-y-auto bg-neutral-800/60 rounded-xl p-4">
          <h2 className="font-bold mb-4">
            <FormattedMessage id={level.title} />
          </h2>
          <div className="space-y-1">
            {challenges.map((item, challengeIndex) => (
              <button
                key={item.id}
                onClick={() => goTo(challengeIndex)}
                className={cx(
                  'w-full flex text-left items-center gap-2 rounded-md px-2 py-2 text-xs',
                  challengeIndex === index
                    ? 'bg-regreen-600 text-white'
                    : 'text-neutral-400 hover:bg-neutral-700 hover:text-white',
                )}
              >
                <Icon
                  icon={progress?.completed.includes(item.id) ? 'check' : 'document-duplicate'}
                  size={15}
                  className={progress?.completed.includes(item.id) ? 'text-regreen-400' : ''}
                />
                <span className="truncate">{formatMessage({ id: item.title })}</span>
              </button>
            ))}
          </div>
          <button
            className="text-xs text-neutral-500 hover:text-red-400 mt-5"
            onClick={handleReset}
          >
            <FormattedMessage id="practice.reset" />
          </button>
        </aside>

        <main className="flex flex-col flex-1 justify-center max-w-[800px] mx-auto min-w-0">
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-3">
            {challenges.map((item, challengeIndex) => (
              <button
                key={item.id}
                onClick={() => goTo(challengeIndex)}
                aria-label={formatMessage({ id: item.title })}
                className={cx(
                  'w-9 h-9 shrink-0 rounded-full text-xs',
                  challengeIndex === index ? 'bg-regreen-500' : 'bg-neutral-700',
                  progress?.completed.includes(item.id) && 'ring-1 ring-regreen-400',
                )}
              >
                {challengeIndex + 1}
              </button>
            ))}
          </div>

          <div className="text-center">
            <span className="text-xs text-neutral-500">
              <FormattedMessage id="practice.challenge" /> {index + 1}/{challenges.length}
            </span>
            <HighlightedText
              element="h1"
              className="text-3xl text-neutral-50 font-bold mt-2"
              text={formatMessage({ id: challenge.title })}
              attrs={{ className: 'px-2 bg-neutral-700 rounded-md', dir: 'ltr' }}
            />
            <HighlightedText
              element="p"
              className="text-neutral-300 mt-4"
              text={formatMessage({ id: challenge.description })}
              attrs={{
                className: 'p-1 text-xs rounded-md bg-neutral-700 tracking-widest',
                dir: 'ltr',
              }}
            />
          </div>

          <div dir="ltr">
            <div
              className="bg-jet-400 my-5 p-4 pt-6 text-xs rounded-md relative tracking-wider text-neutral-300 leading-6 text-left w-full whitespace-pre-wrap"
              data-title={formatMessage({ id: 'general.text' })}
            >
              <span className="absolute -top-3 left-2 bg-jet-500 text-[10px] text-neutral-400 py-1 px-2 rounded-md">
                <FormattedMessage id="general.text" />
              </span>
              {renderMatches(challenge.testCases[0].content, regex, flags)}
            </div>

            <div
              className={cx(
                'bg-jet-400 mt-5 p-4 pt-6 text-xs rounded-md relative flex flex-col items-center',
                hasEdited && !passed && 'outline outline-1 outline-red-400',
                passed && 'outline outline-1 outline-regreen-400',
              )}
            >
              <span className="absolute -top-3 left-2 bg-jet-500 text-[10px] text-neutral-400 py-1 px-2 rounded-md">
                <FormattedMessage id="general.regex" />
              </span>
              <div
                className="bg-jet-500 px-4 py-2 mb-3 rounded-md flex items-center justify-center max-w-[95%]"
                data-flags={flags}
              >
                <span className="text-neutral-500">/</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={regex}
                  onChange={event => handleRegexChange(event.target.value)}
                  className="bg-transparent border-0 outline-none !ring-0 text-center min-w-[80px] max-w-full px-2 text-sm tracking-widest text-regreen-400"
                  style={{ width: Math.max(regex.length * 11, 80) }}
                  spellCheck={false}
                />
                <span className="text-neutral-500">
                  /<span className="text-regreen-400">{flags}</span>
                </span>
              </div>
              <FlagBox flags={flags} setFlags={handleFlagsChange} />
              {status && (
                <p
                  className={cx(
                    'mt-4 text-xs',
                    passed ? 'text-regreen-400' : 'text-red-400',
                  )}
                >
                  <FormattedMessage id={status} />
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {hintCount < challenge.hints.length && (
              <Button
                className="!py-2 bg-neutral-700 hover:bg-neutral-600"
                onClick={() => setHintCount(count => count + 1)}
              >
                <FormattedMessage id={hintCount ? 'practice.nextHint' : 'practice.hint'} />
              </Button>
            )}
            {hintCount === challenge.hints.length && !showSolution && (
              <Button
                className="!py-2 bg-neutral-700 hover:bg-neutral-600"
                onClick={() => setShowSolution(true)}
              >
                <FormattedMessage id="practice.solution" />
              </Button>
            )}
          </div>
          {challenge.hints.slice(0, hintCount).map(hint => (
            <p key={hint} className="text-center text-xs text-neutral-400 mt-3">
              <FormattedMessage id={hint} />
            </p>
          ))}
          {showSolution && (
            <div dir="ltr" className="mx-auto mt-3 bg-neutral-800 px-3 py-2 rounded-md text-sm">
              <span className="text-neutral-500">
                <FormattedMessage id="practice.referenceSolution" />:{' '}
              </span>
              <code className="text-regreen-400">
                /{challenge.solution.regex}/{challenge.solution.flags}
              </code>
            </div>
          )}

          {completedCount === challenges.length && (
            <div className="text-center text-regreen-400 font-bold mt-5">
              <FormattedMessage id="practice.levelComplete" />
            </div>
          )}

          <div className="flex items-end justify-between mt-8 min-h-[52px]">
            <div className="w-1/3">
              {index > 0 && (
                <button className="inline-flex items-center hover:text-regreen-400" onClick={() => goTo(index - 1)}>
                  <Icon icon="arrow-left" size={20} className="mr-1 rtl:rotate-180" />
                  <FormattedMessage id="general.prev" />
                </button>
              )}
            </div>
            <IntlLink
              href="/[lang]/practice"
              className="text-xs text-neutral-500 hover:text-neutral-200 text-center"
            >
              <FormattedMessage id="practice.backToLevels" />
            </IntlLink>
            <div className="w-1/3 text-right">
              {index < challenges.length - 1 && (
                <button className="inline-flex items-center hover:text-regreen-400" onClick={() => goTo(index + 1)}>
                  <FormattedMessage id="general.next" />
                  <Icon icon="arrow-right" size={20} className="ml-1 rtl:rotate-180" />
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      {mounted &&
        createPortal(
          <Progress current={index + 1} total={challenges.length} />,
          window.document.getElementById('ProgressArea'),
        )}
    </div>
  );
};

export default PracticeChallengeView;
