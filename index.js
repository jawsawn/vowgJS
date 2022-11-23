let canvas;
let ctx;
let rafId;
let particleArray = [];
let emitterArray = [];
let canvasSize = 800;
let canvasOrigin = canvasSize / 2;
let gameTime = 0;
let gameRingCount = 0;

let particleSize = +20;
let ringCount = 5;
let ringDensity = 40;
let particleSpeed = 2;
let gameTimeMult = 1;
let spread = 4;

let playable = false;
let memeMode = false;
let disableBackground = false;

let ringDrawSpeed = 1;
let yOffsetVal = 0;

let fpsActivity = [];
let fps;

let grazeCount = 0;
let deathCount = 0;
let deathCooldown = 0;

let playerSize = 4;
let grazeSize = 10;
let playerCoords = { x: canvasOrigin, y: 750 };
let playerMovement = { left: false, right: false, up: false, down: false, shift: 1 };

let defaultPlayerSpeed = 4;
let playerSpeed = defaultPlayerSpeed;
const empty = []

//Audio Sources
const gameAudio = new Audio("resources/audio/kanako_midi.mp3");
gameAudio.loop = true;
const deathAudio = new Audio("resources/audio/death.wav");
const grazeAudio = new Audio("resources/audio/graze.wav");
const mukyuAudio = new Audio("resources/audio/mukyu.mp3");
const zeAudio = new Audio("resources/audio/ze.mp3");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if (urlParams.get('p1')) ringCount = urlParams.get('p1');
if (urlParams.get('p2')) ringDensity = urlParams.get('p2');
if (urlParams.get('p3')) particleSpeed = urlParams.get('p3');
if (urlParams.get('p4')) gameTimeMult = urlParams.get('p4');
if (urlParams.get('p5')) spread = +urlParams.get('p5');
if (urlParams.get('p6')) particleSize = +urlParams.get('p6');

//const colorList = ["red", "magenta", "blue", "lime", "lime", "cyan"]
const colorList = ["0", "300", "240", "120", "120", "180"]
//Image Sources
const imgBackground = new Image();
imgBackground.src = "resources/image/background.png"


function onLoad() {
    //Get Canvas
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    //Update Label Values
    document.getElementById("ringCount").value = ringCount;
    document.getElementById("ringDensity").value = ringDensity;
    document.getElementById("particleSpeed").value = particleSpeed;
    document.getElementById("gameTimeMult").value = gameTimeMult;
    document.getElementById("particleSpread").value = spread;
    document.getElementById("particleSize").value = +particleSize;
    //Add Touch Events
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('touchmove', handleTouchMove);
    //Animate Game Loop
    animate()
}

function animate() {
    rafId = requestAnimationFrame(animate)
    //Clear Background
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    //Character Logic
    if (playable) {
        updateMovement()
        //player outline
        ctx.fillStyle = "#FFF";
        if (playerMovement.shift != 1) ctx.fillStyle = "#FCC";
        ctx.fillRect(playerCoords.x - (playerSize + 4) / 2, playerCoords.y - (playerSize + 4) / 2, playerSize + 4, playerSize + 4);
        //player hitbox
        ctx.fillStyle = "#F00";
        if (deathCooldown > 0) ctx.fillStyle = "#000";
        ctx.fillRect(playerCoords.x - playerSize / 2, playerCoords.y - playerSize / 2, playerSize, playerSize);
    }
    //Draw Rings
    if (gameTime % 6 * ringDensity * ringDrawSpeed == 0) initRings();
    //Update Particles
    particleArray.forEach(e => e.update());
    //Update Time
    gameTime += 1 * gameTimeMult;
    //Death Cooldown
    if (deathCooldown > 0) deathCooldown--;
    //Fps Counter
    const now = performance.now();
    while (fpsActivity.length > 0 && fpsActivity[0] <= now - 1000) {
        fpsActivity.shift();
    }
    fpsActivity.push(now);
    fps = fpsActivity.length;
    document.getElementById("fpsCounter").innerText = fps > 60 ? 60 : fps;
}

