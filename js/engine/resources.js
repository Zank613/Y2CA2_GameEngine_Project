const Images = {
    playerIdle: [],
    playerWalk: [],
    playerProtect: [],

    jesusDescend: new Image(),
    jesusWin: new Image(),
};

const AudioFiles = {
    holy: new Audio('./resources/Audio/2019-03-30_18-13-20.mp3')
};

// Load Idle (idle_0 to idle_2)
for (let i = 0; i <= 2; i++) {
    const img = new Image();
    img.src = `./resources/images/player/idle_${i}.png`;
    Images.playerIdle.push(img);
}

// Load Walk (walk_0 to walk_11)
for (let i = 0; i <= 11; i++) {
    const img = new Image();
    img.src = `./resources/images/player/walk_${i}.png`;
    Images.playerWalk.push(img);
}

// Load Protect (protect_0 to protect_3)
for (let i = 0; i <= 3; i++) {
    const img = new Image();
    img.src = `./resources/images/player/protect_${i}.png`;
    Images.playerProtect.push(img);
}

// Load Jesus
Images.jesusDescend.src = "./resources/images/1pix6500.png";
Images.jesusWin.src = "./resources/images/2pix6500.png";


let globalVolume = 1.0; // Default 100%

const setGlobalVolume = (value) => {
    globalVolume = Math.max(0, Math.min(1, value));

    // Apply to all loaded audio files immediately
    Object.values(AudioFiles).forEach(audio => {
        audio.volume = globalVolume;
    });
};

const getGlobalVolume = () => {
    return globalVolume;
};

export { Images, AudioFiles, setGlobalVolume, getGlobalVolume };