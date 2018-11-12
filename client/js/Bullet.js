const bulletRadius = 5;

function Bullet(x, y, xv,yv, life=100){
    this.position = new Vec2d(x,y);
    this.prevPosition = new Vec2d(x,y);
    this.velocity = new Vec2d(xv,yv);
    this.nextPosition = this.position.add(this.velocity);
    this.life = life;
    this.damage = 6.8;
    
    this.update = function(){
        this.prevPosition = this.position.clone();
        this.position = this.position.add(this.velocity);
        this.nextPosition = this.position.add(this.velocity);
        this.life *= .9;
    }
    
    this.draw = function(){
        if(this.damage>0){
            ctx.fillStyle = 'gray';
            draw_circle(this.position.x, this.position.y, bulletRadius);
        }else{
            ctx.fillStyle = 'orange';
            ctx.strokeStyle = 'orange';
            ctx.lineWidth = 4;
            let p2 = this.position.subtract(this.velocity.unit(20));
            let p3 = p2.clone();
            p3.x += 50;
            p3.y -= 3;
            draw_line(this.position.x, this.position.y, p2.x, p2.y);
            // draw_circle(this.position.x, this.position.y, bulletRadius);
        }
    }
    
}
