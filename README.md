# Basketball Decision Lab

Basketball Decision Lab is a small browser-based experiment about predicting actions in basketball situations.

The basic idea is simple: the participant sees a basketball scene and tries to predict what the ball-handler will do next.

Possible responses:

- pass
- shoot
- drive

The experiment records:
- the participant’s response
- reaction time
- accuracy

## Why this project?

This project is meant to be a simple introduction to experimental thinking in cognitive science.

It focuses on a few basic ideas:

- perception
- prediction
- decision-making
- reaction time
- behavior under time pressure

Basketball is only the setting. The main goal is to build a small behavioral task and collect clean response data.

## First version

The first version is intentionally limited:

- still images will be used as the main stimuli
- short clips may be shown only as feedback during practice trials
- responses will be collected locally in the browser
- results will be exported for later analysis

## Planned experiment flow

1. Welcome screen
2. Instructions
3. Practice trials
4. Main trials
5. End screen
6. Result export

## Trial structure

A typical trial will work like this:

1. A fixation cross appears briefly
2. A basketball image is shown
3. The participant chooses one response:
   - pass
   - shoot
   - drive
4. The system records the response and reaction time

In later versions, different time limits can be used to test how time pressure affects prediction.

## Project structure

- `public/` → base HTML
- `src/` → experiment logic and styles
- `stimuli/images/` → image stimuli
- `stimuli/clips/` → short feedback clips for practice
- `stimuli/stimuli.csv` → stimulus metadata
- `data/results/` → exported results
- `analysis/` → notebook for later analysis

## Current goal

The current goal is to build a clean first version of the experiment loop before adding more complexity.