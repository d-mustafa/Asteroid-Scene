const cnv = document.getElementById('myCanvas');
const ctx = cnv.getContext('2d');

// HTML Elements
let titleEl = document.getElementById('title');
let asteroidEl = document.getElementById('asteroid-speed');
let timeEl = document.getElementById('time-speed');

let qKeyElement = document.getElementById('qkey');
let eKeyElement = document.getElementById('ekey');
let qKey_eKeyElement = document.getElementById('qkey-plus-ekey');
let leftKeyElement = document.getElementById('leftkey');
let leftKey_qKeyElement = document.getElementById('leftkey-plus-qkey');
let leftKey_eKeyElement = document.getElementById('leftkey-plus-ekey');
let wKeyElement = document.getElementById('wkey');
let sKeyElement = document.getElementById('skey');



// Variables, Arrays and Associative Arrays
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
let controlElements = [
  { affectsAsteroids: [qKeyElement, eKeyElement, qKey_eKeyElement, leftKeyElement, leftKey_qKeyElement, leftKey_eKeyElement] },
  { affectsTime: [wKeyElement, sKeyElement] },
];

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
let timeIndex = 0;
let timeVar = 0;
let period = 100;


let accelerationTracker = 1;
let daccelerationTracker = (1/360)/50;

// Predefined HTML Elements
titleEl.style.color = timeOfDay[timeIndex]["skyColor"][0];
asteroidEl.innerHTML = (accelerationTracker).toFixed(2);
timeEl.innerHTML = ((1/period)*50).toFixed(2);


// Fill asteroid associative array
for(let i = 0; i < 1000; i++) {
  asteroids.push(createAsteroid());
}

// Keyboard Events
document.addEventListener('keydown', keydownHandler)
document.addEventListener('keyup', keyupHandler)

function keydownHandler(event) {
  if (event.code == "ArrowLeft") {
    leftKey = true;
    console.log("Asteroids are now rotating counterclockwise.");
  }

  if (event.code == "KeyQ") {
    qKey = true;
    console.log("Asteroids are now speeding up.");
  }

  if (event.code == "KeyE") {
    eKey = true;
    console.log("Asteroids are now slowing down.");
  }

  if (event.code == "KeyW") {
    wKey = true;
    console.log("Time is accelerating.");
  }

  if (event.code == "KeyS") {
    sKey = true;
    console.log("Time is deccelerating.");
  }
}

function keyupHandler(event) {
  if (event.code == "ArrowLeft") {
    leftKey = false;
    console.log("Asteroids are now rotating clockwise.");
  }

  if (event.code == "KeyQ") {
    qKey = false;
    console.log("Asteroids are no longer speeding up.");
  }

  if (event.code == "KeyE") {
    eKey = false;
    console.log("Asteroids are no longer slowing down.");
  }

  if (event.code == "KeyW") {
    wKey = false;
    console.log("Time is no longer accelerating.");
  }

  if (event.code == "KeyS") {
    sKey = false;
    console.log("Time is no longer deccelerating.");
  }
}