function initRings() {
    emitterArray = [];

    //Ring0
    let ringRadius = 100;
    let ringRotation = Math.PI * (1.5 + 0.5 * Math.floor(gameRingCount / 6));
    for (let index = 0; index < ringCount; index++) {
        emitterArray.push(new ParticleEmitter({
            ox: canvasOrigin + ringRadius * Math.cos(ringRotation + 2 * Math.PI * index / ringCount),
            oy: canvasOrigin + yOffsetVal + ringRadius * Math.sin(ringRotation + 2 * Math.PI * index / ringCount),
            r: ringRadius, density: ringDensity, ring: gameRingCount, ringIndex: index, rotation: ringRotation
        }));
    }
    gameRingCount++;
    //Ring2
    ringRadius = 130;
    ringRotation = Math.PI * (0.5 + 0.5 * Math.floor(gameRingCount / 6));
    for (let index = 0; index < ringCount; index++) {
        emitterArray.push(new ParticleEmitter({
            ox: canvasOrigin + ringRadius * Math.cos(ringRotation + 2 * Math.PI * index / ringCount),
            oy: canvasOrigin + yOffsetVal + ringRadius * Math.sin(ringRotation + 2 * Math.PI * index / ringCount),
            r: ringRadius, density: ringDensity, ring: gameRingCount, ringIndex: index, rotation: ringRotation
        }));
    }
    gameRingCount++;
    //Ring3
    ringRadius = 160;
    ringRotation = Math.PI * (1.5 + 0.5 * Math.floor(gameRingCount / 6));
    for (let index = 0; index < ringCount; index++) {
        emitterArray.push(new ParticleEmitter({
            ox: canvasOrigin + ringRadius * Math.cos(ringRotation + 2 * Math.PI * index / ringCount),
            oy: canvasOrigin + yOffsetVal + ringRadius * Math.sin(ringRotation + 2 * Math.PI * index / ringCount),
            r: ringRadius, density: ringDensity, ring: gameRingCount, ringIndex: index, rotation: ringRotation
        }));
    }
    gameRingCount++;
    //Ring4
    ringRotation = Math.PI * (1.5 + 0.5 * Math.floor(gameRingCount / 6));
    ringRadius = 100;
    for (let index = 0; index < ringCount; index++) {
        emitterArray.push(new ParticleEmitter({
            ox: canvasOrigin + ringRadius * Math.cos(ringRotation + 2 * Math.PI * index / ringCount),
            oy: canvasOrigin + yOffsetVal + ringRadius * Math.sin(ringRotation + 2 * Math.PI * index / ringCount),
            r: ringRadius, density: ringDensity, ring: gameRingCount, ringIndex: index, rotation: ringRotation
        }));
    }
    gameRingCount++;
    //Ring5
    ringRotation = Math.PI * (0.5 + 0.5 * Math.floor(gameRingCount / 6));
    ringRadius = 130;
    for (let index = 0; index < ringCount; index++) {
        emitterArray.push(new ParticleEmitter({
            ox: canvasOrigin + ringRadius * Math.cos(ringRotation + 2 * Math.PI * index / ringCount),
            oy: canvasOrigin + yOffsetVal + ringRadius * Math.sin(ringRotation + 2 * Math.PI * index / ringCount),
            r: ringRadius, density: ringDensity, ring: gameRingCount, ringIndex: index, rotation: ringRotation
        }));
    }
    gameRingCount++;
    //Ring6
    ringRadius = 160;
    ringRotation = Math.PI * (1.5 + 0.5 * Math.floor(gameRingCount / 6));
    for (let index = 0; index < ringCount; index++) {
        emitterArray.push(new ParticleEmitter({
            ox: canvasOrigin + ringRadius * Math.cos(ringRotation + 2 * Math.PI * index / ringCount),
            oy: canvasOrigin + yOffsetVal + ringRadius * Math.sin(ringRotation + 2 * Math.PI * index / ringCount),
            r: ringRadius, density: ringDensity, ring: gameRingCount, ringIndex: index, rotation: ringRotation
        }));
    }
    gameRingCount++;

    //Draw Rings
    emitterArray.forEach(e => e.draw())
}

