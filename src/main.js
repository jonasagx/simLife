const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

function distance(dx, dy) {
  return Math.sqrt(dx * dx + dy * dy)
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

while (planctons.length < 100) {
  planctons.push(new Plancton());
}

class Biota {
  constructor(id) {
    this.id = id;
    this.limbs = random(5, 20);
    this.size = this.limbs;
    this.velX = 0.05 * this.limbs;
    this.velY = 0.05 * this.limbs;
    this.color = "rgb(" + random(0, 255) + "," + random(0, 255) + "," +
      random(0, 255) + ")";
    this.x = random(0 + this.size, width);
    this.y = random(0 + this.size, height);
    this.energy = (1000 * this.size) * random(5, 10);
    this.lastX = 0;
    this.lastY = 0;
    this.distanceTravelled = 0;
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

    this.lastX, this.lastY = this.x, this.lastY;
    this.x += (this.velX + random(-1, 1));
    this.y += (this.velY + random(-1, 1));
   
    let dst = distance((this.lastX - this.x), (this.lastY - this.y));
    this.distanceTravelled += dst;
    this.burn(dst); 
  }

  burn(dst) {
    this.energy -= dst * 0.004;

    if (this.energy > 0) {
      return 
    } 

    biotas.forEach((b, i) => {
      if (this.id == b.id) {
        console.log("bye", b.id)
        biotas.splice(i, 1);
      }
    })
  }

  eat() {
    for (let j = 0; j < planctons.length; j++) {
      const dx = this.x - planctons[j].x;
      const dy = this.y - planctons[j].y;
      const dst = distance(dx, dy);

      if (dst < this.size + planctons[j].size) {
        this.energy += planctons[j].size;
        planctons.splice(j, 1);
        console.log("biota energy level", this.energy);
        break;
      }
    }
  }
}

for (let i = 0; i < 10; i++) {
  biotas.push(new Biota(i));
}

// define loop that keeps drawing the scene constantly
function loop() {
  ctx.fillStyle = "rgb(0,0,0,0.25)";
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
