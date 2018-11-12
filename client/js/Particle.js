function particle(x,y,r,xv=0,yv=0, fac=0.8)
{
    this.position = new Vec2d(x, y);
    this.velocity = new Vec2d(xv, yv);
    this.r = r;
    this.update = function(){
        this.position = this.position.add(this.velocity);
        this.r *= fac;
    }
    this.draw = function(){
        draw_circle(this.position.x, this.position.y, this.r, DRAW_METHODS.fill);
    }
}