class Particle {
    constructor({ x, y, ax, ay, ring, delay }) {
        this.x = x;
        this.y = y;
        this.ax = ax;
        this.ay = ay;
        this.size = particleSize;
        this.ring = ring;
        this.color = colorList[this.ring % 6];
        this.delay = delay;
        this.grazed = false;
        if (memeMode) {
            this.img = new Image()
            this.img.src = `resources/image/${this.ring % 6}.png`
        }
    }
    draw() {
        //Despawn out of bounds particles
        if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) return;
        //Draw Particles
        if (!memeMode) {
            ctx.fillStyle = `hsl(${this.color}, 100%, 50%)`;
            //Graze Colors
            if (playable && this.x - grazeSize < playerCoords.x && this.x + this.size + grazeSize > playerCoords.x && this.y - grazeSize < playerCoords.y && this.y + this.size + grazeSize > playerCoords.y)
                ctx.fillStyle = `hsl(${this.color}, 100%, 80%)`;
            ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.size, this.size);
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.size, this.size)
        }

        if (playable)
            this.collisionCheck();
    }
    update() {
        if (this.delay < gameTime) {
            if (((this.ring + 3) * ringDensity) < gameTime) {
                this.x -= this.ax * particleSpeed;
                this.y -= this.ay * particleSpeed;
            }
            this.draw();
        }

    }
    collisionCheck() {
        if (this.x < playerCoords.x && this.x + this.size > playerCoords.x + playerSize && this.y < playerCoords.y && this.y + this.size > playerCoords.y + playerSize) {
            if (deathCooldown == 0) {
                deathCount++;
                document.getElementById("deathCounter").innerText = deathCount;
                deathCooldown = 60;
                deathAudio.play();
            }
        }
        if (this.x - grazeSize < playerCoords.x && this.x + this.size + grazeSize > playerCoords.x &&
            this.y - grazeSize < playerCoords.y && this.y + this.size + grazeSize > playerCoords.y) {
            if (!this.grazed) {
                grazeCount++;
                document.getElementById("grazeCounter").innerText = grazeCount;
                this.grazed = true;
                grazeAudio.play();
            }
        }
    }
}

class ParticleEmitter {
    constructor({ ox, oy, r, density, ring, ringIndex, rotation }) {
        this.ox = ox;
        this.oy = oy;
        this.r = r;
        this.density = density;
        this.ring = ring;
        this.ringIndex = ringIndex;
        this.rotation = rotation
    }
    draw() {
        //Init Ring
        for (let index = 0; index < this.density; index++) {
            let sinF = Math.sin(2 * Math.PI * index / this.density)
            let cosF = Math.cos(2 * Math.PI * index / this.density)
            let asinF = Math.sin(2 * Math.PI * (Math.floor(index / spread)) / (this.density / spread))
            let acosF = Math.cos(2 * Math.PI * (Math.floor(index / spread)) / (this.density / spread))
            let spreadF = (Math.floor(index / spread)) / (this.density / spread);

            switch (this.ring % 6) {
                case 0:
                    sinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.6) + this.rotation + 1.6 * Math.PI * index / this.density);
                    cosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.6) + this.rotation + 1.6 * Math.PI * index / this.density);
                    asinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.6) + this.rotation + 1.6 * Math.PI * spreadF);
                    acosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.6) + this.rotation + 1.6 * Math.PI * spreadF);
                    break;
                case 1:
                    sinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * index / this.density);
                    cosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * index / this.density);
                    asinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * spreadF);
                    acosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * spreadF);
                    break;
                case 2:
                    sinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * index / this.density);
                    cosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * index / this.density);
                    asinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * spreadF);
                    acosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * spreadF);
                    break;
                case 3:
                    sinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 1.6 * Math.PI * index / this.density);
                    cosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 1.6 * Math.PI * index / this.density);
                    asinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 1.6 * Math.PI * spreadF);
                    acosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 1.6 * Math.PI * spreadF);
                    break;
                case 4:
                    sinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * index / this.density);
                    cosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * index / this.density);
                    asinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * spreadF);
                    acosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * spreadF);
                    break;
                case 5:
                    sinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * index / this.density);
                    cosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * index / this.density);
                    asinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * spreadF);
                    acosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * spreadF);
                    break;
                default:
                    break;
            }

            particleArray.push(new Particle({
                x: this.ox + this.r * cosF,
                y: this.oy + this.r * sinF,
                ax: cosF + acosF,
                ay: sinF + asinF,
                ring: this.ring,
                delay: (this.ring * ringDensity + index) * ringDrawSpeed
            }));
        }
    }
}

