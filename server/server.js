// Import libraries
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const chalk = require('chalk');
const Vec2d = require('../client/js/Vector2d');
const mPhysics = require('../client/js/mPhysics');

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
}

function Bullet(x, y, xv,yv, life=100){
    this.position = new Vec2d(x,y);
    this.prevPosition = new Vec2d(x,y);
    this.velocity = new Vec2d(xv,yv);
    this.nextPosition = this.position.add(this.velocity);
    this.life = life;
    this.damage = 6.8;
    this.player = null;
    
    this.update = function(){
        this.prevPosition = this.position.clone();
        this.position = this.position.add(this.velocity);
        this.nextPosition = this.position.add(this.velocity);
        this.life *= .9;
    }
}


//chalk functions
let chalkWhiteRedBold = chalk.white.bgRed.bold;

function random (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


//*****define constants
//port
const port = 3000;

// create server to use express app
const app = express();
const clientPath = __dirname+'/../client/';
app.use(express.static(clientPath));
const server = http.createServer(app);


// game variabels etc

let players = {};
let bullets = [];
let mouses = [];

let room = new Vec2d(1500, 1500);

let defaultRadius = 20;

// socketio start
let io = socketio(server);

let gameTimer = 0;

//heartbeat event
if(true){
    setInterval(()=>{
        gameTimer++;
        let fplayers = {};
        for(id in players)
        {
            let player = players[id];
            if(player.playing == true)
            {
                fplayers[id] = player;
            }
        }
        io.emit('heartBeat', {
            playersData:fplayers,
            sgameTimer:gameTimer
        });
    }, 1000/30);
}

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
        
        socket.on('play', (name)=>{
            socket.player.name = name;
            socket.player.playing = true;
            // console.log(socket.id+' set name to '+name);
            socket.emit('start', {
                sgameTimer:gameTimer
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
            socket.player.position  = player.position;
            socket.player.direction = player.direction;
            socket.player.velocity  = player.velocity;
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
        