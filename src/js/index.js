import "../css/style.css";
import { DateTime, Interval } from "luxon";

const countdownDOM = document.getElementById("countdown")
const quoteDOM = document.getElementById("quotes")

const quotes = [
    '“The trouble is, you think you have time” Buddha',
    '“If you love life, don’t waste time, for time is what life is made up of” Bruce Lee',
    '“Time is an illusion” Albert Einstein',
    '“Time is a created thing. To say \'I don\'t have time,\' is like saying, \'I don\'t want to” Lao Tzu',
    '“Time takes it all, whether you want it to or not” Stephen King',
]

var now = DateTime.local()

var target = DateTime.fromISO("2020-01-01T00:00:01")

var interval = Interval.fromDateTimes(now, target)

var counter = 0

countdownDOM.innerText = interval.toDuration(['hours', 'minutes', 'seconds']).toFormat("hh : mm : ss")
quoteDOM.innerText = quotes[Math.floor(Math.random()*quotes.length)]

var refreshCountdown = setInterval(function(){
    now = DateTime.local()

    interval = Interval.fromDateTimes(now, target)

    countdownDOM.innerText = interval.toDuration(['hours', 'minutes', 'seconds']).toFormat("hh : mm : ss")

    counter++

    if (counter == 20) {
        quoteDOM.innerText = quotes[Math.floor(Math.random()*quotes.length)]
        counter = 0
    }

    if (interval.count("seconds") == 0) {
        target.plus({hours: 1})
    }

},200)

window.human = false;

var canvasEl = document.querySelector('.fireworks');
var ctx = canvasEl.getContext('2d');
var numberOfParticules = 30;
var pointerX = 0;
var pointerY = 0;
var tap = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? 'touchstart' : 'mousedown';
var colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];

function setCanvasSize() {
    canvasEl.width = window.innerWidth * 2;
    canvasEl.height = window.innerHeight * 2;
    canvasEl.style.width = window.innerWidth + 'px';
    canvasEl.style.height = window.innerHeight + 'px';
    canvasEl.getContext('2d').scale(2, 2);
  }

function updateCoords(e) {
  pointerX = e.clientX || e.touches[0].clientX;
  pointerY = e.clientY || e.touches[0].clientY;
}

function setParticuleDirection(p) {
  var angle = anime.random(0, 360) * Math.PI / 180;
  var value = anime.random(50, 180);
  var radius = [-1, 1][anime.random(0, 1)] * value;
  return {
    x: p.x + radius * Math.cos(angle),
    y: p.y + radius * Math.sin(angle)
  }
}

function createParticule(x,y) {
  var p = {};
  p.x = x;
  p.y = y;
  p.color = colors[anime.random(0, colors.length - 1)];
  p.radius = anime.random(16, 32);
  p.endPos = setParticuleDirection(p);
  p.draw = function() {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
    ctx.fillStyle = p.color;
    ctx.fill();
  }
  return p;
}

function createCircle(x,y) {
  var p = {};
  p.x = x;
  p.y = y;
  p.color = '#FFF';
  p.radius = 0.1;
  p.alpha = .5;
  p.lineWidth = 6;
  p.draw = function() {
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
    ctx.lineWidth = p.lineWidth;
    ctx.strokeStyle = p.color;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  return p;
}

function renderParticule(anim) {
  for (var i = 0; i < anim.animatables.length; i++) {
    anim.animatables[i].target.draw();
  }
}

function animateParticules(x, y) {
  var circle = createCircle(x, y);
  var particules = [];
  for (var i = 0; i < numberOfParticules; i++) {
    particules.push(createParticule(x, y));
  }
  anime.timeline().add({
    targets: particules,
    x: function(p) { return p.endPos.x; },
    y: function(p) { return p.endPos.y; },
    radius: 0.1,
    duration: anime.random(1200, 1800),
    easing: 'easeOutExpo',
    update: renderParticule
  })
    .add({
    targets: circle,
    radius: anime.random(80, 160),
    lineWidth: 0,
    alpha: {
      value: 0,
      easing: 'linear',
      duration: anime.random(600, 800),  
    },
    duration: anime.random(1200, 1800),
    easing: 'easeOutExpo',
    update: renderParticule,
    offset: 0
  });
}

var render = anime({
  duration: Infinity,
  update: function() {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  }
});

document.addEventListener(tap, function(e) {
//   window.human = true;
  render.play();
  updateCoords(e);
  animateParticules(pointerX, pointerY);
}, false);

var centerX = window.innerWidth / 2;
var centerY = window.innerHeight / 2;

function autoClick() {
  if (window.human) return;
  
  let n = Math.floor(Math.random()*5)
  for (let index = 0; index < n-1; index++) {
    animateParticules(
        anime.random(centerX-300, centerX+300), 
        anime.random(centerY-300, centerY+300)
    );
    anime({duration: 1000})
  }
  animateParticules(
    anime.random(centerX-300, centerX+300), 
    anime.random(centerY-300, centerY+300)
  );
  anime({duration: 1000}).finished.then(autoClick);
}

autoClick();
setCanvasSize();
window.addEventListener('resize', setCanvasSize, false);