function handleChange(reset = false) {
    ringCount = document.getElementById("ringCount").value;
    ringDensity = document.getElementById("ringDensity").value;
    particleSpeed = document.getElementById("particleSpeed").value;
    gameTimeMult = document.getElementById("gameTimeMult").value;
    spread = document.getElementById("particleSpread").value;
    particleSize = +document.getElementById("particleSize").value;

    if (reset) {
        particleSize = +20;
        ringCount = 5;
        ringDensity = 40;
        particleSpeed = 2;
        gameTimeMult = 1;
        spread = 4;
    }

    memeMode = document.getElementById("memeMode").checked;
    disableBackground = document.getElementById("disableBackground").checked;

    window.history.replaceState("", "", `${window.location.href.split('?')[0]}?p1=${ringCount}&p2=${ringDensity}&p3=${particleSpeed}&p4=${gameTimeMult}&p5=${spread}&p6=${particleSize}`);

    //Restarts the Game
    cancelAnimationFrame(rafId)
    particleArray = [];
    gameTime = 0;
    gameRingCount = 0;
    onLoad();

}

function handlePlayable() {
    playable = document.getElementById("playable").checked;
    if (playable) {
        gameAudio.play();
        yOffsetVal = -200;
    } else {
        gameAudio.pause();
        yOffsetVal = 0;
    }

    handleChange()
}

function handleMuteAudio() {
    if (document.getElementById("muteMusic").checked)
        gameAudio.pause();
    else gameAudio.play();
}

function handleDisableBackground() {
    if (document.getElementById("disableBackground").checked)
        canvas.style.background = "#000 url()";
    else
        canvas.style.background = "#000 url(resources/image/background.png)";

}

function handleKeyPressDown(e) {
    if (e.key == "ArrowLeft")
        playerMovement.left = true;
    if (e.key == "ArrowRight")
        playerMovement.right = true;
    if (e.key == "ArrowUp")
        playerMovement.up = true;
    if (e.key == "ArrowDown")
        playerMovement.down = true;
    if (e.key == "Shift")
        playerMovement.shift = 0.5;

    //funnies
    if (e.key == "x" || e.key == "X")
        mukyuAudio.play()

    if (e.key == "z" || e.key == "Z")
        zeAudio.play()
}

function handleKeyPressUp(e) {
    switch (e.key) {
        case "ArrowLeft":
            playerMovement.left = false;
            break;
        case "ArrowRight":
            playerMovement.right = false;
            break;
        case "ArrowUp":
            playerMovement.up = false;
            break;
        case "ArrowDown":
            playerMovement.down = false;
            break;
        case "Shift":
            playerMovement.shift = 1;
            break;
        default:
            break;
    }
}

function updateMovement() {
    if (playerMovement.left && playerCoords.x - playerSize * 2 > 0)
        playerCoords.x -= playerSpeed * playerMovement.shift;

    if (playerMovement.right && playerCoords.x + playerSize * 2 < canvas.width)
        playerCoords.x += playerSpeed * playerMovement.shift;

    if (playerMovement.up && playerCoords.y - playerSize * 2 > 0)
        playerCoords.y -= playerSpeed * playerMovement.shift;

    if (playerMovement.down && playerCoords.y + playerSize * 2 < canvas.height)
        playerCoords.y += playerSpeed * playerMovement.shift;
}

function handleTouchStart(event) {
}

function handleTouchEnd(event) {

}

function handleTouchMove(event) {
    //Temp Solution for now, add last state controlls 
    playerCoords.x = event.touches[0].pageX * 800 / canvas.clientWidth - canvas.offsetLeft - playerSize / 2 - 200;
    playerCoords.y = event.touches[0].pageY * 800 / canvas.clientHeight - canvas.offsetTop - playerSize / 2;
    event.preventDefault();

}

let fullscreenEnabled = false;
function handleFullscreen() {
    if(!fullscreenEnabled)
    document.documentElement.requestFullscreen();
    else 
    document.exitFullscreen();
    fullscreenEnabled = !fullscreenEnabled;
}