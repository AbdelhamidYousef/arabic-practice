import { audioKey } from '@arabic/shared';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ListenExercise } from '../features/exercises/ListenExercise';
import { en } from '../i18n';

import { playArabic, primeAudioManifest, useArabicAudio } from './audio';

const WORD = 'شُكْرًا';

function stubVoice(available: boolean) {
  const speak = vi.fn();
  vi.stubGlobal('speechSynthesis', {
    getVoices: () => (available ? [{ lang: 'ar-SA', name: 'Arabic' }] : []),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    cancel: vi.fn(),
    speak,
  });
  vi.stubGlobal('SpeechSynthesisUtterance', class {});
  return speak;
}

function stubAudio(play: () => Promise<void> = () => Promise.resolve()) {
  const made: string[] = [];
  vi.stubGlobal(
    'Audio',
    class {
      constructor(public src: string) {
        made.push(src);
      }
      play = play;
      pause = vi.fn();
    },
  );
  return made;
}

function Probe({ text }: { text: string }) {
  const p = useArabicAudio();
  return <span>{p.canPlay(text) ? 'yes' : 'no'}</span>;
}

afterEach(() => primeAudioManifest(null));

describe('recorded audio', () => {
  it('plays the clip named by the text hash when the manifest has it, without the voice', () => {
    const speak = stubVoice(true);
    const made = stubAudio();
    primeAudioManifest([WORD]);
    playArabic(WORD);
    expect(made).toEqual([`/audio/${audioKey(WORD)}.mp3`]);
    expect(speak).not.toHaveBeenCalled();
  });

  it('falls back to the device voice when there is no clip', () => {
    const speak = stubVoice(true);
    const made = stubAudio();
    primeAudioManifest([]);
    playArabic(WORD);
    expect(made).toEqual([]);
    expect(speak).toHaveBeenCalledOnce();
  });

  it('falls back to the device voice when the clip fails to play', async () => {
    const speak = stubVoice(true);
    stubAudio(() => Promise.reject(new Error('blocked')));
    primeAudioManifest([WORD]);
    playArabic(WORD);
    await vi.waitFor(() => expect(speak).toHaveBeenCalledOnce());
  });

  it('can play with a clip and no voice, and cannot with neither; updates when the manifest arrives', () => {
    stubVoice(false);
    render(<Probe text={WORD} />);
    expect(screen.getByText('no')).toBeInTheDocument();
    act(() => primeAudioManifest([WORD]));
    expect(screen.getByText('yes')).toBeInTheDocument();
  });

  it('keeps the listen exercise a listening one on a device without a voice when a clip exists', async () => {
    stubVoice(false);
    const made = stubAudio();
    primeAudioManifest([WORD]);
    render(
      <ListenExercise prompt="Listen and choose" audio={WORD} options={[WORD, 'نَعَمْ']} answer={0} />,
    );
    await userEvent.click(screen.getByRole('button', { name: en['exercise.play'] }));
    expect(made).toEqual([`/audio/${audioKey(WORD)}.mp3`]);
  });
});
