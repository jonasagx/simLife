const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

let biotas = [];
let planctons = [];

const planctonSize = 5;
class Plancton {
  constructor() {
    this.x = random(0 + planctonSize, width);
    this.y = random(0 + planctonSize, height);
    this.color = "RGBA(255, 255, 0, 1)";
    this.size = planctonSize;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, planctonSize, 0, 2 * Math.PI);
    ctx.fill();
  }
}

while (planctons.length < 10) {
  planctons.push(new Plancton());
}

class Biota {
  constructor() {
    this.limbs = random(5, 20);
    this.size = this.limbs;
    this.velX = 0.05 * this.limbs;
    this.velY = 0.05 * this.limbs;
    this.color = "rgb(" + random(0, 255) + "," + random(0, 255) + "," +
      random(0, 255) + ")";
    this.x = random(0 + this.size, width);
    this.y = random(0 + this.size, height);
    this.energy = 0;
  }

  draw() {
    ctx.beginPath();
    // ctx.fillStyle = this.color;
    ctx.lineWidth = 4;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  move() {
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

    this.x += (this.velX + random(-1, 1));
    this.y += (this.velY + random(-1, 1));
  }

  eat() {
    for (let j = 0; j < planctons.length; j++) {
      const dx = this.x - planctons[j].x;
      const dy = this.y - planctons[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + planctons[j].size) {
        this.energy += planctons[j].size;
        planctons.splice(j, 1);
        break;
      }
    }
}

}
while (biotas.length < 10) {
  biotas.push(new Biota());
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
    b.move();
    b.eat();
  })
  requestAnimationFrame(loop);
}

loop();
