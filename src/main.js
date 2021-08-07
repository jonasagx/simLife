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
    this.x = random(0 + planctonSize, width - planctonSize);
    this.y = random(0 + planctonSize, height - planctonSize);
    this.color = "RGBA(255, 255, 0, 1)";
    this.size = planctonSize;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, planctonSize, 0, 2 * Math.PI);
    ctx.fill();

    if (planctons.length < 30) {
      planctons.push(new Plancton());
    }
  }
}

while (planctons.length < 30) {
  planctons.push(new Plancton());
}

class Biota {
  constructor(id) {
    this.id = id;
    this.limbs = random(5, 20);
    this.size = this.limbs;
    this.velX = 0.02 * this.limbs;
    this.velY = 0.02 * this.limbs;
    this.color = "rgb(" + random(0, 255) + "," + random(0, 255) + "," +
      random(0, 255) + ")";
    this.x = random(0 + this.size, width);
    this.y = random(0 + this.size, height);
    this.energy = (100 * this.size) * random(5, 10);
    this.lastX = 0;
    this.lastY = 0;
    this.distanceTravelled = 0;

    this.dragging = false;
  }

  draw() {
    ctx.beginPath();
    // ctx.fillStyle = this.color;
    ctx.lineWidth = 5;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  move() {
    if (this.dragging) {
      return;
    }

    // go for the nearest plancton
    let goal = this.nearestPlancton();
    const a = (goal.y - this.y) / (goal.x - this.x);
    // console.log("nearest plancton", goal, a);

    // calculate distance
    this.lastX = this.x;
    this.lastY = this.lastY;

    if (this.x > goal.x) {
      this.x -= this.velX;      
    } else if (this.x < goal.x) {
      this.x += this.velX;
    }

    if (this.y > goal.x) {
      this.y -= (a * this.velY);      
    } else if (goal.y < this.y) {
      this.y += (a * this.velX);
    }

    // this.x += this.velX;
    // this.y += (a * this.velX);

    let dst = distance((this.lastX - this.x), (this.lastY - this.y));
    this.distanceTravelled += dst;
    this.burn(dst); 
  }

  replicate() {
    if (this.energy < 15000) {
      return;
    }
    let copy = this.clone();
    biotas.push(copy);
    console.log("replicated", this.id, this.energy);
    this.energy -= 10000;
  }

  clone() {
    let copy = new Biota();
    copy.x = this.x + random(-5, 5) + this.size;
    copy.y = this.y + random(-5, 5) + this.size;
    copy.id = this.id + "_copy";
    copy.limbs = Math.min(this.limbs, this.limbs + random(-2, 2));
    copy.size = copy.limbs;
    copy.velX = 0.02 * copy.limbs;
    copy.velY = 0.02 * copy.limbs;
    copy.color = this.color;
    copy.energy = (100 * this.size) * random(5, 10);

    return copy;
  }

  nearestPlancton() {
    let minDst = Number.MAX_SAFE_INTEGER;
    let x = 0;
    let y = 0;
  
    planctons.forEach(p => {
      let dst = distance((this.x - p.x), (this.y - p.y));
      if (dst < minDst) {
        minDst = dst;
        x = p.x;
        y = p.y;
      }
    });

    return { x: x, y: y }
  }

  // burn burns biotas energy based on how much distance it travelled
  // if the energy level is equals or bellow zero the biota dies.
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
    });
  }


  eat() {
    for (let j = 0; j < planctons.length; j++) {
      const dx = this.x - planctons[j].x;
      const dy = this.y - planctons[j].y;
      const dst = distance(dx, dy);

      if (dst < this.size + planctons[j].size) {
        this.energy += planctons[j].size;
        planctons.splice(j, 1);
        // console.log("biota energy level", this.id, this.energy);
        this.replicate();
        break;
      }
    }
  }
}

function findNearestBiota(items, x, y) {
  for (var i = items.length - 1; i >= 0; i--) {
    let dst = distance((items[i].x - x), (items[i].y - y));
    if (dst <= items[i].size) {
      return items[i]
    }    
  }

  return {};
}

function addDragEventListeners() {
  canvas.addEventListener('mousedown', e => {
    b = findNearestBiota(biotas, e.offsetX, e.offsetY);
    if (Object.keys(b).length === 0) {
      p = new Plancton();
      p.x = e.clientX;
      p.y = e.clientY;
      planctons.push(p);
      return; 
    }

    b.dragging = true;
    b.x = e.offsetX;
    b.y = e.offsetY;

    canvas.addEventListener('mousemove', e => {
      if (!b.dragging) {
        return;
      }
      b.x = e.offsetX;
      b.y = e.offsetY;
    });

    window.addEventListener('mouseup', _ => {
      if (b.dragging) {
        b.dragging = false;
      }
    });
  });
}

for (let i = 0; i < 2; i++) {
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

addDragEventListeners();
loop();
