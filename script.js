let voices = [];
let utterance;

// Load voices
function loadVoices() {
  voices = speechSynthesis.getVoices();

  const voiceSelect = document.getElementById("voice");
  voiceSelect.innerHTML = "";

  voices.forEach((voice, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

// Languages (browser supported ones)
const languages = ["en-US", "en-GB", "hi-IN"];

window.onload = () => {
  const langSelect = document.getElementById("language");

  languages.forEach(lang => {
    const opt = document.createElement("option");
    opt.value = lang;
    opt.textContent = lang;
    langSelect.appendChild(opt);
  });

  loadVoices();
};

speechSynthesis.onvoiceschanged = loadVoices;

// 🎤 Speak text
function speakText() {
  const text = document.getElementById("text").value;
  if (!text) return;

  const voiceIndex = document.getElementById("voice").value;
  const speed = document.getElementById("speed").value;
  const pitch = document.getElementById("pitch").value;
  const lang = document.getElementById("language").value;

  speechSynthesis.cancel();

  utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voices[voiceIndex];
  utterance.rate = speed;
  utterance.pitch = pitch;
  utterance.lang = lang;

  speechSynthesis.speak(utterance);
}

// ⏹ Stop speech
function stopSpeech() {
  speechSynthesis.cancel();
}

// 💾 Record speech (browser limitation workaround)
function recordSpeech() {
  const text = document.getElementById("text").value;
  if (!text) return;

  const stream = new MediaStream();
  const recorder = new MediaRecorder(stream);
  const chunks = [];

  recorder.ondataavailable = e => chunks.push(e.data);

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "audio/webm" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "voice.webm";
    a.click();
  };

  recorder.start();

  const synth = new SpeechSynthesisUtterance(text);
  synth.onend = () => recorder.stop();

  speechSynthesis.speak(synth);
}
