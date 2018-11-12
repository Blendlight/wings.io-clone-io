let socket = io();

let canvas = document.querySelector("#game canvas");
let ctx = canvas.getContext('2d');
let canvasOverlay = document.getElementById("overlay");
let overlayMessage = document.getElementById("overlayMessage");
let startForm = document.getElementById("startForm");

let playing  = false;


if(localStorage.getItem('username'))
{
    document.getElementById('name').value  = localStorage.getItem('username');
}


startForm.addEventListener('submit', function(evt){
    evt.preventDefault();
    canvasOverlay.classList.add('active');
    name = document.getElementById('name').value;
    localStorage.setItem('username', name)
    socket.emit('play', name);
    canvasOverlay.classList.remove('active');
});















let width = canvas.width = 480;
let height = canvas.height = width*3/4;
let name = '';

let room = new Vec2d(5000, 5000);
/* let viewPort = {
    position:new Vec2d(0,0),
    widthHeight:new Vec2d(width, height)
}; */
let viewPort = new Vec2d(0,0);

let mouse = new Vec2d(10, 10);
let mouseTarget = new Vec2d(10, 10);

let mouse_clicked = false;

let zeroVec = new Vec2d(0,0);

let players = {};

let DefaultRadius = 20;

let scaleFact = .6;

let bullets = [];

let gameTimer = 0;

let socketTimer = 0;

let canShoot = true;





// for(i=0;i<10;i++){
//     let p =  new Player(random(0, room.x),random(0, room.y),DefaultRadius) ;
//     // p.velocity = new Vec2d(10,10);
//     players.push(p);
// }


let player = null;
socket.on('connectSuccess', ({playerInfo, roomInfo})=>{
    player = new Player(playerInfo.position.x, playerInfo.position.y, playerInfo.r);
    player.id = socket.id;
    player.mainPlayer = true;
    
    room.set(roomInfo.x, roomInfo.y);
});

socket.on('heartBeat', ({playersData, sgameTimer})=>{
    //list of valid players if we don't receive info for old player we will delete his data
    socketTimer = sgameTimer;
    for(id in playersData)
    {
        let socketPlayer = playersData[id];
        if(id == player.id)
        {
            //we only need to update health here
            
            continue;
        }
        
        
        //update data
        /* 
        direction: {x: 1, y: 0}
        health: 100
        id: "OD9-fVf7z7YyI878AAAC"
        name: "Moinkd"
        playing: true
        position: {x: 1093, y: 694}
        r: 50
        size: {x: 100, y: 40}
        speed: 0
        velocity: {x: 0, y: 0}
        */
        
        //if we don't have player in list
        //we add him
        //else
        //update his position
        let newPlayer = null;
        if(!players[id])
        {
            //new player
            newPlayer = new Player();

            //add players list
            players[id] = newPlayer;
            console.log("New player", newPlayer);
        }else{ //if we have that player update
            newPlayer = players[id];
        }

        newPlayer.position  = Vec2d.fromObject(socketPlayer.position);
        newPlayer.direction = Vec2d.fromObject(socketPlayer.direction);
        newPlayer.velocity  = Vec2d.fromObject(socketPlayer.velocity);
        newPlayer.health    = socketPlayer.health;
        newPlayer.speed     = socketPlayer.speed;
        newPlayer.id        = socketPlayer.id;
        newPlayer.name      = socketPlayer.name;
    }
    
});

socket.on('deletePlayer', (id)=>{
    console.log('socket said delete '+id);
    if(players[id])
    {
        delete players[id];
    }
});

socket.on('start', ({sgameTimer})=>{
    socketTimer = sgameTimer;
    gameTimer = sgameTimer;
    start();
});

socket.on('stop', (v)=>{
    console.log('scoket said stop');
    startPage();
})


let minSpeedR = 100;

let gameLoop = null;



/////////////////

canvasOverlay.classList.add('active');
overlayMessage.innerHTML += '<h1>Loading Resources</h1>';


//load resources
sprites_load({
    ship:'img/ship.png',
    bg:'img/bg.png',
    tile:'img/tile.png'
});
resources.onReady(resourceReady);

function resourceReady(){
    overlayMessage.innerHTML = "Resources loaded";
    startPage();
}


function startPage(){
    canvasOverlay.classList.add('active');
    stopLoop();
}












//////////////////////








let bgTile = {};



function start()
{
    
    bgTile = {
        img:sprite_get('bg'),
        width:400,
        height:400,
        distance:10
    };
    
    startLoop();
    playing = true;
}

function startLoop(){
    gameLoop = setInterval(calling,1000/30);
}

function stopLoop(){
    if(gameLoop)
    {
        clearInterval(gameLoop);
        gameLoop = null;
    }
}

