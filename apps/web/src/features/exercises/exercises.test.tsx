import type { Exercise } from '@arabic/shared';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { en } from '../../i18n';

import { BuildExercise } from './BuildExercise';
import { ChooseExercise } from './ChooseExercise';
import { ExercisePlayer, scoreOf } from './ExercisePlayer';
import { GapExercise } from './GapExercise';
import { ListenExercise } from './ListenExercise';
import { MatchExercise } from './MatchExercise';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

const status = () => screen.getByRole('status');

function stubArabicVoice() {
  const speak = vi.fn();
  vi.stubGlobal('speechSynthesis', {
    getVoices: () => [{ lang: 'ar-SA', name: 'Arabic' }],
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    cancel: vi.fn(),
    speak,
  });
  vi.stubGlobal(
    'SpeechSynthesisUtterance',
    class {
      text: string;
      constructor(text: string) {
        this.text = text;
      }
    },
  );
  return speak;
}

describe('choose', () => {
  const props = { prompt: 'How do you say “hello”?', options: ['مَرْحَبًا', 'شُكْرًا'], answer: 0 };

  it('says right for the right option', async () => {
    const onAnswered = vi.fn();
    render(<ChooseExercise {...props} seed="s" onAnswered={onAnswered} />);
    await userEvent.click(screen.getByRole('radio', { name: 'مَرْحَبًا' }));
    await userEvent.click(screen.getByRole('button', { name: en['exercise.check'] }));
    expect(status()).toHaveTextContent(en['exercise.right']);
    expect(onAnswered).toHaveBeenCalledWith(true);
  });

  it('says wrong and shows the right answer for a wrong option', async () => {
    const onAnswered = vi.fn();
    render(<ChooseExercise {...props} seed="s" onAnswered={onAnswered} />);
    await userEvent.click(screen.getByRole('radio', { name: 'شُكْرًا' }));
    await userEvent.click(screen.getByRole('button', { name: en['exercise.check'] }));
    expect(status()).toHaveTextContent(`${en['exercise.wrong']} مَرْحَبًا`);
    expect(onAnswered).toHaveBeenCalledWith(false);
  });

  it('can be answered with the keyboard alone', async () => {
    const onAnswered = vi.fn();
    render(<ChooseExercise {...props} onAnswered={onAnswered} />);
    await userEvent.tab();
    expect(screen.getByRole('radio', { name: 'مَرْحَبًا' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'شُكْرًا' })).toBeChecked();
    await userEvent.keyboard('{ArrowUp}');
    await userEvent.tab();
    expect(screen.getByRole('button', { name: en['exercise.check'] })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onAnswered).toHaveBeenCalledWith(true);
  });

  it('keeps the answer right whatever order the seed shuffles the options into', async () => {
    const options = ['أ', 'ب', 'ت', 'ث'];
    for (const seed of ['a', 'b', 'c']) {
      const onAnswered = vi.fn();
      const { unmount } = render(
        <ChooseExercise
          prompt="Which is ت?"
          options={options}
          answer={2}
          seed={seed}
          onAnswered={onAnswered}
        />,
      );
      await userEvent.click(screen.getByRole('radio', { name: 'ت' }));
      await userEvent.click(screen.getByRole('button', { name: en['exercise.check'] }));
      expect(onAnswered).toHaveBeenCalledWith(true);
      unmount();
    }
  });
});

describe('listen', () => {
  const props = {
    prompt: 'Listen and choose the word you hear.',
    audio: 'بَابٌ',
    options: ['بَابٌ', 'بَابَا'],
    answer: 0,
  };

  it('plays the sound with an Arabic voice and grades the pick', async () => {
    const speak = stubArabicVoice();
    const onAnswered = vi.fn();
    render(<ListenExercise {...props} onAnswered={onAnswered} />);
    await userEvent.click(screen.getByRole('button', { name: en['exercise.play'] }));
    expect(speak).toHaveBeenCalledWith(expect.objectContaining({ text: 'بَابٌ' }));
    await userEvent.click(screen.getByRole('radio', { name: 'بَابَا' }));
    await userEvent.click(screen.getByRole('button', { name: en['exercise.check'] }));
    expect(onAnswered).toHaveBeenCalledWith(false);
    expect(status()).toHaveTextContent(`${en['exercise.wrong']} بَابٌ`);
  });

  it('turns into a reading question on a device with no Arabic voice', async () => {
    const onAnswered = vi.fn();
    render(<ListenExercise {...props} onAnswered={onAnswered} />);
    expect(screen.queryByRole('button', { name: en['exercise.play'] })).not.toBeInTheDocument();
    expect(screen.getByText(en['exercise.listen.read'])).toBeVisible();
    expect(screen.getByText(en['exercise.listen.noVoice'])).toBeVisible();
    await userEvent.click(screen.getByRole('radio', { name: 'بَابٌ' }));
    await userEvent.click(screen.getByRole('button', { name: en['exercise.check'] }));
    expect(onAnswered).toHaveBeenCalledWith(true);
  });
});

