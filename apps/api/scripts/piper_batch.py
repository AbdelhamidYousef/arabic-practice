"""Turn Arabic lines into WAV files with Piper, loading the voice once.

Called by audio-build.ts (never by the app). Reads one JSON object per stdin line,
{"text": "...", "out": "/path/file.wav"}, writes the file, and prints the out path when done.

Piper's own diacritizer (`use_tashkeel`) is switched off: the course text already carries full
harakat, written and checked by people, and the clip must say exactly what the learner reads.
`length_scale` 1.15 slows speech a little for learners (the browser voice used rate 0.85).
"""

import json
import sys
import wave

from piper import PiperVoice, SynthesisConfig


def main() -> None:
    model = sys.argv[1]
    voice = PiperVoice.load(model)
    voice.use_tashkeel = False
    config = SynthesisConfig(length_scale=1.15)
    for line in sys.stdin:
        if not line.strip():
            continue
        job = json.loads(line)
        with wave.open(job["out"], "wb") as wav:
            voice.synthesize_wav(job["text"], wav, syn_config=config)
        print(job["out"], flush=True)


if __name__ == "__main__":
    main()