function drawScene() {
  // Color instructions
  colorCurrentPressedControl();
  
  // Time Related
  timeVar++;

  if (timeVar % period == 0) {
    timeIndex++;
    if (timeIndex == timeOfDay.length) {
      timeIndex = 0;
    }
  }
  
  if (wKey && period > 25) {
    period--;
    timeEl.innerHTML = ((1/period)*50).toFixed(2);
  } else if (sKey && period < 200) {
    period++;
    timeEl.innerHTML = ((1/period)*50).toFixed(2);
  }

  // Draw the sky
  const grad = ctx.createLinearGradient(cnv.width/2, 0, cnv.width/2, cnv.height);
  grad.addColorStop(0, timeOfDay[timeIndex]["skyColor"][0]);
  grad.addColorStop(0.5, timeOfDay[timeIndex]["skyColor"][1]);
  grad.addColorStop(0.9, timeOfDay[timeIndex]["skyColor"][2]);
  
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,cnv.width, cnv.height);
  
  // Change titleEl color
  titleEl.style.color = timeOfDay[timeIndex]["skyColor"][0];

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

        if (accelerationTracker > -0.001) {
          accelerationTracker = 0;
        } else if (accelerationTracker > -4) {
          accelerationTracker += daccelerationTracker;
        }
        
      } 
      /* SPEED UP ASTEROIDS LEFT */
      else if (qKey) {
        if(asteroid["dAngle"] > -asteroid["dAngleUpperLimit"]){
          asteroid["dAngle"] -= asteroid["dAngleAdd"];
        }
        
        if (accelerationTracker > -3) {
          accelerationTracker -= daccelerationTracker;
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

        if (accelerationTracker > -1/6) {
          accelerationTracker -= daccelerationTracker;
        } else if (accelerationTracker < -1/6) {
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

        if (accelerationTracker < -1) {
          accelerationTracker += daccelerationTracker;
        } else if (accelerationTracker > -1) {
          accelerationTracker -= daccelerationTracker;
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

        if (accelerationTracker > 1) {
          accelerationTracker -= daccelerationTracker;
        } else if (accelerationTracker < 1) {
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
  
  
  // Background Hill 1
  ctx.fillStyle = "rgb(0, 65, 0)";
  ctx.beginPath();
  ctx.moveTo(630, 430);
  ctx.quadraticCurveTo(700, 360, 770, 430);
  ctx.fill();

  // Background Hill 2
  ctx.fillStyle = "rgb(0, 63, 0)";
  ctx.beginPath();
  ctx.moveTo(25, 440);
  ctx.quadraticCurveTo(100, 350, 175, 440);
  ctx.fill();

  // Background Hill 3
  ctx.fillStyle = "rgb(0, 114, 0)";
  ctx.beginPath();
  ctx.moveTo(-200, 500);
  ctx.quadraticCurveTo(0, 300, 200, 500);
  ctx.fill();

  // Background Hill 4
  ctx.fillStyle = "rgb(0, 83, 0)";
  ctx.beginPath();
  ctx.moveTo(400, 500);
  ctx.quadraticCurveTo(600, 280, 800, 500);
  ctx.fill();


  // Background Tree
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
  ctx.fillStyle = "rgb(0, 177, 0)";
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


function determineAndColorGivenControl(wantedElement, asteroidControl = true) {
  for (let key in controlElements) {
    // Only Color/Discolor if it's a control that affects asteroids
    if (asteroidControl) {
      for (let element in controlElements[key]["affectsAsteroids"]) {
        if (controlElements[key]["affectsAsteroids"][element] == eval(wantedElement)) {
          controlElements[key]["affectsAsteroids"][element].style.color = timeOfDay[timeIndex]["skyColor"][2];
        } else {
          controlElements[key]["affectsAsteroids"][element].style.color = "black";
        }
      }
    }

    // Only Color/Discolor if it's a control that affects time
    else {
      for (let element in controlElements[key]["affectsTime"]) {
        if (controlElements[key]["affectsTime"][element] == eval(wantedElement)) {
          controlElements[key]["affectsTime"][element].style.color = timeOfDay[timeIndex]["skyColor"][2];
        } else {
          controlElements[key]["affectsTime"][element].style.color = "black";
        }
      }
    }  
  }
}

function colorCurrentPressedControl() { 
  // If a key which affects asteroids is being pressed, color it
  if (leftKey || qKey || eKey) {
    if (qKey && eKey) {
      determineAndColorGivenControl(qKey_eKeyElement);
    }
    else if (!leftKey) {
        if (qKey) {
          determineAndColorGivenControl(qKeyElement);
        } else if (eKey) {
          determineAndColorGivenControl(eKeyElement);
        }
    }
    else if (leftKey) {
        if (qKey) {
          determineAndColorGivenControl(leftKey_qKeyElement);
        } else if (eKey) {
          determineAndColorGivenControl(leftKey_eKeyElement);
        } else {
          determineAndColorGivenControl(leftKeyElement);
        }
    }
  }
  // If no keys which affect asteroids are being pressed, default them all to black
  else if (!leftKey && !qKey && !eKey) {
    for (let key in controlElements) {
      for (let element in controlElements[key]["affectsAsteroids"]) {
        controlElements[key]["affectsAsteroids"][element].style.color = "black";
      }
    }
  } 
  
 // If a key which affects time is being pressed, color it
  if (wKey || sKey) {
    if (wKey) {
      determineAndColorGivenControl(wKeyElement, false);
    } else if (sKey) {
      determineAndColorGivenControl(sKeyElement, false);
    }
  }
  // If no keys which affect time are being pressed, default them all to black
  else if (!wKey && !sKey) {
    for (let key in controlElements) {
      for (let element in controlElements[key]["affectsTime"]) {
        controlElements[key]["affectsTime"][element].style.color = "black";
      }
    }
  }
}
