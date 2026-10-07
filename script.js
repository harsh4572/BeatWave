const playBtn = document.getElementById("playBtn");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");

const album = document.querySelector(".album");
const audioPlayer = document.getElementById("audioPlayer");

const progress = document.querySelector(".progress");
const currentTimeText = document.querySelector(".time span:first-child");
const durationText = document.querySelector(".time span:last-child");

const progressBar = document.querySelector(".progress-bar");

const volumeSlider = document.getElementById("volumeSlider");
const volumePercentage = document.getElementById("volumePercentage");

const muteBtn = document.getElementById("muteBtn");
const volumeDownBtn = document.getElementById("volumeDownBtn");
const volumeUpBtn = document.getElementById("volumeUpBtn");
const fullVolumeBtn = document.getElementById("fullVolumeBtn");

const repeatBtn = document.getElementById("repeatBtn");
const shuffleBtn = document.getElementById("shuffleBtn");

const visualizerBars = document.querySelectorAll(".visualizer span");

const voiceControlBtn = document.getElementById("voiceControlBtn");
const clapControlBtn = document.getElementById("clapControlBtn");

const voiceStatus = document.getElementById("voiceStatus");


// ======================================================
// SONG PLAYLIST
// ======================================================

const songs = [
    {
        title: "For a Reason",
        artist: "BeatWave Artist",
        file: "music/For a reason.mp3"
    },

    {
        title: "Lag Ja Gale",
        artist: "BeatWave Artist",
        file: "music/Lag ja gale.mp3"
    },

    {
        title: "Give Me Some Sunshine",
        artist: "BeatWave Artist",
        file: "music/Give me some sunshine.mp3"
    }
];


let currentSongIndex = 0;
let isPlaying = false;


// ======================================================
// REPEAT / SHUFFLE
// ======================================================

let repeatMode = false;
let shuffleMode = false;


// ======================================================
// VOLUME MEMORY
// ======================================================

let lastVolume = 0.8;


// ======================================================
// LOAD SONG
// ======================================================

function loadSong(index) {

    currentSongIndex = index;

    audioPlayer.src = songs[index].file;

    document.querySelector(".song-info h2").textContent =
        songs[index].title;

    document.querySelector(".song-info > p:last-child").textContent =
        songs[index].artist;

    progress.style.width = "0%";

    currentTimeText.textContent = "0:00";
    durationText.textContent = "0:00";

    audioPlayer.load();
}


// ======================================================
// PLAY SONG
// ======================================================

function playSong() {

    audioPlayer.play()
        .then(() => {

            playBtn.textContent = "Ⅱ";

            album.style.animationPlayState = "running";

            isPlaying = true;

            startVisualizer();

        })
        .catch((error) => {

            console.log("Play error:", error);

        });
}


// ======================================================
// STOP / PAUSE SONG
// ======================================================

function stopSong() {

    audioPlayer.pause();

    playBtn.textContent = "▶";

    album.style.animationPlayState = "paused";

    isPlaying = false;

    stopVisualizer();
}


// ======================================================
// PLAY / STOP BUTTON
// ======================================================

playBtn.addEventListener("click", () => {

    if (isPlaying) {

        stopSong();

    } else {

        playSong();

    }

});


// ======================================================
// SONG DURATION
// ======================================================

audioPlayer.addEventListener("loadedmetadata", () => {

    durationText.textContent =
        formatTime(audioPlayer.duration);

});


// ======================================================
// PROGRESS
// ======================================================

audioPlayer.addEventListener("timeupdate", () => {

    if (!audioPlayer.duration) {
        return;
    }

    const percentage =
        (audioPlayer.currentTime /
            audioPlayer.duration) * 100;

    progress.style.width =
        percentage + "%";

    currentTimeText.textContent =
        formatTime(audioPlayer.currentTime);

});


// ======================================================
// SONG ENDED
// ======================================================

audioPlayer.addEventListener("ended", () => {

    if (repeatMode) {

        audioPlayer.currentTime = 0;

        playSong();

        return;
    }

    playNextSong();

});


// ======================================================
// FORMAT TIME
// ======================================================

function formatTime(time) {

    if (isNaN(time)) {
        return "0:00";
    }

    const minutes =
        Math.floor(time / 60);

    const seconds =
        Math.floor(time % 60);

    return minutes + ":" +
        seconds.toString().padStart(2, "0");
}


// ======================================================
// SEEK
// ======================================================

progressBar.addEventListener("click", (event) => {

    if (!audioPlayer.duration) {
        return;
    }

    const percentage =
        event.offsetX /
        progressBar.clientWidth;

    audioPlayer.currentTime =
        percentage *
        audioPlayer.duration;

});


