let canvas;
let ctx;
let rafId;
let particleArray = [];
let emitterArray = [];
let canvasSize = 800;
let canvasOrigin = canvasSize / 2;
let gameTime = 0;
let gameRingCount = 0;
let particleSize = 20;

let ringCount = 5;
let ringDensity = 40;
let particleSpeed = 1;
let gameTimeMult = 1;
let yOffsetVal = 0;
let spread = 4;
let playable = false;
let memeMode = false;

let ringDrawSpeed = 1;


let playerSize = 4;
let playerCoords = { x: canvasOrigin, y: 750 };
let playerMovement = { left: false, right: false, up: false, down: false, shift: 1 };

let defaultPlayerSpeed = 4;
let playerSpeed = defaultPlayerSpeed;

const gameAudio = new Audio("kanako_midi.mp3");
gameAudio.loop = true;


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if (urlParams.get('p1')) ringCount = urlParams.get('p1');
if (urlParams.get('p2')) ringDensity = urlParams.get('p2');
if (urlParams.get('p3')) particleSpeed = urlParams.get('p3');
if (urlParams.get('p4')) gameTimeMult = urlParams.get('p4');
if (urlParams.get('p5')) yOffsetVal = +urlParams.get('p5');
if (urlParams.get('p6')) spread = +urlParams.get('p6');

const colorList = ["red", "magenta", "blue", "lime", "lime", "cyan"]

const imgBackground = new Image();
imgBackground.src = "background.png"

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
        if (memeMode) {
            this.img = new Image()
            this.img.src = `${this.ring % 6}.png`
        }


    }
    draw() {
        //Despawn out of bounds particles
        if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) return;

        //Draw Particles
        if (!memeMode) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.size, this.size)
        }

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

            if (this.ring % 6 == 0) {
                sinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.6) + this.rotation + 1.6 * Math.PI * index / this.density);
                cosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.6) + this.rotation + 1.6 * Math.PI * index / this.density);
                asinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.6) + this.rotation + 1.6 * Math.PI * spreadF);
                acosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.6) + this.rotation + 1.6 * Math.PI * spreadF);
            }
            if (this.ring % 6 == 1) {
                sinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * index / this.density);
                cosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * index / this.density);
                asinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.6) + this.rotation + 1.6 * Math.PI * spreadF);
                acosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.6) + this.rotation + 1.6 * Math.PI * spreadF);
            }
            if (this.ring % 6 == 2) {
                sinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * index / this.density);
                cosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * index / this.density);
                asinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.6) + this.rotation + 1.6 * Math.PI * spreadF);
                acosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.6) + this.rotation + 1.6 * Math.PI * spreadF);
            }
            if (this.ring % 6 == 3) {
                sinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 1.6 * Math.PI * index / this.density);
                cosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 1.6 * Math.PI * index / this.density);
                asinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.6) + this.rotation + 1.6 * Math.PI * spreadF);
                acosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.6) + this.rotation + 1.6 * Math.PI * spreadF);
            }
            if (this.ring % 6 == 4) {
                sinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * index / this.density);
                cosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * index / this.density);
                asinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.6) + this.rotation + 1.6 * Math.PI * spreadF);
                acosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.6) + this.rotation + 1.6 * Math.PI * spreadF);
            }
            if (this.ring % 6 == 5) {
                sinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * index / this.density);
                cosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.8) + this.rotation + 0.8 * Math.PI * index / this.density);
                asinF = Math.sin(2 * Math.PI * (this.ringIndex / ringCount + 0.6) + this.rotation + 1.6 * Math.PI * spreadF);
                acosF = Math.cos(2 * Math.PI * (this.ringIndex / ringCount + 0.6) + this.rotation + 1.6 * Math.PI * spreadF);
            }



            particleArray.push(new Particle({
                x: this.ox + this.r * cosF,
                y: this.oy + this.r * sinF,
                ax: cosF + acosF * 0.5,
                ay: sinF + asinF * 0.5,
                ring: this.ring,
                delay: (this.ring * ringDensity + index) * ringDrawSpeed
            }));
        }
    }
}

