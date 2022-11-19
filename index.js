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

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if (urlParams.get('p1')) ringCount = urlParams.get('p1');
if (urlParams.get('p2')) ringDensity = urlParams.get('p2');
if (urlParams.get('p3')) particleSpeed = urlParams.get('p3');
if (urlParams.get('p4')) gameTimeMult = urlParams.get('p4');

class Particle {
    constructor({ x, y, color, ax, ay, ringP }) {
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
            case 3 || 4:
                this.color = "green";
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
        //Priority Release
        if (gameTime - 100 * this.ringP > 0) {
            this.x -= this.ax * particleSpeed;
            this.y -= this.ay * particleSpeed;
        }

        //Increase time and draw
        this.draw();
    }
}

class ParticleEmitter {
    constructor({ ox, oy, r, density, color, ringP }) {
        this.ox = ox;
        this.oy = oy;
        this.r = r;
        this.density = density;
        this.color = color;
        this.ringP = ringP;
    }
    draw() {
        //Draw particle
        for (let index = 0; index < this.density; index++) {
            particleArray.push(new Particle({
                x: this.ox + this.r * Math.cos(2 * Math.PI * (index + 1) / this.density),
                y: this.oy + this.r * Math.sin(2 * Math.PI * (index + 1) / this.density),
                color: this.color,
                ax: Math.cos(2 * Math.PI * (index + 1) / this.density),
                ay: Math.sin(2 * Math.PI * (index + 1) / this.density),
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
        gameTime += 1 * gameTimeMult;

    }

    function initRings() {


        emitterArray = [];
        let ringRadius = 50;
        for (let index = 0; index < ringCount; index++) {
            emitterArray.push(new ParticleEmitter({
                ox: canvasOrigin + ringRadius * Math.cos(2 * Math.PI * (index + 1) / ringCount),
                oy: canvasOrigin + ringRadius * Math.sin(2 * Math.PI * (index + 1) / ringCount),
                r: ringRadius, density: ringDensity, color: "#F00", ringP: gameRingCount
            }));
        }
        ringRadius = 100;
        gameRingCount++;
        for (let index = 0; index < ringCount; index++) {
            emitterArray.push(new ParticleEmitter({
                ox: canvasOrigin + ringRadius * Math.cos(2 * Math.PI * (index + 1) / ringCount),
                oy: canvasOrigin + ringRadius * Math.sin(2 * Math.PI * (index + 1) / ringCount),
                r: 100, density: ringDensity, color: "#F0F", ringP: gameRingCount
            }));
        }
        ringRadius = 150;
        gameRingCount++;
        for (let index = 0; index < ringCount; index++) {
            emitterArray.push(new ParticleEmitter({
                ox: canvasOrigin + ringRadius * Math.cos(2 * Math.PI * (index + 1) / ringCount),
                oy: canvasOrigin + ringRadius * Math.sin(2 * Math.PI * (index + 1) / ringCount),
                r: ringRadius, density: ringDensity, color: "#00F", ringP: gameRingCount
            }));
        }
        gameRingCount++;
        emitterArray.forEach(e => e.draw())
    }

    //Draw Background

    animate()
}

function handleChange() {
    ringCount = document.getElementById("ringCount").value;
    ringDensity = document.getElementById("ringDensity").value;
    particleSpeed = document.getElementById("particleSpeed").value;
    gameTimeMult = document.getElementById("gameTimeMult").value;

    window.history.replaceState("", "", `${window.location.href.split('?')[0]}?p1=${ringCount}&p2=${ringDensity}&p3=${particleSpeed}&p4=${gameTimeMult}`);

    //Restarts the Game
    cancelAnimationFrame(rafId)
    particleArray = [];
    gameTime = 0;
    gameRingCount = 0;
    onLoad();

}

function onClick() {

}