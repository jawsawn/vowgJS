let canvas;
let ctx;
let rafId;
let particleArray = [];
let emitterArray = [];
let canvasSize = 800;
let canvasOrigin = canvasSize / 2;
let gameTime = 0;
let gameRingCount = 0;

let ringCount = 5;
let ringDensity = 75;
let particleSpeed = 1;
let gameTimeMult = 1;
let yOffsetVal = 0;
let particleSpread = 0.8;
let playable = false;

let playerSize = 4;
let playerCoords = { x: canvasOrigin, y: 750 };
let playerMovement = { left: false, right: false, up: false, down: false, shift: 1 };

let defaultPlayerSpeed = 2;
let playerSpeed = defaultPlayerSpeed;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if (urlParams.get('p1')) ringCount = urlParams.get('p1');
if (urlParams.get('p2')) ringDensity = urlParams.get('p2');
if (urlParams.get('p3')) particleSpeed = urlParams.get('p3');
if (urlParams.get('p4')) gameTimeMult = urlParams.get('p4');
if (urlParams.get('p5')) yOffsetVal = +urlParams.get('p5');
if (urlParams.get('p6')) particleSpread = +urlParams.get('p6');


class Particle {
    constructor({ x, y, ax, ay, ringP }) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.ax = ax;
        this.ay = ay;
        this.size = 8;
        this.ringP = ringP;
        switch (ringP % 6) {
            case 0:
                this.color = "red";
                break;
            case 1:
                this.color = "magenta";
                break;
            case 2:
                this.color = "blue";
                break;
            case 3:
                this.color = "green";
                break;
            case 4:
                this.color = "yellow";
                break;
            case 5:
                this.color = "cyan";
                break;
        }

    }
    draw() {
        //Despawn out of bounds particles
        if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) return;

        //Draw Particles
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    update() {
        //rng hell 0.1*(Math.random() > 0.5 ? 1 : -1 )
        //Priority Release
        if (gameTime - (100 * this.ringP) > 0) {
            this.x -= this.ax * particleSpeed;
            this.y -= this.ay * particleSpeed;
        }

        //Increase time and draw
        this.draw();
    }
}

class ParticleEmitter {
    constructor({ ox, oy, r, density, ringP }) {
        this.ox = ox;
        this.oy = oy;
        this.r = r;
        this.density = density;
        this.ringP = ringP;
    }
    draw() {
        //Draw particle

        for (let index = 0; index < this.density; index++) {
            let sinF = Math.sin(2 * Math.PI * (index + 1) / this.density);
            let cosF = Math.cos(2 * Math.PI * (index + 1) / this.density);
            particleArray.push(new Particle({
                x: this.ox + this.r * cosF,
                y: this.oy + this.r * sinF,
                ax: cosF + particleSpread * Math.cos(2 * Math.PI * (Math.floor((index + 1) / 4)) / (this.density / 4)),
                ay: sinF + particleSpread * Math.sin(2 * Math.PI * (Math.floor((index + 1) / 4)) / (this.density / 4)),
                ringP: this.ringP
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
    document.getElementById("particleSpread").value = particleSpread;

    function animate() {
        rafId = requestAnimationFrame(animate)
        //Clear Background
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvasSize, canvasSize);
        //init more rings
        if (gameTime % 300 == 0)
            initRings()

        //Animate particles
        particleArray.forEach(e => {
            e.update()
        })

        if (playable) {
            updateMovement()
            ctx.fillStyle = "#FFF";
            ctx.fillRect(playerCoords.x - (playerSize + 2) / 2, playerCoords.y - (playerSize + 2) / 2, playerSize + 2, playerSize + 2);
            ctx.fillStyle = "#F00";
            ctx.fillRect(playerCoords.x - playerSize / 2, playerCoords.y - playerSize / 2, playerSize, playerSize);
        }

        gameTime += 1 * gameTimeMult;

    }

    function initRings() {
        emitterArray = [];
        let ringRadius = 50;
        for (let index = 0; index < ringCount; index++) {
            emitterArray.push(new ParticleEmitter({
                ox: canvasOrigin + ringRadius * Math.cos(2 * Math.PI * (index + 1) / ringCount),
                oy: canvasOrigin + yOffsetVal + ringRadius * Math.sin(2 * Math.PI * (index + 1) / ringCount),
                r: ringRadius, density: ringDensity, ringP: gameRingCount
            }));
        }
        ringRadius = 100;
        gameRingCount++;
        for (let index = 0; index < ringCount; index++) {
            emitterArray.push(new ParticleEmitter({
                ox: canvasOrigin + ringRadius * Math.cos(2 * Math.PI * (index + 1) / ringCount),
                oy: canvasOrigin + yOffsetVal + ringRadius * Math.sin(2 * Math.PI * (index + 1) / ringCount),
                r: 100, density: ringDensity, ringP: gameRingCount
            }));
        }
        ringRadius = 150;
        gameRingCount++;
        for (let index = 0; index < ringCount; index++) {
            emitterArray.push(new ParticleEmitter({
                ox: canvasOrigin + ringRadius * Math.cos(2 * Math.PI * (index + 1) / ringCount),
                oy: canvasOrigin + yOffsetVal + ringRadius * Math.sin(2 * Math.PI * (index + 1) / ringCount),
                r: ringRadius, density: ringDensity, ringP: gameRingCount
            }));
        }
        gameRingCount++;
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
    particleSpread = document.getElementById("particleSpread").value;

    window.history.replaceState("", "", `${window.location.href.split('?')[0]}?p1=${ringCount}&p2=${ringDensity}&p3=${particleSpeed}&p4=${gameTimeMult}&p5=${yOffsetVal}&p6=${particleSpread}`);

    //Restarts the Game
    cancelAnimationFrame(rafId)
    particleArray = [];
    gameTime = 0;
    gameRingCount = 0;
    onLoad();

}

function handlePlayable() {
    playable = document.getElementById("playable").checked;
    yOffsetVal = -200;
    document.getElementById("yOffsetVal").value = yOffsetVal;
    handleChange()

}

function handleKeyPress(e) {
    console.log(e.key)
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


function onClick() {

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

    if ((playerMovement.left && (playerMovement.up || playerMovement.down)) || (playerMovement.right && (playerMovement.up || playerMovement.down)))
        playerSpeed = Math.sqrt(defaultPlayerSpeed);
    else
        playerSpeed = defaultPlayerSpeed;

}