function onLoad() {
    //Get canvas reference
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = canvasSize;
    canvas.height = canvasSize;


    document.getElementById("ringCount").value = ringCount;
    document.getElementById("ringDensity").value = ringDensity;
    document.getElementById("particleSpeed").value = particleSpeed;
    document.getElementById("gameTimeMult").value = gameTimeMult;
    document.getElementById("yOffsetVal").value = yOffsetVal;
    document.getElementById("particleSpread").value = spread;

    function animate() {
        rafId = requestAnimationFrame(animate)
        //Clear Background
        //ctx.fillStyle = "#000";
        //ctx.fillRect(0, 0, canvasSize, canvasSize);
        ctx.drawImage(imgBackground, 0, 0, 800, 800)
        //init more rings
        // if (gameTime % 300 == 0)
        //     initRings()

        // //Animate particles


        if (playable) {
            updateMovement()
            //player outline
            ctx.fillStyle = "#FFF";
            if (playerMovement.shift != 1) ctx.fillStyle = "#FCC";
            ctx.fillRect(playerCoords.x - (playerSize + 4) / 2, playerCoords.y - (playerSize + 4) / 2, playerSize + 4, playerSize + 4);
            //player hitbox
            ctx.fillStyle = "#F00";
            ctx.fillRect(playerCoords.x - playerSize / 2, playerCoords.y - playerSize / 2, playerSize, playerSize);
        }

        //Game Loop
        //Draw Rings
        if (gameTime % 6 * ringDensity * ringDrawSpeed == 0) initRings();

        //Update Particles
        particleArray.forEach(e => e.update());

        //Update Time
        gameTime += 1 * gameTimeMult;
    }

    function initRings() {
        emitterArray = [];

        //Ring0
        let ringRadius = 100;
        let ringRotation = Math.PI * 1.5;
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
        ringRotation = Math.PI * 0.5;
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
        ringRotation = Math.PI * 1.5;
        for (let index = 0; index < ringCount; index++) {
            emitterArray.push(new ParticleEmitter({
                ox: canvasOrigin + ringRadius * Math.cos(ringRotation + 2 * Math.PI * index / ringCount),
                oy: canvasOrigin + yOffsetVal + ringRadius * Math.sin(ringRotation + 2 * Math.PI * index / ringCount),
                r: ringRadius, density: ringDensity, ring: gameRingCount, ringIndex: index, rotation: ringRotation
            }));
        }
        gameRingCount++;
        //Ring4
        ringRotation = Math.PI * 1.5;
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
        ringRotation = Math.PI * 0.5;
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
        ringRotation = Math.PI * 1.5;
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

    animate()
}

function handleChange() {
    ringCount = document.getElementById("ringCount").value;
    ringDensity = document.getElementById("ringDensity").value;
    particleSpeed = document.getElementById("particleSpeed").value;
    gameTimeMult = document.getElementById("gameTimeMult").value;
    yOffsetVal = +document.getElementById("yOffsetVal").value;
    spread = document.getElementById("particleSpread").value;
    memeMode = document.getElementById("memeMode").checked;

    window.history.replaceState("", "", `${window.location.href.split('?')[0]}?p1=${ringCount}&p2=${ringDensity}&p3=${particleSpeed}&p4=${gameTimeMult}&p5=${yOffsetVal}&p6=${spread}`);

    //Restarts the Game
    cancelAnimationFrame(rafId)
    particleArray = [];
    gameTime = 0;
    gameRingCount = 0;
    onLoad();

}

function handlePlayable() {
    playable = document.getElementById("playable").checked;
     gameAudio.play();

    yOffsetVal = -200;
    document.getElementById("yOffsetVal").value = yOffsetVal;
    handleChange()
}

function handleCosmeticChange() {
    
    if (document.getElementById("muteMusic").checked)
            gameAudio.pause();
     else gameAudio.play();
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
}

function handleKeyPressUp(e) {
    if (e.key == "ArrowLeft")
        playerMovement.left = false;

    if (e.key == "ArrowRight")
        playerMovement.right = false;

    if (e.key == "ArrowUp")
        playerMovement.up = false;

    if (e.key == "ArrowDown")
        playerMovement.down = false;

    if (e.key == "Shift")
        playerMovement.shift = 1;
}

function updateMovement() {

    if (playerMovement.left)
        playerCoords.x -= playerSpeed * playerMovement.shift;

    if (playerMovement.right)
        playerCoords.x += playerSpeed * playerMovement.shift;

    if (playerMovement.up)
        playerCoords.y -= playerSpeed * playerMovement.shift;

    if (playerMovement.down)
        playerCoords.y += playerSpeed * playerMovement.shift;

}