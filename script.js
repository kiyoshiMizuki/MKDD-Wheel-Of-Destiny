const DEFAULT_DIAMETER = 600;
const tracks = [
  {color:"#399f26", label:"lc",  name:"Luigi Circuit"},
  {color:"#ff8ea1", label:"pb",  name:"Peach Beach"},
  {color:"#09a6f7", label:"bp",  name:"Baby Park"},
  {color:"#f5ac18", label:"ddd", name:"Dry Dry Desert"},
  {color:"#63cf4c", label:"mb",  name:"Mushroom Bridge"},
  {color:"#c61010", label:"mac", name:"Mario Circuit"},
  {color:"#f7ae20", label:"dc",  name:"Daisy Cruiser"},
  {color:"#5f1ca6", label:"ws",  name:"Waluigi Stadium"},
  {color:"#a8e1f7", label:"sl",  name:"Sherbet Land"},
  {color:"#342572", label:"muc", name:"Mushroom City"},
  {color:"#22661b", label:"yc",  name:"Yoshi Circuit"},
  {color:"#7a310f", label:"dkm", name:"DK Mountain"},
  {color:"#771e66", label:"wc",  name:"Wario Colosseum"},
  {color:"#5e82b1", label:"ddj", name:"Dino Dino Jungle"},
  {color:"#814526", label:"bc",  name:"Bowser's Castle"},
  {color:"#921627", label:"rr",  name:"Rainbow Road"}
];
let trackIcons = [];
let sectors = [];
let labels = [];
for (x in tracks) {
  trackIcons.push(document.getElementById(tracks[x].label));
  sectors.push(tracks[x]);
  labels.push(trackIcons[x]);
}
let imageScale = 0.5;
let spun = false;
let spinFrames = 0;
let flickerFrames = 0;
let iconToggle = false;

const rand = (m, M) => Math.random() * (M - m) + m;
const SPIN_BUTTON = document.querySelector("#spin");
const ctx = document.querySelector("#wheel").getContext('2d');
const wheelOutside = document.getElementById("wheel_outside");
const wheelInside = document.getElementById("wheel_inside");
const arrow = document.getElementById("arrow");
const trackOn = document.getElementById("trackOn");
const TAU = 2 * Math.PI;
const friction = 0.994;

let tot = sectors.length;
let arc = TAU / sectors.length;
let dia = ctx.canvas.width;
let rad = dia / 2;
let angVel = 0;
let ang = 0;

const getIndex = () => Math.floor(tot - ang / TAU * tot) % tot;

function drawSector(sector, i) {
  const ang = arc * i;
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, ang, ang + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();
  ctx.translate(rad, rad);
  ctx.rotate(ang + arc / 2);
  ctx.fillStyle = "#fff";
  ctx.scale(imageScale,imageScale); // scale track icon
  if (i != getIndex() || !iconToggle) {
    ctx.drawImage(labels[i], 330, -60); // track icon
  }
  ctx.restore();
};

function rotate() {
  const sector = sectors[getIndex()];
  ctx.canvas.style.transform = `rotate(${ang - Math.PI / 2}rad)`;
}

function zoom() { resize(dia + 2);}

function resetSize() { resize(DEFAULT_DIAMETER); }

function resetWheel() {
  sectors = [];
  labels = [];
  for (x in tracks) {
    sectors.push(tracks[x]);
    labels.push(trackIcons[x]);
  }
}

function resize(d) {
  ctx.canvas.width = d;
  ctx.canvas.height = d;
  dia = d;
  rad = d / 2;
  imageScale = ctx.canvas.width / (DEFAULT_DIAMETER * 2);
  const arrowSize = d / 7.5;
  arrow.style.width = arrowSize.toString() + "px";
  const middleSize = d * 0.283;
  const middleTop = 25 + rad - (middleSize / 2);
  wheelInside.style.width = middleSize.toString() + "px";
  wheelInside.style.top = middleTop.toString() + "px";
  draw();
}

function stop() {
  angVel = 0;
  spinFrames = 0;
  SPIN_BUTTON.textContent = "PROCEED";
  spun = true;
}

function remove() {
  if (tot == 2) {
    resetWheel();
  } else {
    sectors.splice(getIndex(),1);
    labels.splice(getIndex(),1);
  }
  tot = sectors.length;
  arc = TAU / sectors.length;
  iconToggle = false;
  resetSize();
}

function frame() {
  if (spun) {
    iconToggle = ++flickerFrames % 60 < 30;
    trackOn.textContent = sectors[getIndex()].name.toUpperCase();
    draw();
  } else {
    iconToggle = false;
    trackOn.textContent = "";
  }
  if (!angVel) return;
  angVel *= friction;
  if (angVel < 0.001) stop();
  ang += angVel;
  ang %= TAU;
  rotate();
  if (++spinFrames > 60 && spinFrames < 360) zoom();
}

function engine() {
  frame();
  requestAnimationFrame(engine)
}

function draw() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  sectors.forEach(drawSector);
  ctx.save();
  ctx.scale(imageScale, imageScale);
  ctx.drawImage(wheelOutside, 0, 0);
  ctx.restore();
}

rotate();
engine();
SPIN_BUTTON.addEventListener("click", () => {
  if (spun) {
    remove();
    SPIN_BUTTON.textContent = "SPIN";
    spun = false;
  } else if (!angVel) {
    angVel = rand(0.25, 0.35);
    SPIN_BUTTON.textContent = "SPINNING...";
  }
});