function update()
{
    player.name = name;
    gameTimer++;

    if(Math.abs(gameTimer-socketTimer) >= 3)
    {
        return;
    }

    gameTimer = socketTimer;


    if(player.velocity.length()<=5)
    {
        player.position.y += Math.sin(gameTimer/10)*5;
    }
    
    if(!canShoot){
        if(gameTimer-timer >= 5)
        {
            canShoot = true;
        }
    }
    
    if(mouse_clicked && canShoot)
    {
        timer = gameTimer;
        canShoot = false;
        let speed = 50;
        let velocity = player.direction.scale(speed);
        let r = player.size.x/2+4;
        let x = player.position.x;
        let y = player.position.y;
        let dir = player.direction.direction();
        
        x += Math.cos(dir)*r;
        y += Math.sin(dir)*r;
        
        bullets.push(
            new Bullet(x,y, velocity.x, velocity.y)
            );
            
        }
        
        let tx = width/2-player.position.x;
        let ty = height/2-player.position.y;
        
        if(false){
            viewPort.x = lerp(viewPort.x, tx, 1/10);
            viewPort.y = lerp(viewPort.y, ty, 1/10);
        }else{
            viewPort.x = tx;
            viewPort.y = ty;
        }
        
        mouse.set(mouseTarget.x - viewPort.x  , mouseTarget.y - viewPort.y);
        
        player.update();

        for(let id in players)
        {
            let otherPlayer = players[id];
            otherPlayer.update();
        }

        /*  
        for(let otherPlayer of players)
        {
            otherPlayer.update();
            let circle1 = new Circle(player.position, player.r);
            let circle2 = new Circle(otherPlayer.position, otherPlayer.r);
            
            if(circleCircleIntersect(circle1, circle2))
            {
                //sap
                let diff = player.position.subtract(otherPlayer.position);
                let dir = diff.unit();
                let dist = diff.length();
                let shak = diff.scale(.5);
                
                player.position = player.position.add(shak);
                player.direction = player.direction.add(diff.unit(2));
                player.velocity = player.velocity.add(shak.scale(.3));
                
                otherPlayer.position = otherPlayer.position.subtract(shak);
                otherPlayer.direction = otherPlayer.direction.add(diff.unit(2));
                otherPlayer.velocity = otherPlayer.velocity.subtract(shak);
                
                player.health -= 20;
                otherPlayer.health -= 20;
                
            }
            
            if(otherPlayer.health<=0){
                players.splice(players.indexOf(otherPlayer), 1);
            }
            
            
        }
        */
        /* for(let i=0;i<bullets.length;i++)
        {
            let bullet = bullets[i];
            bullet.update();
            if(bullet.life <= 1)
            {
                bullets.splice(i,1);
                continue;
            }
            
            //check for collision with other players
            
            for(let j=0;j<players.length;j++)
            {
                let otherPlayer = players[j];
                
                let circle = new Circle(otherPlayer.position, otherPlayer.r);
                let line = new Line(bullet.prevPosition, 
                    bullet.position);
                    // line.draw();
                    
                    let intersect = lineCircleIntersect(line, circle);
                    if(intersect.intersect>=1 && bullet.damage > 0)
                    {
                        //decreased player health
                        otherPlayer.health -= bullet.damage;
                        
                        //delete bullet
                        //but we can use it for hit effect
                        //i will use trick to damage 
                        //if damage 0 then bullet is hit haha looking stupid
                        // bullets.splice(i, 1);
                        bullet.damage = 0;
                        bullet.velocity = bullet.velocity.invert().unit(5);
                        bullet.life = 1;
                        
                        // circle.draw(DRAW_METHODS.fill);
                    }
                    
                }
                
                
            }
            */ 
            
        } 
        
        function draw()
        {
            ctx.clearRect(0, 0, width, height);
            //save current state of canvas transform
            ctx.fillStyle = 'orange';
            ctx.font = "20px sans-serif";
            ctx.fillText(gameTimer,10,20);
            
            
            let paralaxFactor = 1/bgTile.distance;
            let xoffset = viewPort.x*paralaxFactor;
            let yoffset = viewPort.y*paralaxFactor;
            for(let i = -bgTile.width;i<width+bgTile.width;i+=bgTile.width)
            {
                for(let j=-bgTile.height;j<height+bgTile.height;j+=bgTile.height)
                {
                    
                    let x = i+xoffset%bgTile.width;
                    let y = j+yoffset%bgTile.height;
                    ctx.drawImage(bgTile.img, x, y, bgTile.width, bgTile.height);
                }
            }
            
            
            
            /* 
            if(player.position.x < width/2)
            {
                tx = 0;
            }
            if(player.position.y < height/2)
            {
                ty = 0;
            }
            */
            
            ctx.save();
            ctx.scale(scaleFact, scaleFact);
            ctx.translate(viewPort.x+(width-width*scaleFact), viewPort.y+(height-height*scaleFact));
            
            
            
            
            ctx.strokeStyle = 'red';
            ctx.strokeRect(0,0,room.x, room.y);
            
            
            
            
            player.draw();
            
            ctx.strokeStyle = 'black';
            draw_circle(player.position.x, player.position.y, minSpeedR, DRAW_METHODS.stroke);
            
            for(otherId in players)
            {
                let otherPlayer = players[otherId];
                otherPlayer.draw();
            }
            
            
            draw_circle(mouse.x, mouse.y, 5);
            
            for(bullet of bullets)
            {
                bullet.draw();
            }
            
            ctx.restore();
        }
        
        function calling()
        {
            update();
            
            /* this.position = new Vec2d(x, y);
            this.size = new Vec2d(100,40);
            this.r = this.size.x/2;
            this.id = id;
            this.direction = new Vec2d(1,0);
            this.velocity = new Vec2d(0,0);
            this.speed = 0;
            this.health = 100;
            this.name = name; */
            
            let updateData = {
                position:player.position,
                direction:player.direction,
                velocity:player.velocity,
                speed:player.speed
            };
            
            socket.emit('updateMe', updateData);
            
            
            draw();
        }
        
        
        // Other events
        
        window.onmousedown = function(evt){
            mouse_clicked = true;
            
            
            
        }
        
        window.onmouseup = function(evt){
            mouse_clicked = false;
        }
        
        window.onmousemove = function(evt)
        {
            // mouseTarget.set(evt.clientX, evt.clientY);
            //comment this to see effect
            // mouse.set(evt.clientX, evt.clientY);
            mouseTarget.set(
                evt.clientX/scaleFact - (width-width*scaleFact) /* - viewPort.x */,
                evt.clientY/scaleFact - (height-height*scaleFact) /* - viewPort.y */
                );
            }
            
            