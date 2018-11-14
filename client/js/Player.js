


/**
*
*
* @param {number} [x=0]
* @param {number} [y=0]
* @param {number} [r=10]
* @param {string} [color='black']
* @param {*} [id=random(100,400)]
*/
function Player(x=0, y=0, id=random(100,400), name='')
{
    this.position = new Vec2d(x, y);
    this.size = new Vec2d(100,40);
    this.r = this.size.x/2;
    this.id = id;
    this.direction = new Vec2d(1,0);
    this.velocity = new Vec2d(0,0);
    this.speed = 0;
    this.particles = [];
    this.mainPlayer = false;
    this.health = 100;
    this.name = name;
    this.draw_sprite = true;
    this.score = 0;
    

    this.draw = function(){
        let tmp = ctx.fillStyle;//red
        ctx.fillStyle = this.color;//blue
        
        // Particles
        {
            // ============ Draw particles
            
            let pp = null;
            let tmpWidth = ctx.lineWidth;
            for(part of this.particles)
            {
                
                if(pp!=null)
                {
                    ctx.lineWidth = part.r;
                    draw_line(part.position.x, part.position.y, pp.position.x, pp.position.y);
                }else{
                    let last = this.particles[this.particles.length-1];
                    ctx.lineWidth = last.r;
                    draw_line(this.position.x, this.position.y, last.position.x, last.position.y);
                }
                pp = part;
            }
            ctx.lineWidth = tmpWidth;
            
            //====end of Draw paritcles
        }
        
        if(this.draw_sprite){
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate(this.direction.direction());
            let img = sprite_get('ship');
            let w = img.width;
            let h = img.height
            
            let ww  = this.size.x;
            let hh  = this.size.y;
            
            let hhh = ww * h/w;
            
            // ctx.fillRect(-ww/2,-hh/2, ww, hh);
            
            ctx.drawImage (
                img,
                -ww/2,
                -hhh/2,
                ww,
                hhh
                );
                
                ctx.restore();
            }
            
            
            
            
            if(!this.draw_sprite){
                // draw_circle(this.position.x, this.position.y, this.r);
                ctx.save();
                ctx.translate(this.position.x, this.position.y);
                ctx.rotate(this.direction.direction());
                let w = this.size.x;
                let h = this.size.y;
                let x = -w/2;
                let y= -h/2;
                
                //body
                ctx.fillRect(x+10, y, w-10, h);
                
                ctx.fillRect(x, y+2.5, w, h-5);
                
                //wings
                ctx.fillRect(x+5, y-5, 5, 10);
                ctx.fillRect(x+5, y+20-5, 5, 10);
                
                //nozzle
                ctx.beginPath();
                ctx.moveTo(w/2-1, y);
                ctx.lineTo(w, 0);
                ctx.lineTo(w/2-1, h/2);
                ctx.closePath();
                ctx.fill();
                
                //nozzle
                ctx.beginPath();
                ctx.moveTo(-10, -20);
                ctx.lineTo(w-10, 0);
                ctx.lineTo(-10, 20);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
            ctx.fillStyle = tmp;//red
            
            
            ctx.font = "30px sans-serif";
            ctx.fillStyle = 'black';
            draw_text(this.name||"<un-named>", this.position.x, this.position.y+this.r+20, 'center');
            
            //////--> draw_health bar
            let r = this.r;
            let rX2 = r*2;
            let x = this.position.x - r;
            let y = this.position.y - r- 20;
            let w = rX2;
            let h = 10;
            ctx.strokeRect(x, y, w, h);
            
            let red = 0,green=0,blue=0;
            
            green = 220*this.health/100;
            red = 255 - green - 30;
            
            ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
            ctx.fillRect(x, y, w*this.health/100, h);
            
            
            
            //////<-- draw_helath bar
            
            
            
        }
        
        this.update = function(){   
            {
                //slow down the velocity
                this.velocity = this.velocity.scale(.91);
                if(this.mainPlayer)
                {
                    
                    
                    //find the direction by differncing the mouse and player postion
                    let diff = mouse.subtract(this.position);
                    
                    //we need unit vector for changing direction because directon is also unit vector
                    let diff2 = diff.unit(1);
                    
                    //these 2 directions need for slowing down the velocity when steering
                    //speedy decresed by these direction diff
                    let dir1 = diff2.direction();
                    let dir2 = this.direction.direction();
                    
                    
                    // this.direction = this.direction.lerp(diff2,0.1).unit(1);
                    //change current direction to new direction but use lerp
                    this.direction = this.direction.lerp(diff2,
                        //this is random test formula ;-0
                        .2
                        ).unit(1);
                        // return;
                        
                        //this is variable used for speed of our player
                        //use diff not diff2
                        let speedy = diff.length();
                        
                        //decresed speed by direction diff 
                        //this will slow down player when sudenly chaning direction
                        //need some tweeks
                        // 90deg vs 100deg
                        // idk
                        //speedy /= Math.abs(dir2-dir1);//diff2.scale(200).length();
                        
                        //if mouse is outside of the circle minspeed
                        if(diff.length() > minSpeedR)
                        {
                            //we change our speed by speedy and some random value
                            //really i don't know physics behind this but it's work fine for me
                            // this.speed = lerp(this.speed, Math.min(speedy/(minSpeedR), 15), .1);
                            let nspeed = Math.min(speedy/20, 20);
                            
                            this.speed = lerp(this.speed, nspeed, .08);
                            
                            //deceress speed if changing direction is greater then 20
                            if(radian2degrees(Math.abs(dir1-dir2)) > 20)
                            {
                                this.speed *= .98;
                            }
                            
                            this.velocity = this.direction.scale(this.speed);
                            //this is for solving lerp problem
                            
                            
                            //change current velocity direction*speed;
                            // let moveVec = this.direction.scale(this.speed);
                            // this.velocity = this.velocity.lerp(moveVec, .11);
                        }
                        
                        // this.velocity = this.velocity.lerp(zeroVec, .1);
                        
                        
                        
                        
                        //skip above use below
                        if(false){
                            // if(mouse_clicked == true)
                            let diff = mouse.subtract(this.position);
                            let speed = Math.min(diff.length()/30, 10);
                            
                            if(diff.length() > minSpeedR-10)
                            {
                                moveVec = diff.unit(speed);//length 10;
                                // this.velocity.x += lerp(this.velocity.x, unitVect.x, .1);
                                // this.velocity.y += lerp(this.velocity.y, unitVect.y, .1);
                                this.velocity = this.velocity.lerp(moveVec, .1);
                                
                            }else{
                                this.velocity = this.velocity.lerp(zeroVec, .1)
                            }
                        }
                        //endof skip above use below
                        
                    }
                    //change direction
                    // this.direction = this.velocity.unit();
                    //change postion
                    this.position = this.position.add(this.velocity);
                    
                    if(this.velocity.length()>5)
                    {
                        if(this.particles.length<15)
                        {
                            this.particles.push(new particle(this.position.x, this.position.y, this.velocity.length()/2, -this.velocity.x, -this.velocity.y));
                        }
                    }

                    
                    
                    let newParticles = [];
                    for(part of this.particles)
                    {
                        part.update();
                        if(part.r>=.9)
                        {
                            newParticles.push(part);
                        }
                    }
                    this.particles = newParticles;
                } 
                
                if(this.position.x-this.r<0)
                {
                    this.position.x = this.r;
                }
                if(this.position.x+this.r > room.x)
                {
                    this.position.x = room.x-this.r;
                }
                
                if(this.position.y-this.r<0)
                {
                    this.position.y = this.r;
                }
                if(this.position.y+this.r > room.y)
                {
                    this.position.y = room.y-this.r;
                }
            }
            
        }