describe('gap', () => {
  const props = {
    prompt: 'Fill the gap.',
    before: '',
    after: 'آدَمُ',
    english: 'My name is Adam.',
    options: ['اسْمِي', 'حَالُكَ'],
    answer: 0,
  };

  it('fills the blank with the pick and grades it right', async () => {
    const onAnswered = vi.fn();
    render(<GapExercise {...props} seed="g" onAnswered={onAnswered} />);
    expect(screen.getByText(en['exercise.gap.blank'])).toBeInTheDocument();
    await userEvent.click(screen.getByRole('radio', { name: 'اسْمِي' }));
    await userEvent.click(screen.getByRole('button', { name: en['exercise.check'] }));
    expect(onAnswered).toHaveBeenCalledWith(true);
    expect(status()).toHaveTextContent(en['exercise.right']);
  });

  it('grades a wrong pick wrong and shows the right word in the blank', async () => {
    const onAnswered = vi.fn();
    render(<GapExercise {...props} seed="g" onAnswered={onAnswered} />);
    await userEvent.click(screen.getByRole('radio', { name: 'حَالُكَ' }));
    await userEvent.click(screen.getByRole('button', { name: en['exercise.check'] }));
    expect(onAnswered).toHaveBeenCalledWith(false);
    expect(status()).toHaveTextContent(`${en['exercise.wrong']} اسْمِي`);
  });

  it('can be answered with the keyboard alone', async () => {
    const onAnswered = vi.fn();
    render(<GapExercise {...props} onAnswered={onAnswered} />);
    await userEvent.tab();
    await userEvent.keyboard(' ');
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    expect(onAnswered).toHaveBeenCalledWith(true);
  });
});

describe('build', () => {
  const props = {
    prompt: 'Build the sentence.',
    english: 'I am Adam.',
    words: ['أَنَا', 'آدَمُ'],
    distractors: ['اسْمِي'],
  };
  const answerLine = () => screen.getByRole('group', { name: en['exercise.build.answer'] });
  const bank = () => screen.getByRole('group', { name: en['exercise.build.bank'] });

  it('builds the sentence from tiles in order and grades it right', async () => {
    const onAnswered = vi.fn();
    render(<BuildExercise {...props} seed="b" onAnswered={onAnswered} />);
    expect(screen.getByRole('button', { name: en['exercise.check'] })).toBeDisabled();
    await userEvent.click(within(bank()).getByRole('button', { name: 'أَنَا' }));
    await userEvent.click(within(bank()).getByRole('button', { name: 'آدَمُ' }));
    expect(within(answerLine()).getAllByRole('button')).toHaveLength(2);
    await userEvent.click(screen.getByRole('button', { name: en['exercise.check'] }));
    expect(onAnswered).toHaveBeenCalledWith(true);
  });

  it('takes a tile back off the line, and grades a wrong order wrong', async () => {
    const onAnswered = vi.fn();
    render(<BuildExercise {...props} seed="b" onAnswered={onAnswered} />);
    await userEvent.click(within(bank()).getByRole('button', { name: 'اسْمِي' }));
    await userEvent.click(within(answerLine()).getByRole('button', { name: /^Remove\s*اسْمِي/ }));
    expect(within(answerLine()).queryAllByRole('button')).toHaveLength(0);
    await userEvent.click(within(bank()).getByRole('button', { name: 'آدَمُ' }));
    await userEvent.click(within(bank()).getByRole('button', { name: 'أَنَا' }));
    await userEvent.click(screen.getByRole('button', { name: en['exercise.check'] }));
    expect(onAnswered).toHaveBeenCalledWith(false);
    expect(status()).toHaveTextContent(`${en['exercise.wrong']} أَنَا آدَمُ`);
  });

  it('can be built with the keyboard alone', async () => {
    const onAnswered = vi.fn();
    render(<BuildExercise {...props} seed="b" onAnswered={onAnswered} />);
    within(bank()).getByRole('button', { name: 'أَنَا' }).focus();
    await userEvent.keyboard('{Enter}');
    within(bank()).getByRole('button', { name: 'آدَمُ' }).focus();
    await userEvent.keyboard(' ');
    screen.getByRole('button', { name: en['exercise.check'] }).focus();
    await userEvent.keyboard('{Enter}');
    expect(onAnswered).toHaveBeenCalledWith(true);
  });
});

