// Minimal editable trial list.
// You can switch between image and video stimuli by changing stimulus_type.
const TRIALS = [
  {
    trial_id: "t01_image_dummy",
    stimulus: "stimuli/example_scene_1.jpg",
    stimulus_type: "image",
    prompt: "What happens next?",
    response_options: { A: "pass", S: "shoot", D: "drive" },
    correct_answer: "pass"
  },
  {
    trial_id: "t02_video_dummy",
    stimulus: "stimuli/example_scene_2.mp4",
    stimulus_type: "video",
    prompt: "What happens next?",
    response_options: { A: "pass", S: "shoot", D: "drive" },
    correct_answer: "shoot"
  },
  {
    trial_id: "t03_image_dummy",
    stimulus: "stimuli/example_scene_3.png",
    stimulus_type: "image",
    prompt: "What happens next?",
    response_options: { A: "pass", S: "shoot", D: "drive" },
    correct_answer: "drive"
  }
];

const FIXATION_MS = 500;
const IMAGE_MS = 1500;
const ITI_MS = 500;

const keyToLabel = { a: "pass", s: "shoot", d: "drive" };

let participantId = "";
let trialIndex = 0;
let trialData = [];
let responseStartTime = null;
let awaitingResponse = false;

const welcomeScreen = document.getElementById("welcome-screen");
const trialScreen = document.getElementById("trial-screen");
const endScreen = document.getElementById("end-screen");

const participantInput = document.getElementById("participant-id");
const startButton = document.getElementById("start-button");
const startStatus = document.getElementById("start-status");

const trialCounter = document.getElementById("trial-counter");
const fixationEl = document.getElementById("fixation");
const stimulusArea = document.getElementById("stimulus-area");
const responseArea = document.getElementById("response-area");
const promptText = document.getElementById("prompt-text");
const responseStatus = document.getElementById("response-status");

const completionSummary = document.getElementById("completion-summary");
const downloadButton = document.getElementById("download-button");

startButton.addEventListener("click", startExperiment);
downloadButton.addEventListener("click", downloadCsv);
window.addEventListener("keydown", onResponseKey);

function startExperiment() {
  const enteredId = participantInput.value.trim();

  if (!enteredId) {
    startStatus.textContent = "Please enter a participant ID before starting.";
    return;
  }

  participantId = enteredId;
  trialIndex = 0;
  trialData = [];
  startStatus.textContent = "";

  showScreen("trial");
  runTrial();
}

function showScreen(screenName) {
  welcomeScreen.classList.add("hidden");
  trialScreen.classList.add("hidden");
  endScreen.classList.add("hidden");

  if (screenName === "welcome") welcomeScreen.classList.remove("hidden");
  if (screenName === "trial") trialScreen.classList.remove("hidden");
  if (screenName === "end") endScreen.classList.remove("hidden");
}

function clearTrialDisplay() {
  fixationEl.classList.add("hidden");
  stimulusArea.classList.add("hidden");
  responseArea.classList.add("hidden");
  responseStatus.textContent = "";
  stimulusArea.innerHTML = "";
}

function runTrial() {
  if (trialIndex >= TRIALS.length) {
    endExperiment();
    return;
  }

  clearTrialDisplay();

  const trial = TRIALS[trialIndex];
  trialCounter.textContent = `Trial ${trialIndex + 1} / ${TRIALS.length}`;

  showFixation()
    .then(() => showStimulus(trial))
    .then(() => showResponsePrompt(trial));
}

function showFixation() {
  return new Promise((resolve) => {
    fixationEl.classList.remove("hidden");

    setTimeout(() => {
      fixationEl.classList.add("hidden");
      resolve();
    }, FIXATION_MS);
  });
}

function showStimulus(trial) {
  return new Promise((resolve) => {
    stimulusArea.classList.remove("hidden");

    if (trial.stimulus_type === "video") {
      const video = document.createElement("video");
      video.src = trial.stimulus;
      video.autoplay = true;
      video.muted = true;
      video.playsInline = true;
      video.controls = false;

      let finished = false;

      const finalize = () => {
        if (finished) return;
        finished = true;
        resolve();
      };

      video.addEventListener("ended", finalize);
      video.addEventListener("error", () => {
        renderStimulusPlaceholder(`Stimulus failed to load: ${trial.stimulus}`);
        setTimeout(finalize, 800);
      });

      stimulusArea.appendChild(video);

      video.play().catch(() => {
        renderStimulusPlaceholder(`Video could not play: ${trial.stimulus}`);
        setTimeout(finalize, 800);
      });

      return;
    }

    const img = document.createElement("img");
    img.src = trial.stimulus;
    img.alt = "Basketball scene";

    img.addEventListener("load", () => {
      setTimeout(resolve, IMAGE_MS);
    });

    img.addEventListener("error", () => {
      renderStimulusPlaceholder(`Stimulus failed to load: ${trial.stimulus}`);
      setTimeout(resolve, IMAGE_MS);
    });

    stimulusArea.appendChild(img);
  });
}

function renderStimulusPlaceholder(message) {
  stimulusArea.innerHTML = "";
  const placeholder = document.createElement("div");
  placeholder.className = "placeholder";
  placeholder.innerHTML = `<div><strong>Stimulus unavailable</strong><br />${message}</div>`;
  stimulusArea.appendChild(placeholder);
}

function showResponsePrompt(trial) {
  responseArea.classList.remove("hidden");
  promptText.textContent = trial.prompt || "What happens next?";

  responseStartTime = performance.now();
  awaitingResponse = true;
}

function onResponseKey(event) {
  if (!awaitingResponse) return;

  const key = event.key.toLowerCase();
  if (!(key in keyToLabel)) return;

  awaitingResponse = false;

  const trial = TRIALS[trialIndex];
  const rt = Math.round(performance.now() - responseStartTime);
  const responseLabel = keyToLabel[key];

  const record = {
    participant_id: participantId,
    trial_index: trialIndex,
    trial_id: trial.trial_id,
    stimulus_path: trial.stimulus,
    stimulus_type: trial.stimulus_type,
    timestamp: new Date().toISOString(),
    key_pressed: key.toUpperCase(),
    response_label: responseLabel,
    reaction_time_ms: rt,
    correct_answer: trial.correct_answer || ""
  };

  trialData.push(record);
  console.log("Trial record:", record);

  responseStatus.textContent = `Recorded: ${key.toUpperCase()} (${responseLabel})`;

  setTimeout(() => {
    trialIndex += 1;
    runTrial();
  }, ITI_MS);
}

function endExperiment() {
  showScreen("end");
  completionSummary.textContent = `Participant: ${participantId} | Trials completed: ${trialData.length}`;
}

function downloadCsv() {
  if (trialData.length === 0) {
    alert("No data to download yet.");
    return;
  }

  const headers = [
    "participant_id",
    "trial_index",
    "trial_id",
    "stimulus_path",
    "stimulus_type",
    "timestamp",
    "key_pressed",
    "response_label",
    "reaction_time_ms",
    "correct_answer"
  ];

  const rows = trialData.map((row) => headers.map((h) => escapeCsv(String(row[h] ?? ""))).join(","));
  const csv = [headers.join(","), ...rows].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safeId = participantId.replace(/[^a-z0-9_-]/gi, "_");
  a.href = url;
  a.download = `basketball_anticipation_${safeId || "participant"}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeCsv(value) {
  if (value.includes(",") || value.includes("\"") || value.includes("\n")) {
    return `"${value.replace(/\"/g, "\"\"")}"`;
  }
  return value;
}
