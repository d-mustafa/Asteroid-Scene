const cnv = document.getElementById('myCanvas');
const ctx = cnv.getContext('2d');



// Variables
let asteroids = [];
let moon = {
  x: 350,
  y: 200,
  radius: 30,
}
let leftKey = false;
let qKey = false;
let eKey = false;
let timeVar = 0;
let timeOfDay = ["early morning", "sunrise", "morning", "noon", "afternoon", "sunset", "evening", "night", "mignight"];
let timeIndex = 0;

// Fill asteroid associative array
for(let i = 0; i < 1000; i++) {
  asteroids.push(createAsteroid());
}

console.log(asteroids);

// Keyboard Events
document.addEventListener('keydown', keydownHandler)
document.addEventListener('keyup', keyupHandler)

function keydownHandler(event) {
  console.log(event.code + " Held")
  if (event.code == "ArrowLeft") {
    leftKey = true;
  }

  if (event.code == "KeyQ") {
    qKey = true;
  }

  if (event.code == "KeyE") {
    eKey = true;
  }
}

function keyupHandler(event) {
  console.log(event.code + " Released")
  if (event.code == "ArrowLeft") {
    leftKey = false;
  }

  if (event.code == "KeyQ") {
    qKey = false;
  }

  if (event.code == "KeyE") {
    eKey = false;
  }
}

function drawScene() 
  timeVar++;

  // Draw the sky
  if (timeVar % 500 == 0) {
    timeIndex += 1;
    if (timeIndex == timeOfDay.length) {
      timeIndex == 0;
    }
  }

  determineFillStyle([`#1D3C6A`, `#FF4500`, `#87CEEB`, `#00BFFF`, `#00CED1`, `#FF6347`, `#4B0082`, `#1A1A2E`, `#000033`]);
  ctx.fillRect(0,0,cnv.width, cnv.height);

  // Asteroids
  asteroids.forEach(asteroid => {
    ctx.fillStyle = `rgb(${asteroid["color"]}, ${asteroid["color"]}, ${asteroid["color"]})`;
    ctx.save();
    ctx.translate(moon.x, moon.y);
    ctx.rotate(asteroid["angle"]*Math.PI/180);
    
    ctx.beginPath();
    ctx.arc(asteroid["x"], asteroid["y"], asteroid["radius"], 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
  })

  // Animation
  asteroids.forEach(asteroid => {
    if (leftKey) {
      if (eKey && qKey) { // STOP
        if (asteroid["dAngle"] < asteroid["dAngleAdd"]*2 && asteroid["dAngle"] > -asteroid["dAngleAdd"]*2) { // Once near, zero, make it zero
          asteroid["dAngle"] = 0;
        } else if (asteroid["dAngle"] < 0) { // Slow down near zero
          asteroid["dAngle"] += asteroid["dAngleAdd"];
        }
      }
      else if (qKey && (asteroid["dAngle"] > -asteroid["dAngleUpperLimit"])) { // SPEED UP
        asteroid["dAngle"] += -asteroid["dAngleAdd"];

      } else if (eKey) { // SLOW DOWN
        if (asteroid["dAngle"] > -asteroid["dAngleLowerLimit"]) {
          asteroid["dAngle"] -= asteroid["dAngleAdd"];
        }
        if (asteroid["dAngle"] < -asteroid["dAngleLowerLimit"]*2) {
          asteroid["dAngle"] += asteroid["dAngleAdd"];
        }
      } else { // NORMALIZE
        if (asteroid["dAngle"] >= -asteroid["dAngleOriginal"]) {
          asteroid["dAngle"] -= asteroid["dAngleAdd"];
        } else if (asteroid["dAngle"] <= -asteroid["dAngleOriginal"]){
          asteroid["dAngle"] += asteroid["dAngleAdd"];
        }
      }
    } else  {
      if (eKey && qKey) { // STOP
        if (asteroid["dAngle"] < asteroid["dAngleAdd"]*2 && asteroid["dAngle"] > -asteroid["dAngleAdd"]*2) { // Once near, zero, make it zero
          asteroid["dAngle"] = 0;
        } else if (asteroid["dAngle"] > 0) { // Slow down near zero
          asteroid["dAngle"] -= asteroid["dAngleAdd"];
        }
      }
      else if (qKey && (asteroid["dAngle"] < asteroid["dAngleUpperLimit"])) { // SPEED UP
        asteroid["dAngle"] += asteroid["dAngleAdd"];

      } else if (eKey) { // SLOW DOWN
        if (asteroid["dAngle"] > asteroid["dAngleLowerLimit"]) {
          asteroid["dAngle"] -= asteroid["dAngleAdd"];
        }
        if (asteroid["dAngle"] < asteroid["dAngleLowerLimit"]*2) {
          asteroid["dAngle"] += asteroid["dAngleAdd"];
        }
      } else { // NORMALIZE
        if (asteroid["dAngle"] >= asteroid["dAngleOriginal"]) {
          asteroid["dAngle"] -= asteroid["dAngleAdd"];
        } else if (asteroid["dAngle"] <= asteroid["dAngleOriginal"]){
          asteroid["dAngle"] += asteroid["dAngleAdd"];
        }
      }
    }
    asteroid["angle"] += asteroid["dAngle"];
  })

  
  // Sun/Moon
  determineFillStyle([`#1C1C3A`, `#FFA07A`, `#FFD700`, `#FFFF00`, `#FFE4B5`, `#FF6E7F`, `#FFA500`, `#191970`, `#B0C4DE`]);
  ctx.beginPath();
  ctx.arc(moon.x, moon.y, moon.radius, 0, Math.PI*2);
  ctx.fill();
  

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

function determineFillStyle(colors) {
  if(timeOfDay[timeIndex] == "early morning") {
    ctx.fillStyle = colors[0];
  } else if(timeOfDay[timeIndex] == "sunrise") {
    ctx.fillStyle = colors[1];
  } else if(timeOfDay[timeIndex] == "morning") {
    ctx.fillStyle = colors[2];
  } else if(timeOfDay[timeIndex] == "noon") {
    ctx.fillStyle = colors[3];
  } else if(timeOfDay[timeIndex] == "afternoon") {
    ctx.fillStyle = colors[4];
  } else if(timeOfDay[timeIndex] == "sunset") {
    ctx.fillStyle = colors[5];
  } else if(timeOfDay[timeIndex] == "evening") {
    ctx.fillStyle = colors[6];
  } else if(timeOfDay[timeIndex] == "night") {
    ctx.fillStyle = colors[7];
  } else if(timeOfDay[timeIndex] == "midnight") {
    ctx.fillStyle = colors[8];
  }
}




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
