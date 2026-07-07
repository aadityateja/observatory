//------------------------------------------------------
// XPLORIUM
//------------------------------------------------------

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

window.addEventListener("resize",resize);

resize();


//------------------------------------------------------
// Keyboard
//------------------------------------------------------

const keys = {};

window.addEventListener("keydown",e=>{

    keys[e.key]=true;

});

window.addEventListener("keyup",e=>{

    keys[e.key]=false;

});


//------------------------------------------------------
// Player
//------------------------------------------------------

const player={

    x:canvas.width/2,
    y:canvas.height-120,

    width:34,
    height:60,

    speed:7

};


//------------------------------------------------------
// Stars
//------------------------------------------------------

const stars=[];

for(let i=0;i<250;i++){

    stars.push({

        x:Math.random()*canvas.width,
        y:Math.random()*canvas.height,

        z:Math.random()*3+1

    });

}


//------------------------------------------------------
// Asteroids
//------------------------------------------------------

const asteroids=[];

let spawnTimer=0;


//------------------------------------------------------
// Distance
//------------------------------------------------------

let distance=0;

let best=localStorage.getItem("bestDistance") || 0;


//------------------------------------------------------
// Spawn Asteroid
//------------------------------------------------------

function spawnAsteroid(){

    asteroids.push({

        x:Math.random()*canvas.width,

        y:-100,

        radius:20+Math.random()*35,

        speed:4+Math.random()*5,

        rotation:Math.random()*6.28,

        spin:(Math.random()-0.5)*0.05

    });

}


//------------------------------------------------------
// Collision
//------------------------------------------------------

function collision(a){

    let dx=Math.abs(player.x-a.x);

    let dy=Math.abs(player.y-a.y);

    return dx<(player.width/2+a.radius*0.8)
        &&
        dy<(player.height/2+a.radius*0.8);

}


//------------------------------------------------------
// Update
//------------------------------------------------------

function update(){

    //--------------------------------
    // Player
    //--------------------------------

    if(keys["ArrowLeft"])
        player.x-=player.speed;

    if(keys["ArrowRight"])
        player.x+=player.speed;

    if(keys["ArrowUp"])
        player.y-=player.speed;

    if(keys["ArrowDown"])
        player.y+=player.speed;

    player.x=Math.max(player.width/2,
        Math.min(canvas.width-player.width/2,player.x));

    player.y=Math.max(player.height/2,
        Math.min(canvas.height-player.height/2,player.y));



    //--------------------------------
    // Stars
    //--------------------------------

    stars.forEach(s=>{

        s.y+=s.z*4;

        if(s.y>canvas.height){

            s.y=0;
            s.x=Math.random()*canvas.width;

        }

    });


    //--------------------------------
    // Asteroids
    //--------------------------------

    spawnTimer++;

    if(spawnTimer>30){

        spawnAsteroid();
        spawnTimer=0;

    }

    for(let i=asteroids.length-1;i>=0;i--){

        const a=asteroids[i];

        a.y+=a.speed;

        a.rotation+=a.spin;

        if(collision(a)){

            if(distance>best){

                best=Math.floor(distance);

                localStorage.setItem("bestDistance",best);

            }

            distance=0;

            asteroids.length=0;

            break;

        }

        if(a.y>canvas.height+100){

            asteroids.splice(i,1);

        }

    }

    distance+=0.5;

}

//------------------------------------------------------
// Draw Stars
//------------------------------------------------------

function drawStars(){

    stars.forEach(s=>{

        ctx.beginPath();

        ctx.fillStyle="white";

        ctx.arc(s.x,s.y,s.z,0,6.28);

        ctx.fill();

    });

}


//------------------------------------------------------
// Draw Ship
//------------------------------------------------------

function drawPlayer(){

    ctx.save();

    ctx.translate(player.x,player.y);

    // Engine glow
    ctx.shadowColor="#00FFFF";
    ctx.shadowBlur=20;

    ctx.fillStyle="#66DDFF";

    ctx.beginPath();

    ctx.moveTo(0,-35);

    ctx.lineTo(18,25);

    ctx.lineTo(0,12);

    ctx.lineTo(-18,25);

    ctx.closePath();

    ctx.fill();

    // Cockpit
    ctx.shadowBlur=0;

    ctx.fillStyle="white";

    ctx.beginPath();

    ctx.arc(0,-5,6,0,6.28);

    ctx.fill();

    ctx.restore();

}


//------------------------------------------------------
// Draw Asteroids
//------------------------------------------------------

function drawAsteroids(){

    asteroids.forEach(a=>{

        ctx.save();

        ctx.translate(a.x,a.y);

        ctx.rotate(a.rotation);

        ctx.fillStyle="#777";

        ctx.beginPath();

        for(let i=0;i<8;i++){

            const angle=i*Math.PI/4;

            const r=a.radius+(Math.random()*6-3);

            const x=Math.cos(angle)*r;
            const y=Math.sin(angle)*r;

            if(i===0)
                ctx.moveTo(x,y);
            else
                ctx.lineTo(x,y);

        }

        ctx.closePath();

        ctx.fill();

        ctx.restore();

    });

}


//------------------------------------------------------
// HUD
//------------------------------------------------------

function drawHUD(){

    ctx.fillStyle="white";

    ctx.font="22px Arial";

    ctx.fillText(
        "Distance : "+Math.floor(distance)+" m",
        20,
        40
    );

    ctx.fillText(
        "Best : "+best+" m",
        canvas.width-180,
        40
    );

}

//------------------------------------------------------
// Game Loop
//------------------------------------------------------

function loop(){

    update();

    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawStars();

    drawAsteroids();

    drawPlayer();

    drawHUD();

    requestAnimationFrame(loop);

}

loop();
