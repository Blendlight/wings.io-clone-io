// Import libraries
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const chalk = require('chalk');
const Vec2d = require('./client/js/Vector2d');
const mPhysics = require('./client/js/mPhysics');

const WEPPONS = {
    SINGLE:'single',
    TRIPPLE:'tripple'
};

const totalWeppons =  Object.values(WEPPONS).length;

function Player(x=0, y=0, id, name='')
{
    this.position = new Vec2d(x, y);
    this.size = new Vec2d(100,40);
    this.r = this.size.x/2;
    this.id = id;
    this.direction = new Vec2d(1,0);
    this.velocity = new Vec2d(0,0);
    this.speed = 0;
    this.health = 100;
    this.name = name;
    this.canShoot = true;// yeah we can shoot
    this.shootTimer = 0;//timer used for shooting
    this.playing = false;
    //the player who shoot you 
    this.LastHitPlayer = null;
    this.score = 0;
}

function Bullet(x, y, xv,yv, life=100){
    this.position = new Vec2d(x,y);
    this.prevPosition = new Vec2d(x,y);
    this.velocity = new Vec2d(xv,yv);
    this.nextPosition = this.position.add(this.velocity);
    this.life = life;
    this.damage = 6;
    this.player = null;
    
    this.update = function(){
        this.prevPosition = this.position.clone();
        this.position = this.position.add(this.velocity);
        this.nextPosition = this.position.add(this.velocity);
        this.life -= 3;
    }
}