describe('match', () => {
  const pairs = [
    { arabic: 'مَرْحَبًا', english: 'hello' },
    { arabic: 'شُكْرًا', english: 'thank you' },
    { arabic: 'بِخَيْرٍ', english: 'fine, well' },
  ];

  it('locks right pairs and finishes right with no wrong tries', async () => {
    const onAnswered = vi.fn();
    render(<MatchExercise prompt="Match them." pairs={pairs} onAnswered={onAnswered} />);
    for (const pair of pairs) {
      await userEvent.click(screen.getByRole('button', { name: pair.arabic }));
      await userEvent.click(screen.getByRole('button', { name: pair.english }));
    }
    expect(screen.getByRole('button', { name: 'hello' })).toHaveAttribute('aria-disabled', 'true');
    expect(status()).toHaveTextContent(en['exercise.match.done']);
    expect(onAnswered).toHaveBeenCalledWith(true);
  });

  it('flashes a wrong pair, counts it, and finishes wrong', async () => {
    const onAnswered = vi.fn();
    render(<MatchExercise prompt="Match them." pairs={pairs} onAnswered={onAnswered} />);
    await userEvent.click(screen.getByRole('button', { name: 'مَرْحَبًا' }));
    await userEvent.click(screen.getByRole('button', { name: 'thank you' }));
    expect(status()).toHaveTextContent(en['exercise.match.wrong']);
    expect(screen.getByRole('button', { name: 'thank you' })).toHaveClass('shake');
    expect(screen.getByRole('button', { name: 'thank you' })).not.toHaveAttribute('aria-disabled');
    // English first works too.
    for (const pair of [...pairs].reverse()) {
      await userEvent.click(screen.getByRole('button', { name: pair.english }));
      await userEvent.click(screen.getByRole('button', { name: pair.arabic }));
    }
    expect(status()).toHaveTextContent('All matched, with 1 wrong try.');
    expect(onAnswered).toHaveBeenCalledWith(false);
  });

  it('clears the red flash after a moment', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(<MatchExercise prompt="Match them." pairs={pairs} />);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await user.click(screen.getByRole('button', { name: 'مَرْحَبًا' }));
    await user.click(screen.getByRole('button', { name: 'thank you' }));
    expect(screen.getByRole('button', { name: 'thank you' })).toHaveClass('shake');
    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(screen.getByRole('button', { name: 'thank you' })).not.toHaveClass('shake');
  });

  it('can be matched with the keyboard alone', async () => {
    const onAnswered = vi.fn();
    render(<MatchExercise prompt="Match them." pairs={pairs} onAnswered={onAnswered} />);
    for (const pair of pairs) {
      screen.getByRole('button', { name: pair.arabic }).focus();
      await userEvent.keyboard('{Enter}');
      expect(screen.getByRole('button', { name: pair.arabic })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      screen.getByRole('button', { name: pair.english }).focus();
      await userEvent.keyboard(' ');
    }
    expect(onAnswered).toHaveBeenCalledWith(true);
  });
});

describe('exercise player', () => {
  const exercises: Exercise[] = [
    { type: 'choose', prompt: 'Pick hello', options: ['مَرْحَبًا', 'شُكْرًا'], answer: 0 },
    { type: 'choose', prompt: 'Pick thanks', options: ['مَرْحَبًا', 'شُكْرًا'], answer: 1 },
  ];

  async function answer(name: string) {
    await userEvent.click(screen.getByRole('radio', { name }));
    await userEvent.click(screen.getByRole('button', { name: en['exercise.check'] }));
  }

  it('scores first tries only', () => {
    expect(scoreOf({ 0: true, 1: false, 2: true }, 3)).toBe(67);
    expect(scoreOf({}, 0)).toBe(0);
  });

  it('brings a wrong exercise back once at the end and scores first tries', async () => {
    const onFinish = vi.fn();
    render(<ExercisePlayer exercises={exercises} seed="p" onFinish={onFinish} />);
    expect(screen.getByText('Exercise 1 of 2')).toBeVisible();
    await answer('شُكْرًا'); // wrong
    expect(screen.getByText(en['practice.again'])).toBeVisible();
    // Continue takes focus so Enter moves on.
    expect(screen.getByRole('button', { name: en['player.continue'] })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByText('Exercise 2 of 3')).toBeVisible();
    await answer('شُكْرًا'); // right
    await userEvent.click(screen.getByRole('button', { name: en['player.continue'] }));
    // The first one again.
    expect(screen.getByText('Pick hello')).toBeVisible();
    expect(screen.getByText(en['practice.retry'])).toBeVisible();
    await answer('شُكْرًا'); // wrong again: does not come back a second time
    await userEvent.click(screen.getByRole('button', { name: en['practice.finish'] }));
    expect(onFinish).toHaveBeenCalledWith(50);
  });

  it('scores 100 when everything is right first time', async () => {
    const onFinish = vi.fn();
    const onProgress = vi.fn();
    render(
      <ExercisePlayer exercises={exercises} seed="p" onFinish={onFinish} onProgress={onProgress} />,
    );
    await answer('مَرْحَبًا');
    expect(onProgress).toHaveBeenLastCalledWith(0.5);
    await userEvent.click(screen.getByRole('button', { name: en['player.continue'] }));
    await answer('شُكْرًا');
    await userEvent.click(screen.getByRole('button', { name: en['practice.finish'] }));
    expect(onFinish).toHaveBeenCalledWith(100);
  });
});
