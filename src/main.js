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

  draw(keepPupulationSize) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, planctonSize, 0, 2 * Math.PI);
    ctx.fill();

    if (keepPupulationSize && planctons.length < 30) {
      planctons.push(new Plancton());
    }
  }
}

// Initialize with some plankton for biotas to chase
while (planctons.length < 100) {
  planctons.push(new Plancton());
}

class Biota {
  constructor(id) {
    this.id = id;
    // Randomize limbs for different biotas
    this.limbs = random(5, 15);
    this.size = this.limbs;
    this.velX = 0.02 * this.limbs;
    this.velY = 0.02 * this.limbs;
    // Each biota gets a different base speed
    this.speedFactor = 0.3 + (Math.random() * 0.5);
    // Jitter settings
    this.jitterAmount = 0.2 + (Math.random() * 0.3);
    this.jitterFrequency = 0.05 + (Math.random() * 0.05);
    this.jitterOffset = Math.random() * 1000; // Unique offset for each biota
    this.color = "rgb(" + random(100, 255) + "," + random(100, 255) + "," +
      random(100, 255) + ")";
    this.justAte = false;
    this.x = random(0 + this.size, width - this.size);
    this.y = random(0 + this.size, height - this.size);
    this.energy = (100 * this.size) * random(5, 10);
    this.lastX = this.x;
    this.lastY = this.y;
    this.distanceTravelled = 0;
    // No longer need this property since we calculate target each frame

    this.dragging = false;
  }

