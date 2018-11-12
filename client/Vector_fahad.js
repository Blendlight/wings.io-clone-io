class Vec2d
{

    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }
    
    
    set(x=0, y=0)
    {
        this.x = x;
        this.y = y;
        return new Vec2d(this.x, this.y);
    }

    addVec(vec)
    {
        let tmp = new Vec2d(this.x, this.y);
        tmp.x += vec.x;
        tmp.y += vec.y;
        return tmp;
    }

    scale(v)
    {
        let tmp = new Vec2d(this.x, this.y);
        tmp.x *= v;
        tmp.y *= v;
        return tmp;
    }
    
    
    magnitude(){
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    
    normalize()
    {
        let tmp = new Vec2d(this.x, this.y);
        let mag = this.magnitude();
        
        tmp.x /= mag;
        tmp.y /= mag;
        
        return tmp;
        
    }

}



function random (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function radian2degrees (rad) {
    return rad * 180 / Math.PI;
}

function degrees2radian (deg) {
    return deg / 180 / Math.PI;
}

function lerp(x1, x2, amount)
{
    return  (1 - amount) * x1 + amount * x2;
}