function update()
{
    gameTimer++;
    
    
    //update all players
    //<- currently updating players on client side ->
    //but we will check player to player collision here
    //and also health check
    for(id in players)
    {
        let player = players[id];
        if(!player.playing){
            continue;
        }
        if(player.health <= 1)
        {
            player.playing = false;
            io.emit('deletePlayer', player.id);
        }
    }
    /* 
    
    //player to player collision - due to some problems i have commented it
    
    for(let id in players){
        let player = players[id];
        for(let otherId in players)
        {
            if(id==otherId)
            {
                continue;
            }
            
            let otherPlayer = players[otherId];
            
            let circle1 = new  mPhysics.Circle(player.position, player.r);
            let circle2 = new mPhysics.Circle(otherPlayer.position, otherPlayer.r);
            
            if(mPhysics.circleCircleIntersect(circle1, circle2))
            {
                //sap
                let diff = player.position.subtract(otherPlayer.position);
                let dir = diff.unit();
                let dist = diff.length();
                let shak = diff.scale(.5);
                
                player.position = player.position.add(shak);
                player.direction = player.direction.add(diff.unit(2));
                player.velocity = player.velocity.add(shak.scale(.3));
                
                otherPlayer.position = otherPlayer.position.add(shak);
                otherPlayer.direction = otherPlayer.direction.add(diff.unit(-2));
                otherPlayer.velocity = otherPlayer.velocity.add(shak.scale(.3));
                
                
                player.health -= 10;
                otherPlayer.health -= 10;
                
            }
        }
    }
    */
    
    //update all bullets and check for collision hehe
    //<- update all bullets ->
    for(bid in bullets)
    {
        let bullet = bullets[bid];
        bullet.update();
        
        if(bullet.life <= .1)
        {
            delete bullets[bid];
            //done for this bullet
            continue;
        }
        
        
        
        for(id in players)
        {
            //don't check with self
            if(id == bullet.player)
            {
                continue;
            }
            
            let player = players[id];
            if(!player.playing){
                continue;
            }
            
            let circle = new mPhysics.Circle(player.position, player.r);
            let line = new mPhysics.Line(bullet.prevPosition, 
                bullet.position);
                
                let intersect = mPhysics.lineCircleIntersect(line, circle);
                if(intersect.intersect>=1 && bullet.damage > 0)
                {
                    //decreased player health
                    player.health -= bullet.damage;
                    
                    players[bullet.player].score += 100;
                    players[bullet.player].health = Math.min(100, players[bullet.player].health+2);
                    
                    console.log(players[bullet.player]);
                    
                    //delete bullet
                    //but we can use it for hit effect
                    //i will use trick to damage 
                    //if damage 0 then bullet is hit haha looking stupid
                    // bullets.splice(i, 1);
                    bullet.damage = 0;
                    bullet.velocity = bullet.velocity.invert().unit(5);
                    bullet.life = .2;
                    
                    // circle.draw(DRAW_METHODS.fill);
                }
                
            }
            
            
        }
    }
    
    function heartBeat()
    {
        let fplayers = {};
        for(id in players)
        {
            let player = players[id];
            if(player.playing == true)
            {
                
                if(!player.canShoot)
                {
                    if(gameTimer - player.shootTimer > shootTiming)
                    {
                        player.canShoot = true;
                    }
                }
                
                fplayers[id] = player;
            }
        }
        io.emit('heartBeat', {
            playersData:fplayers,
            bulletsData:bullets,
            sgameTimer:gameTimer
        });
    }
    
    
    //chalk functions
    let chalkWhiteRedBold = chalk.white.bgRed.bold;
    
    function random (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
    
    function radian2degrees (rad) {
        return rad * 180 / Math.PI;
    }
    
    function degrees2radian  (deg) {
        return deg / 180 / Math.PI;
    }
    
    function lerp (x1, x2, amount)
    {
        return  (1 - amount) * x1 + amount * x2;
    }
    
    
    //*****define constants
    //port
    const port = 3000;
    
    // create server to use express app
    const app = express();
    const clientPath = __dirname+'/client/';
    app.use(express.static(clientPath));
    const server = http.createServer(app);
    
    
    // game variabels etc
    
    let players = {};
    let bullets = {};
    let mouses = [];
    
    //id for bulletes
    let bulletId = 0;
    
    let room = new Vec2d(5000, 5000);
    
    let defaultRadius = 20;
    
    // socketio start
    let io = socketio(server);
    
    let gameTimer = 0;
    
    //time for shooting bullet
    //this is not actual time 
    //depends on frames/persecond or gameTimer
    let shootTiming = 3;
    
    //heartbeat event
    
    setInterval(()=>{
        update();
        heartBeat();
    }, 1000/30);
    
    
    io.on('connect', (socket)=>{
        socket.player = new Player(
            random(0,room.x),
            random(0, room.y),
            socket.id,
            ''
            );
            
            socket.player.playing = false;
            
            players[socket.id] = socket.player;
            
            console.log(chalk.green("Player connected"));
            // console.log(socket.player);
            socket.emit("connectSuccess", {
                playerInfo:socket.player,
                roomInfo:room
            });
            
            socket.on('shoot', (data)=>{
                if(socket.player.canShoot)
                {
                    //update shoot timer
                    socket.player.shootTimer = gameTimer;
                    //set can shoot to false
                    socket.player.canShoot = false;
                    if(socket.player.weppon == WEPPONS.SINGLE){
                        console.log("shooting single");
                        let speed = 100;
                        let velocity = socket.player.direction.scale(speed);
                        let r = socket.player.size.x/2+4;
                        let x = socket.player.position.x;
                        let y = socket.player.position.y;
                        let dir = socket.player.direction.direction();
                        
                        x += Math.cos(dir)*r;
                        y += Math.sin(dir)*r;
                        
                        let bullet = new Bullet(x,y, velocity.x, velocity.y);
                        let bid = ++bulletId;
                        
                        bullet.player = socket.player.id;
                        
                        //add new bullet to list
                        bullets['bullet-'+bid] = bullet; 
                    }else{
                        console.log("shooting tripple");
                        
                        let speed = 100;
                        let velocity = socket.player.direction.scale(speed);
                        let r = socket.player.size.x/2+4;
                        let x = socket.player.position.x;
                        let y = socket.player.position.y;
                        let dir = socket.player.direction.direction();
                        let dist = 30;
                        
                        x += Math.cos(dir)*r;
                        y += Math.sin(dir)*r;
                        
                        let bullet = new Bullet(x,y, velocity.x, velocity.y);
                        let bid = ++bulletId;
                        
                        bullet.player = socket.player.id;
                        
                        //add new bullet to list
                        bullets['bullet-'+bid] = bullet; 
                        
                        
                        velocity = Vec2d.fromAngle(socket.player.direction.direction()+degrees2radian(dist)).scale(speed);
                        r = socket.player.size.x/2+4;
                        x = socket.player.position.x;
                        y = socket.player.position.y;
                        dir = socket.player.direction.direction();
                        
                        x += Math.cos(dir)*r;
                        y += Math.sin(dir)*r;
                        
                        bullet = new Bullet(x,y, velocity.x, velocity.y);
                        bid = ++bulletId;
                        
                        bullet.player = socket.player.id;
                        
                        //add new bullet to list
                        bullets['bullet-'+bid] = bullet; 
                        
                        
                        
                        velocity = Vec2d.fromAngle(socket.player.direction.direction()-degrees2radian(dist)).scale(speed);
                        r = socket.player.size.x/2+4;
                        x = socket.player.position.x;
                        y = socket.player.position.y;
                        dir = socket.player.direction.direction();
                        
                        x += Math.cos(dir)*r;
                        y += Math.sin(dir)*r;
                        
                        bullet = new Bullet(x,y, velocity.x, velocity.y);
                        bid = ++bulletId;
                        
                        bullet.player = socket.player.id;
                        
                        //add new bullet to list
                        bullets['bullet-'+bid] = bullet; 
                        
                        
                        
                    }
                }
            });
            
            socket.on('play', (name)=>{
                //set player data
                socket.player.name = name;
                socket.player.playing = true;
                socket.player.health = 100;
                
                socket.player.weppon = Object.values(WEPPONS)[random(0, totalWeppons-1)];
                if(socket.player.weppon == undefined)
                {
                    socket.player.weppon = WEPPONS.SINGLE;
                }
                // socket.player.score = 0;
                socket.player.position.set(
                    random(0, room.x),
                    random(0, room.y)
                    );
                    socket.player.velocity.set(0,0);
                    // console.log(socket.id+' set name to '+name);
                    socket.emit('start', {
                        sgameTimer:gameTimer,
                        socketPlayer:socket.player
                    });
                });
                
                socket.on('updateMe', (player)=>{
                    // console.log(player);
                    // let updateData = {
                    //     position:player.position,
                    //     direction:player.direction,
                    //     velocity:player.velocity,
                    //     speed:player.speed
                    // };
                    socket.player.position  = Vec2d.fromObject(player.position);
                    socket.player.direction = Vec2d.fromObject(player.direction);
                    socket.player.velocity  = Vec2d.fromObject(player.velocity);
                    socket.player.speed     = player.speed;
                    
                    
                });
                
                socket.on('disconnect',()=>{
                    io.emit('deletePlayer', socket.id);
                    delete players[socket.id];
                    console.log(players);
                });
                
                /* 
                io.emit('playersData', players);
                
                socket.on('updateMe', ({x, y})=>{
                    socket.player.x = x;
                    socket.player.y = y;
                });
                
                socket.on('reset', ()=>{
                    players = [];
                    console.log(chalkWhiteRedBold.bgGreen('\nServer reseted\n'));
                });
                */
                
            });
            
            
            
            
            
            
            
            //start server to listen on port
            server.listen(port, ()=>{
                console.log(`    ${chalkWhiteRedBold(
                    `                           
                    Server started on localhost:${port}    `)}    
                    ${chalkWhiteRedBold("                           ")}`);
                });
                