// ======================================================
// VOLUME PERCENTAGE
// ======================================================

function updateVolumePercentage() {

    const percentage =
        Math.round(audioPlayer.volume * 100);

    volumePercentage.textContent =
        percentage + "%";
}


// ======================================================
// MUTE BUTTON
// ======================================================

function updateMuteButton() {

    if (audioPlayer.volume === 0) {

        muteBtn.textContent = "🔇";

    } else {

        muteBtn.textContent = "🔊";

    }
}


// ======================================================
// VOLUME SLIDER
// ======================================================

volumeSlider.addEventListener("input", () => {

    audioPlayer.volume =
        Number(volumeSlider.value);

    if (audioPlayer.volume > 0) {

        lastVolume =
            audioPlayer.volume;

    }

    updateMuteButton();

    updateVolumePercentage();

});


// ======================================================
// MUTE / UNMUTE
// ======================================================

function toggleMute() {

    if (audioPlayer.volume > 0) {

        lastVolume =
            audioPlayer.volume;

        audioPlayer.volume = 0;

    } else {

        audioPlayer.volume =
            lastVolume > 0
                ? lastVolume
                : 0.8;

    }

    volumeSlider.value =
        audioPlayer.volume;

    updateMuteButton();

    updateVolumePercentage();

}


// ======================================================
// VOLUME DOWN
// ======================================================

function volumeDown() {

    audioPlayer.volume =
        Math.max(
            0,
            audioPlayer.volume - 0.1
        );

    if (audioPlayer.volume > 0) {

        lastVolume =
            audioPlayer.volume;

    }

    volumeSlider.value =
        audioPlayer.volume;

    updateMuteButton();

    updateVolumePercentage();

}


// ======================================================
// VOLUME UP
// ======================================================

function volumeUp() {

    audioPlayer.volume =
        Math.min(
            1,
            audioPlayer.volume + 0.1
        );

    if (audioPlayer.volume > 0) {

        lastVolume =
            audioPlayer.volume;

    }

    volumeSlider.value =
        audioPlayer.volume;

    updateMuteButton();

    updateVolumePercentage();

}


// ======================================================
// FULL VOLUME
// ======================================================

function fullVolume() {

    audioPlayer.volume = 1;

    lastVolume = 1;

    volumeSlider.value = 1;

    updateMuteButton();

    updateVolumePercentage();

}


// ======================================================
// VOLUME BUTTONS
// ======================================================

muteBtn.addEventListener("click", toggleMute);

volumeDownBtn.addEventListener("click", volumeDown);

volumeUpBtn.addEventListener("click", volumeUp);

fullVolumeBtn.addEventListener("click", fullVolume);


// ======================================================
// REPEAT BUTTON
// ======================================================

repeatBtn.addEventListener("click", () => {

    repeatMode = !repeatMode;

    repeatBtn.classList.toggle(
        "active",
        repeatMode
    );

});


// ======================================================
// SHUFFLE BUTTON
// ======================================================

shuffleBtn.addEventListener("click", () => {

    shuffleMode = !shuffleMode;

    shuffleBtn.classList.toggle(
        "active",
        shuffleMode
    );

});


// ======================================================
// PREVIOUS SONG
// ======================================================

function playPreviousSong() {

    currentSongIndex--;

    if (currentSongIndex < 0) {

        currentSongIndex =
            songs.length - 1;

    }

    loadSong(currentSongIndex);

    playSong();

}


// ======================================================
// NEXT SONG
// ======================================================

function playNextSong() {

    if (shuffleMode && songs.length > 1) {

        let randomIndex;

        do {

            randomIndex =
                Math.floor(
                    Math.random() * songs.length
                );

        } while (
            randomIndex === currentSongIndex
        );

        currentSongIndex =
            randomIndex;

    } else {

        currentSongIndex++;

        if (currentSongIndex >= songs.length) {

            currentSongIndex = 0;

        }

    }

    loadSong(currentSongIndex);

    playSong();

}


// ======================================================
// PLAYER BUTTONS
// ======================================================

previousBtn.addEventListener(
    "click",
    playPreviousSong
);

nextBtn.addEventListener(
    "click",
    playNextSong
);


// ======================================================
// VISUALIZER
// ======================================================

function startVisualizer() {

    visualizerBars.forEach((bar) => {

        bar.style.animationPlayState =
            "running";

    });

}


function stopVisualizer() {

    visualizerBars.forEach((bar) => {

        bar.style.animationPlayState =
            "paused";

    });

}


