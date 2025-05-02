const cnv = document.getElementById('myCanvas');
const ctx = cnv.getContext('2d');

// HTML Elements
let titleEl = document.getElementById('title');
let asteroidEl = document.getElementById('asteroid-speed');
let timeEl = document.getElementById('time-speed');


// Variables
let asteroids = [];
let moon = {
  x: 0,
  y: -250,
  radius: 30,
  angle: 190,
  dAngle: 12,
}

let leftKey = false;
let qKey = false;
let eKey = false;
let wKey = false;
let sKey = false;

let timeVar = 0;
let period = 50;

let accelerationTracker = 1;
let daccelerationTracker = (1/360)/50;


let timeOfDay = [
  {time: "dawn", skyColor: ["#6e81ff", "#C0D0DF", "#ff8547"], moonColor:`#FFFFFF`, moonAngle: 170},
  {time: "sunrise", skyColor: ["#4059ff", "#87CEEB", "#F4CF86"], moonColor:`#FFA07A`, moonAngle: 290},
  {time: "morning", skyColor: ["#00BFFF", "#74BDDA", "#d1f3ff"], moonColor:`#FFD700`, moonAngle: 320},
  {time: "noon", skyColor: ["#085ECB", "#085ECB", "#2FE2F7"], moonColor:`#FFFF00`, moonAngle: 0},
  {time: "afternoon", skyColor: ["#325DB0", "#5A82CF", "#9BC1F9"], moonColor:`#ffa86e`, moonAngle: 40},
  {time: "sunset", skyColor: ["#B285B4", "#D29EBF", "#F39E6A"], moonColor:`#FF6E7F`, moonAngle: 430},
  {time: "evening", skyColor: ["#A0687B", "#c992a4", "#F7B969"], moonColor:`#FFFFFF`, moonAngle: 170},
  {time: "moonrise", skyColor: ["#AF849A", "#907198", "#506C98"], moonColor:`#757575`, moonAngle: 290},
  {time: "early night", skyColor: ["#114E9E","#486FBA", "#606395"], moonColor:`#BDBDBD`, moonAngle: 320},
  {time: "midnight", skyColor: ["#090B17", "#0B234B", "#0C5BA1"], moonColor:`#FFFFFF`, moonAngle: 0},
  {time: "late night", skyColor: ["#082855", "#0B5B9F", "#0B83BD"], moonColor:`#BDBDBD`, moonAngle: 40},
  {time: "moonset", skyColor: ["#10366b", "#146ab3", "#1089c4"], moonColor:`#757575`, moonAngle: 430},
];

// 400, 350, 275, 200
let timeIndex = 0;

// Fill asteroid associative array
for(let i = 0; i < 1000; i++) {
  asteroids.push(createAsteroid());
}

// Keyboard Events
document.addEventListener('keydown', keydownHandler)
document.addEventListener('keyup', keyupHandler)

function keydownHandler(event) {
  console.log(event.code + " True")
  if (event.code == "ArrowLeft") {
    leftKey = true;
  }

  if (event.code == "KeyQ") {
    qKey = true;
  }

  if (event.code == "KeyE") {
    eKey = true;
  }

  if (event.code == "KeyW") {
    wKey = true;
  }

  if (event.code == "KeyS") {
    sKey = true;
  }
}

function keyupHandler(event) {
  console.log(event.code + " False")
  if (event.code == "ArrowLeft") {
    leftKey = false;
  }

  if (event.code == "KeyQ") {
    qKey = false;
  }

  if (event.code == "KeyE") {
    eKey = false;
  }

  if (event.code == "KeyW") {
    wKey = false;
  }

  if (event.code == "KeyS") {
    sKey = false;
  }
}

