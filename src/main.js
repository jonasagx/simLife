const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

const planctonSize = 50;
class Plancton {
  constructor() {
    this.x = random(0 + planctonSize, width);
    this.y = random(0 + planctonSize, height);
    this.color = "RGBA(255, 255, 0, 1)";
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
     // ctx.ellipse(this.x, this.y, planctonSize, planctonSize, Math.PI / 4, 0, 2 * Math.PI);
    // ctx.stroke();
  }
}

class Biota {
  constructor() {
    this.limbs = random(5, 40);
    this.size = this.limbs;
    this.velX = 0.1 * this.limbs;
    this.velY = 0.1 * this.limbs;
    this.color = "rgb(" + random(0, 255) + "," + random(0, 255) + "," +
      random(0, 255) + ")";
    this.x = random(0 + this.size, width);
    this.y = random(0 + this.size, height);
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
  update() {
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }
  // define ball collision detection
  collisionDetect() {
    for (let j = 0; j < biotas.length; j++) {
      if (!(this === biotas[j])) {
        const dx = this.x - biotas[j].x;
        const dy = this.y - biotas[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + biotas[j].size) {
          biotas[j].color = this.color = "rgb(" + random(0, 255) + "," +
            random(0, 255) + "," + random(0, 255) + ")";
        }
      }
    }
  }
}

let biotas = [];
let planctons = [];

while (biotas.length < 10) {
  biotas.push(new Biota());
}

while (planctons.length < 10) {
  planctons.push(new Plancton());
}

// define loop that keeps drawing the scene constantly

function loop() {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, width, height);

  planctons.forEach(p => {
    p.draw()
  });

  biotas.forEach(b => {
    b.draw();
    b.update();
    b.collisionDetect();
  })
  requestAnimationFrame(loop);
}

loop();
