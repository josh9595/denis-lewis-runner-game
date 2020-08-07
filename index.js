var myGamePiece;
var track;
var myObstacles = [];
var myScore;
var animationCounter = 1;
var randomHurdle = randomHurdleDistance();
var paused = true;

function startGame() {
    track = new component(780, 300, "assets/Track.png", 0, 324, "image", false);
    myGamePiece = new component(200, 200, "assets/denise-start.png", 0, 400, "image", true);
    myGamePiece.gravity = 0;
    myScore = new component("30px", "Consolas", "black", 280, 40, "text", false);
    myGameArea.start();
    setInterval(
      function () {
        animateRun();
      }, 100
    );
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 760;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
          myGameArea.key = e.keyCode;
        });
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        });
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type, player) {
    this.type = type;
    if (type == "image") {
      this.image = new Image();
      this.image.src = color;
    }
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else if (type == "image") {
          ctx.drawImage(this.image, 
            this.x, 
            this.y,
            this.width, this.height); 
      } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        if(player) {
          this.hitBottom();
        }
    }

    this.hitBottom = function() {
      var rockbottom = myGameArea.canvas.height - 200 - this.height;
      if (this.y > rockbottom) {
          this.y = rockbottom;
          this.gravitySpeed = 0;
      }
    }

    this.crashWith = function(otherobj) {
        console.log(this.x, this.y, this.width, this.height)
        var myleft = this.x + 100;
        var myright = this.x + (this.width) - 50;
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width) - 40;
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}
 
function animateRun() {
  if (myGameArea.frameNo == 0) { return; }
  myGamePiece.image.src = "assets/denise-run-" + animationCounter + ".png";
  if (animationCounter == 6) {
    animationCounter = 1;
  } else {
    animationCounter++;
  }
}

function randomHurdleDistance() {
  return Math.floor(Math.random() * (400 - 200) + 200);
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            return;
        } 
    }
    myGameArea.clear();

    if (myGameArea.frameNo > 0) {
        if (myGameArea.key && myGameArea.key == 32){
        console.log("fly")
        accelerate(-1);
      } else {
        console.log("stay")
        accelerate(1);
      }
    } else {
      if (myGameArea.key && myGameArea.key == 32){
        myGameArea.frameNo = 1
      }
    }

    if (myGameArea.frameNo == 0) {
      track.newPos();
      track.update();
      myScore.text="SCORE: " + myGameArea.frameNo;
      myScore.update();
      myGamePiece.newPos();
      myGamePiece.update();
      return;
    }

    myGameArea.frameNo += 1;

    if (track.x > -300){
      track.x += -5;
    }
    track.newPos();
    track.update();

    if (myGameArea.frameNo == 1 || everyinterval(randomHurdle)) {
        x = myGameArea.canvas.width;
        y = myGameArea.canvas.height - 200;
        height = 80;
        myObstacles.push(new component(80, height, "assets/hurdle.png", x, y - height, "image"));
        randomHurdle += randomHurdleDistance();
        console.log(randomHurdle)
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -5;
        myObstacles[i].update();
    }

    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();

}

function everyinterval(n) {
    if (myGameArea.frameNo == n) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}