function drawScene() {

  // Time Related
  timeVar++;

  if (timeVar % period == 0) {
    timeIndex++;
    if (timeIndex == timeOfDay.length) {
      timeIndex = 0;
    }
  }
  
  if (wKey && period > 10) {
    period--;
    timeEl.innerHTML = ((1/period)*50).toFixed(2);
  } else if (sKey && period < 100) {
    period++;
    timeEl.innerHTML = ((1/period)*50).toFixed(2);
  }

  // Draw the sky
  const grad=ctx.createLinearGradient(cnv.width/2, 0, cnv.width/2, cnv.height);
  grad.addColorStop(0, timeOfDay[timeIndex]["skyColor"][0]);
  grad.addColorStop(0.5, timeOfDay[timeIndex]["skyColor"][1]);
  grad.addColorStop(0.9, timeOfDay[timeIndex]["skyColor"][2]);
  
  ctx.fillStyle = grad;

  // ctx.fillStyle = timeOfDay[timeIndex]["skyColor"];
  ctx.fillRect(0,0,cnv.width, cnv.height);

  // Asteroids
  asteroids.forEach(asteroid => {
    ctx.fillStyle = `rgb(${asteroid["color"]}, ${asteroid["color"]}, ${asteroid["color"]})`;
    ctx.save();
    ctx.translate(350, 500);
    ctx.rotate(timeOfDay[timeIndex]["moonAngle"]*Math.PI/180);

    ctx.translate(moon.x, moon.y);
    ctx.rotate(asteroid["angle"]*Math.PI/180);
    
    
    ctx.beginPath();
    ctx.arc(asteroid["x"], asteroid["y"], asteroid["radius"], 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
  })

  // Animation
  asteroids.forEach(asteroid => {
    // If the left arrow key is being held
    if (leftKey) {
      /* STOP  ASTEROIDS */
      if (eKey && qKey) {
        if (asteroid["dAngle"] < asteroid["dAngleAdd"]*2 && asteroid["dAngle"] > -asteroid["dAngleAdd"]*2) { // Once near, zero, make it zero
          asteroid["dAngle"] = 0;
        } else if (asteroid["dAngle"] < 0) { // Slow down near zero
          asteroid["dAngle"] += asteroid["dAngleAdd"];
        }

        if (accelerationTracker < 0.001) {
          accelerationTracker = 0;
        } else if (accelerationTracker < 4) {
          accelerationTracker -= daccelerationTracker;
        }
        
      } 
      /* SPEED UP ASTEROIDS LEFT */
      else if (qKey) {
        if(asteroid["dAngle"] > -asteroid["dAngleUpperLimit"]){
          asteroid["dAngle"] += -asteroid["dAngleAdd"];
        }
        
        if (accelerationTracker < 3) {
          accelerationTracker += daccelerationTracker;
        }

      } 
      /* SLOW DOWN ASTEROIDS LEFT*/
      else if (eKey) {
        if (asteroid["dAngle"] > -asteroid["dAngleLowerLimit"]) {
          asteroid["dAngle"] -= asteroid["dAngleAdd"];
        }
        if (asteroid["dAngle"] < -asteroid["dAngleLowerLimit"]*2) {
          asteroid["dAngle"] += asteroid["dAngleAdd"];
        }

        if (accelerationTracker > 1/6) {
          accelerationTracker -= daccelerationTracker;
        } else if (accelerationTracker < 1/6) {
          accelerationTracker += daccelerationTracker;
        }

      } 
      /* NORMALIZE ASTEROIDS */
      else {
        if (asteroid["dAngle"] >= -asteroid["dAngleOriginal"]) {
          asteroid["dAngle"] -= asteroid["dAngleAdd"];
        } else if (asteroid["dAngle"] <= -asteroid["dAngleOriginal"]){
          asteroid["dAngle"] += asteroid["dAngleAdd"];
        }

        if (accelerationTracker < 4 && accelerationTracker > 1) {
          accelerationTracker -= daccelerationTracker;
        } else if (accelerationTracker > -1 && accelerationTracker < 1) {
          accelerationTracker += daccelerationTracker;
        }
        
      }
    }
    // If the no arrow keys are being held
    else  {
      /* STOP ASTEROIDS */
      if (eKey && qKey) {
        if (asteroid["dAngle"] < asteroid["dAngleAdd"]*2 && asteroid["dAngle"] > -asteroid["dAngleAdd"]*2) { // Once near, zero, make it zero
          asteroid["dAngle"] = 0;
        } else if (asteroid["dAngle"] > 0) { // Slow down near zero
          asteroid["dAngle"] -= asteroid["dAngleAdd"];
        }

        if (accelerationTracker < 0.001){
          accelerationTracker = 0;
        } else if (accelerationTracker < 4) {
          accelerationTracker -= daccelerationTracker;
        }
      }
      /* SPEED UP ASTEROIDS */
      else if (qKey) {
        if (asteroid["dAngle"] < asteroid["dAngleUpperLimit"]) {
          asteroid["dAngle"] += asteroid["dAngleAdd"];
        }
          
        if (accelerationTracker < 3) {
          accelerationTracker += daccelerationTracker;
        }

      }
      /* SLOW DOWN ASTEROIDS */
      else if (eKey) {
        if (asteroid["dAngle"] > asteroid["dAngleLowerLimit"]) {
          asteroid["dAngle"] -= asteroid["dAngleAdd"];
        }
        if (asteroid["dAngle"] < asteroid["dAngleLowerLimit"]*2) {
          asteroid["dAngle"] += asteroid["dAngleAdd"];
        }

        if (accelerationTracker > 1/6) {
          accelerationTracker -= daccelerationTracker;
        } else if (accelerationTracker < 1/6) {
          accelerationTracker += daccelerationTracker;
        }
      }
      /* NORMALIZE ASTEROIDS */
      else {
        if (asteroid["dAngle"] >= asteroid["dAngleOriginal"]) {
          asteroid["dAngle"] -= asteroid["dAngleAdd"];
        } else if (asteroid["dAngle"] <= asteroid["dAngleOriginal"]){
          asteroid["dAngle"] += asteroid["dAngleAdd"];
        }

        if (accelerationTracker < 4 && accelerationTracker > 1) {
          accelerationTracker -= daccelerationTracker;
        } else if (accelerationTracker > -1 && accelerationTracker < 1) {
          accelerationTracker += daccelerationTracker;
        }
        
      }
    }

    asteroid["angle"] += asteroid["dAngle"];
    asteroidEl.innerHTML = (accelerationTracker).toFixed(2);
  })

  
  // Sun/Moon
  ctx.fillStyle = timeOfDay[timeIndex]["moonColor"];
  ctx.save();
  ctx.translate(350, 500);
  ctx.rotate(timeOfDay[timeIndex]["moonAngle"]*Math.PI/180);

  ctx.beginPath();
  ctx.arc(moon.x, moon.y, moon.radius, 0, Math.PI*2);
  ctx.fill();

  ctx.restore();
  

  // Backdrop Hill 1
  ctx.fillStyle = "rgb(0, 73, 0)";
  ctx.beginPath();
  ctx.moveTo(-200, 500);
  ctx.quadraticCurveTo(0, 300, 200, 500);
  ctx.fill();

  // Backdrop Hill 2
  ctx.fillStyle = "rgb(0, 54, 0)";
  ctx.beginPath();
  ctx.moveTo(400, 500);
  ctx.quadraticCurveTo(600, 300, 800, 500);
  ctx.fill();

  // Backdrop Tree
  ctx.fillStyle = "rgb(44, 25, 0)";
  ctx.fillRect(630, 420, 20, 60);
  ctx.fillStyle = "rgb(0, 110, 0)";
  ctx.beginPath();
  ctx.moveTo(640, 390);
  ctx.lineTo(620, 420);
  ctx.lineTo(660, 420);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(640, 400);
  ctx.lineTo(615, 440);
  ctx.lineTo(665, 440);
  ctx.fill();

  // Front Hill
  ctx.fillStyle = "rgb(0, 124, 0)";
  ctx.beginPath()
  ctx.moveTo(0, 500);
  ctx.quadraticCurveTo(350, 200, 700, 500);
  ctx.fill();

  // Front Tree
  ctx.fillStyle = "rgb(68, 39, 0)";
  ctx.fillRect(190, 400, 20, 60);
  ctx.fillStyle = "rgb(0, 151, 0)";
  ctx.beginPath();
  ctx.moveTo(200, 360);
  ctx.lineTo(180, 400);
  ctx.lineTo(220, 400);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(200, 380);
  ctx.lineTo(175, 420);
  ctx.lineTo(225, 420);
  ctx.fill();

  // Lake
  ctx.fillStyle = "rgb(0, 19, 190)";
  ctx.beginPath();
  ctx.ellipse(430, 420, 80, 30, 0, 0, 2 * Math.PI);
  ctx.fill();

  // Duckie Body
  ctx.fillStyle = "rgb(255, 255, 0)";
  ctx.beginPath();
  ctx.ellipse(410, 410, 20, 10, 0, 0, 2 * Math.PI);
  ctx.ellipse(395, 400, 11, 11, 0, 0, 2 * Math.PI);
  ctx.fill();
    
  // Duckie Eye
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.beginPath();
  ctx.arc(390, 400, 2, 0, Math.PI*2);
  ctx.fill();

  // Duckie Beak
  ctx.fillStyle = "rgb(255, 153, 0)";
  ctx.beginPath();
  ctx.moveTo(384, 402);
  ctx.lineTo(378, 405);
  ctx.lineTo(387, 408);
  ctx.fill();

  titleEl.style.color = timeOfDay[timeIndex]["skyColor"];
  window.requestAnimationFrame(drawScene);
}
window.requestAnimationFrame(drawScene);

function createAsteroid() {
  let oneAsteroid = {
    x: Math.random()*(cnv.width/2),
    y: Math.random()*(cnv.height/2),
    radius: Math.random() * 3 + 2,
    angle: Math.random() * 360,
    dAngle: Math.random() * 1.9 + 0.1,
    color: Math.random() * 150 + 50,
  }

  oneAsteroid.dAngleOriginal = oneAsteroid.dAngle;
  oneAsteroid.dAngleUpperLimit = oneAsteroid.dAngle*3;
  oneAsteroid.dAngleLowerLimit = oneAsteroid.dAngle/6;
  oneAsteroid.dAngleAdd = oneAsteroid.dAngle/50;

  // Asteroids cannot spawn inside the moon
  while (oneAsteroid.x > moon.x - moon.radius - oneAsteroid.radius - 10 && oneAsteroid.x < moon.x + moon.radius + oneAsteroid.radius + 10) {
    oneAsteroid.x = Math.random()*cnv.width;
  }
  while (oneAsteroid.y > moon.y - moon.radius - oneAsteroid.radius - 10 && oneAsteroid.y < moon.y + moon.radius + oneAsteroid.radius + 10) {
    oneAsteroid.y = Math.random()*cnv.width;
  }

  return oneAsteroid;
}

// Predefined HTML Elements
asteroidEl.innerHTML = (accelerationTracker).toFixed(2);
timeEl.innerHTML = ((1/period)*50).toFixed(2);

// ***************************************************
// Global Vars
let mouseX;
let mouseY;

// mouse movement listener
cnv.addEventListener('mousemove', mousemoveHandler);

// Math Helper Functions
function mousemoveHandler(event) {
  let rect = cnv.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
  console.log('X: ' + mouseX + '  Y: ' + mouseY);
}
// ***************************************************