  draw() {
    // Draw movement trail (subtle water displacement effect)
    if (!this.trail) {
      this.trail = [];
    }

    // Update trail
    if (!this.dragging) {
      this.trail.unshift({x: this.x, y: this.y});
      if (this.trail.length > 5) {
        this.trail.pop();
      }
    }

    // Draw trail
    if (this.trail.length > 1) {
      ctx.beginPath();
      for (let i = 0; i < this.trail.length; i++) {
        const point = this.trail[i];
        const alpha = 0.1 * (1 - i / this.trail.length);

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, this.size * 0.3 * (1 - i / this.trail.length), 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // Draw limbs - small circles distributed around the biota
    let time = performance.now() * 0.001; // Current time in seconds

    // Limb parameters
    let limbSize = this.size * 0.3;
    let limbDistance = this.size * 1.1;

    // Get target direction for orientation
    let targetPlankton = this.nearestPlancton();
    let movingTowards = {x: 0, y: 0}; // Default direction

    if (targetPlankton.x !== 0 || targetPlankton.y !== 0) {
      let dx = targetPlankton.x - this.x;
      let dy = targetPlankton.y - this.y;
      let length = Math.sqrt(dx * dx + dy * dy);

      if (length > 0) {
        movingTowards.x = dx / length;
        movingTowards.y = dy / length;
      }
    }

    // Calculate angle offset based on movement direction
    let directionAngle = Math.atan2(movingTowards.y, movingTowards.x);

    // Draw each limb based on the biota's limb count
    for (let i = 0; i < this.limbs; i++) {
      // Calculate position in a circle around the biota, offset by movement direction
      // This makes limbs oriented toward the direction of movement
      let baseAngle = (i / this.limbs) * Math.PI * 2;
      let angle = baseAngle + directionAngle;

      // Add wave movement to limbs for swimming motion
      // Make back limbs wave more than front limbs
      let limbFactor = 0.5 + 0.5 * Math.sin(baseAngle - directionAngle);
      let waveOffset = Math.sin(time * 3 + i * 0.7) * 0.2 * limbFactor;
      let adjustedAngle = angle + waveOffset;

      // Calculate position
      let limbDistance = this.size * (1.0 + 0.2 * limbFactor); // Back limbs stretch a bit more
      let limbX = this.x + Math.cos(adjustedAngle) * limbDistance;
      let limbY = this.y + Math.sin(adjustedAngle) * limbDistance;

      // Vary limb size slightly
      let actualLimbSize = limbSize * (0.7 + 0.3 * Math.sin(i * 3.14));

      // Get slightly different color for limbs
      let limbColor = this.color;

      // If biota just ate, make limbs more vibrant
      if (this.justAte) {
        limbColor = "rgba(255, 255, 255, 0.8)";
      }

      // Draw connection to body first (so it's behind the limb)
      ctx.beginPath();
      ctx.lineWidth = actualLimbSize * 0.7;
      ctx.strokeStyle = limbColor;
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(limbX, limbY);
      ctx.stroke();

      // Draw limb
      ctx.beginPath();
      ctx.fillStyle = limbColor;
      ctx.arc(limbX, limbY, actualLimbSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw biota body
    ctx.beginPath();
    ctx.lineWidth = 5;

    // Change color briefly if just ate
    if (this.justAte) {
      ctx.strokeStyle = "rgb(255,255,255)";
      // Add glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = "white";
    } else {
      ctx.strokeStyle = this.color;
      ctx.shadowBlur = 0;
    }

    // Draw main body
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();

    // Reset shadow effect
    ctx.shadowBlur = 0;

    // Draw line to nearest plankton if one exists
    // We're already calculating this above, reuse targetPlankton
    if (targetPlankton.x !== 0 || targetPlankton.y !== 0) {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(targetPlankton.x, targetPlankton.y);
      ctx.stroke();
    }
  }

  move() {
    if (this.dragging) {
      return;
    }

    // go for the nearest plancton
    let nearestPlankton = this.nearestPlancton();
    if (nearestPlankton.x == 0 && nearestPlankton.y == 0) {
      // without a target just chill
      return
    }

    // calculate distance and movement steps
    this.lastX = this.x;
    this.lastY = this.y;

    // Calculate direction vector to target
    let deltaX = nearestPlankton.x - this.x;
    let deltaY = nearestPlankton.y - this.y;

    // Normalize direction and apply speed based on biota size and individual speed
    let length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (length > 0) {
      // Get base movement direction
      let dirX = deltaX / length;
      let dirY = deltaY / length;

      // Add jitter using sine waves with biota-specific parameters
      // This creates a natural-looking wavy swimming motion
      let time = performance.now() * 0.001; // Current time in seconds
      let jitterX = Math.sin(time * this.jitterFrequency + this.jitterOffset) * this.jitterAmount;
      let jitterY = Math.cos(time * this.jitterFrequency + this.jitterOffset + 1.3) * this.jitterAmount;

      // Calculate final speed based on limbs and individual speed factor
      let speed = (0.2 + (this.limbs * 0.03)) * this.speedFactor;

      // Apply movement with jitter
      this.x += (dirX + jitterX) * speed;
      this.y += (dirY + jitterY) * speed;

      // Keep biotas within canvas bounds
      this.x = Math.max(this.size, Math.min(width - this.size, this.x));
      this.y = Math.max(this.size, Math.min(height - this.size, this.y));
    }

    let totalDST = distance((this.lastX - this.x), (this.lastY - this.y));
    this.distanceTravelled += totalDST;
    this.burn(totalDST);
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
    // Position near parent
    copy.x = this.x + random(-5, 5) + this.size;
    copy.y = this.y + random(-5, 5) + this.size;

    // Stay within canvas bounds
    copy.x = Math.max(copy.size, Math.min(width - copy.size, copy.x));
    copy.y = Math.max(copy.size, Math.min(height - copy.size, copy.y));

    copy.id = this.id + "_copy";

    // Slight mutation in number of limbs
    copy.limbs = Math.max(3, Math.min(20, this.limbs + random(-2, 2)));
    copy.size = copy.limbs;

    // Inherit parent speed with slight mutation
    copy.speedFactor = Math.max(0.2, Math.min(1.0, this.speedFactor + (Math.random() * 0.2 - 0.1)));

    // Inherit jitter with slight mutation
    copy.jitterAmount = Math.max(0.1, Math.min(0.5, this.jitterAmount + (Math.random() * 0.1 - 0.05)));
    copy.jitterFrequency = Math.max(0.02, Math.min(0.1, this.jitterFrequency + (Math.random() * 0.02 - 0.01)));
    copy.jitterOffset = Math.random() * 1000; // New random offset

    // Update velocities
    copy.velX = 0.02 * copy.limbs;
    copy.velY = 0.02 * copy.limbs;

    // Slightly mutate color
    let parentColor = this.color.match(/\d+/g);
    let r = Math.max(100, Math.min(255, parseInt(parentColor[0]) + random(-20, 20)));
    let g = Math.max(100, Math.min(255, parseInt(parentColor[1]) + random(-20, 20)));
    let b = Math.max(100, Math.min(255, parseInt(parentColor[2]) + random(-20, 20)));
    copy.color = `rgb(${r},${g},${b})`;

    copy.energy = (100 * this.size) * random(5, 10);

    return copy;
  }

  // TODO: add tests
  // NOTE: having this calculated for everyframe is overkill
  // and might be responsible for the bug where the biota gets
  // stuck between possible planctons
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
    this.energy -= dst * this.limbs;

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
    this.justAte = false;
    for (let j = 0; j < planctons.length; j++) {
      const dx = this.x - planctons[j].x;
      const dy = this.y - planctons[j].y;
      const dst = distance(dx, dy);

      if (dst < this.size + planctons[j].size) {
        this.energy += planctons[j].size * 10;
        planctons.splice(j, 1);
        this.justAte = true;
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
        console.log("my new position is", b.x, b.y)
      }
    });
  });
}

for (let i = 0; i < 50; i++) {
  biotas.push(new Biota(i));
}

// define loop that keeps drawing the scene constantly
function loop() {
  ctx.fillStyle = "rgb(0,0,0,0.25)";
  ctx.fillRect(0, 0, width, height);

  planctons.forEach(p => {
    p.draw(true)
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
