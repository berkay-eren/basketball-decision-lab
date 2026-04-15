# basketball-anticipation-lab

A tiny browser-based behavioral experiment for studying how participants predict the next action in basketball scenes.

## File structure

```text
/index.html
/style.css
/script.js
/README.md
/stimuli/   (put local image/video files here)
/data/      (optional folder)
```

## How to run

1. Open `/home/runner/work/basketball-anticipation-lab/basketball-anticipation-lab/index.html` in a browser.
2. Enter a participant ID.
3. Click **Start Experiment**.
4. Respond during each trial using:
   - **A** = pass
   - **S** = shoot
   - **D** = drive

No installation, server, or backend is required.

## How trials work

Each trial follows this sequence:

1. Fixation cross (500 ms)
2. Stimulus presentation
   - Image stimuli are shown for 1500 ms
   - Video stimuli play until the end
3. Response prompt appears
4. Participant responds with A/S/D
5. Inter-trial interval (500 ms)

The script records participant ID, trial metadata, key response, response label, timestamp, and reaction time.

## How to add or edit trials

Edit the `TRIALS` array in `/home/runner/work/basketball-anticipation-lab/basketball-anticipation-lab/script.js`.

Each trial object should include:

- `trial_id`
- `stimulus`
- `stimulus_type` (`"image"` or `"video"`)
- `prompt`
- `response_options`
- `correct_answer` (optional for analysis)

Three sample dummy trials are included by default.

## How to add local stimuli

1. Put your files in `/home/runner/work/basketball-anticipation-lab/basketball-anticipation-lab/stimuli/`.
2. Reference those files in each trial using paths like:
   - `stimuli/my_scene_01.jpg`
   - `stimuli/my_clip_02.mp4`

If a stimulus file is missing or fails to load, the experiment shows a visible placeholder and still continues.

## How to download CSV results

At the end of the experiment, click **Download Results CSV**.

- Data is stored in memory during the session.
- CSV export is generated fully in the browser.
- Trial records are also logged to the browser console for debugging.