// ======================================================
// ================= VOICE CONTROL ======================
// ======================================================

let recognition = null;

let voiceActive = false;

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    recognition =
        new SpeechRecognition();

    recognition.continuous = true;

    recognition.interimResults = false;

    recognition.lang = "en-IN";


    recognition.onstart = () => {

        voiceActive = true;

        voiceStatus.textContent =
            "🎙️ Listening...";

        voiceControlBtn.classList.add("active");

    };


    recognition.onresult = (event) => {

        const result =
            event.results[
                event.results.length - 1
            ];

        const command =
            result[0]
                .transcript
                .toLowerCase()
                .trim();

        console.log(
            "Voice command:",
            command
        );

        voiceStatus.textContent =
            "🎙️ Heard: " + command;

        handleVoiceCommand(command);

    };


    recognition.onerror = (event) => {

        console.log(
            "Voice error:",
            event.error
        );

        if (event.error === "not-allowed") {

            voiceStatus.textContent =
                "❌ Microphone permission denied";

            voiceActive = false;

            voiceControlBtn.classList.remove(
                "active"
            );

        }

        else if (event.error === "no-speech") {

            voiceStatus.textContent =
                "🎙️ No speech detected";

        }

        else {

            voiceStatus.textContent =
                "❌ Voice error";

        }

    };


    recognition.onend = () => {

        if (voiceActive) {

            setTimeout(() => {

                try {

                    recognition.start();

                } catch (error) {

                    console.log(
                        "Voice restart:",
                        error
                    );

                }

            }, 300);

        }

    };

}


// ======================================================
// VOICE CONTROL BUTTON
// ======================================================

voiceControlBtn.addEventListener("click", () => {

    if (!recognition) {

        alert(
            "Voice control is not supported in this browser."
        );

        return;

    }


    if (!voiceActive) {

        try {

            recognition.start();

        } catch (error) {

            console.log(
                "Voice start error:",
                error
            );

        }

    } else {

        voiceActive = false;

        recognition.stop();

        voiceControlBtn.classList.remove(
            "active"
        );

        voiceStatus.textContent =
            "🎙️ Voice control is OFF";

    }

});


// ======================================================
// VOICE COMMAND HANDLER
// ======================================================

function handleVoiceCommand(command) {

    if (
        command === "play" ||
        command === "start" ||
        command === "play music" ||
        command === "start music" ||
        command.includes("play music") ||
        command.includes("start music")
    ) {

        playSong();

        voiceStatus.textContent =
            "▶️ Playing";

        return;
    }


    if (
        command === "stop" ||
        command === "stop music"
    ) {

        stopSong();

        voiceStatus.textContent =
            "⏸️ Paused";

        return;
    }


    if (
        command === "next" ||
        command === "next song" ||
        command === "skip" ||
        command === "skip song"
    ) {

        playNextSong();

        voiceStatus.textContent =
            "⏭️ Next song";

        return;
    }


    if (
        command === "back" ||
        command === "previous" ||
        command === "previous song" ||
        command === "back song"
    ) {

        playPreviousSong();

        voiceStatus.textContent =
            "⏮️ Previous song";

        return;
    }


    if (
        command === "unmute" ||
        command.includes("unmute")
    ) {

        if (audioPlayer.volume === 0) {

            audioPlayer.volume =
                lastVolume > 0
                    ? lastVolume
                    : 0.8;

        }

        volumeSlider.value =
            audioPlayer.volume;

        updateMuteButton();

        updateVolumePercentage();

        voiceStatus.textContent =
            "🔊 Unmuted " +
            Math.round(audioPlayer.volume * 100) +
            "%";

        return;
    }


    if (
        command === "mute" ||
        command.includes("mute")
    ) {

        if (audioPlayer.volume > 0) {

            lastVolume =
                audioPlayer.volume;

        }

        audioPlayer.volume = 0;

        volumeSlider.value = 0;

        updateMuteButton();

        updateVolumePercentage();

        voiceStatus.textContent =
            "🔇 Muted 0%";

        return;
    }


    if (
        command === "full volume" ||
        command === "maximum volume" ||
        command === "max volume" ||
        command.includes("full volume")
    ) {

        fullVolume();

        voiceStatus.textContent =
            "🔊 Full Volume 100%";

        return;
    }


    if (
        command === "up" ||
        command === "volume up" ||
        command === "increase volume" ||
        command.includes("volume up") ||
        command.includes("increase volume")
    ) {

        volumeUp();

        voiceStatus.textContent =
            "🔊 Volume Up " +
            Math.round(audioPlayer.volume * 100) +
            "%";

        return;
    }


    if (
        command === "down" ||
        command === "volume down" ||
        command === "decrease volume" ||
        command.includes("volume down") ||
        command.includes("decrease volume")
    ) {

        volumeDown();

        voiceStatus.textContent =
            "🔉 Volume Down " +
            Math.round(audioPlayer.volume * 100) +
            "%";

        return;
    }


    voiceStatus.textContent =
        "🎙️ Command not recognized";

}


// ======================================================
// ================= CLAP CONTROL =======================
// ======================================================

let clapActive = false;

let clapStream = null;

let clapAudioContext = null;

let clapAnalyser = null;

let clapSource = null;

let clapAnimation = null;

let clapCount = 0;

let lastClapTime = 0;

let clapTimer = null;


// ======================================================
// CLAP BUTTON
// ======================================================

clapControlBtn.addEventListener(
    "click",
    startClapControl
);


// ======================================================
// START CLAP CONTROL
// ======================================================

async function startClapControl() {

    if (clapActive) {

        stopClapControl();

        return;
    }


    try {

        clapStream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });


        clapAudioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();


        clapAnalyser =
            clapAudioContext.createAnalyser();

        clapAnalyser.fftSize = 2048;


        clapSource =
            clapAudioContext.createMediaStreamSource(
                clapStream
            );


        clapSource.connect(
            clapAnalyser
        );


        clapActive = true;

        clapControlBtn.classList.add(
            "active"
        );


        voiceStatus.textContent =
            "👏 Clap control ON";


        detectClap();

    }

    catch (error) {

        console.log(
            "Clap microphone error:",
            error
        );

        voiceStatus.textContent =
            "❌ Microphone permission denied";

    }

}


// ======================================================
// DETECT CLAP
// ======================================================

function detectClap() {

    if (!clapActive) {
        return;
    }


    const bufferLength =
        clapAnalyser.fftSize;


    const dataArray =
        new Uint8Array(bufferLength);


    clapAnalyser.getByteTimeDomainData(
        dataArray
    );


    let sum = 0;


    for (
        let i = 0;
        i < bufferLength;
        i++
    ) {

        const value =
            (dataArray[i] - 128) / 128;

        sum += value * value;

    }


    const rms =
        Math.sqrt(
            sum / bufferLength
        );


    const now =
        Date.now();


    if (
        rms > 0.18 &&
        now - lastClapTime > 300
    ) {

        lastClapTime = now;

        registerClap();

    }


    clapAnimation =
        requestAnimationFrame(
            detectClap
        );

}


// ======================================================
// REGISTER CLAP
// ======================================================

function registerClap() {

    clapCount++;


    voiceStatus.textContent =
        "👏 Clap detected: " +
        clapCount;


    clearTimeout(clapTimer);


    clapTimer =
        setTimeout(
            processClaps,
            700
        );

}


// ======================================================
// PROCESS CLAPS
// ======================================================

function processClaps() {

    const totalClaps =
        clapCount;


    clapCount = 0;


    if (totalClaps === 1) {

        if (isPlaying) {

            stopSong();

            voiceStatus.textContent =
                "👏 1 Clap → Paused";

        } else {

            playSong();

            voiceStatus.textContent =
                "👏 1 Clap → Playing";

        }

        return;
    }


    if (totalClaps === 2) {

        playNextSong();

        voiceStatus.textContent =
            "👏👏 2 Claps → Next";

        return;
    }


    if (totalClaps === 3) {

        playPreviousSong();

        voiceStatus.textContent =
            "👏👏👏 3 Claps → Previous";

        return;
    }


    voiceStatus.textContent =
        "👏 Too many claps";

}


// ======================================================
// STOP CLAP CONTROL
// ======================================================

function stopClapControl() {

    clapActive = false;


    if (clapAnimation) {

        cancelAnimationFrame(
            clapAnimation
        );

    }


    if (clapStream) {

        clapStream
            .getTracks()
            .forEach(
                track => track.stop()
            );

    }


    if (clapAudioContext) {

        clapAudioContext.close();

    }


    clapCount = 0;


    clapControlBtn.classList.remove(
        "active"
    );


    voiceStatus.textContent =
        "👏 Clap control OFF";

}


// ======================================================
// INITIAL SETUP
// ======================================================

loadSong(0);

stopVisualizer();

audioPlayer.volume = 0.8;

volumeSlider.value = 0.8;

lastVolume = 0.8;

updateMuteButton();

updateVolumePercentage();