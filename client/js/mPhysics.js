if(typeof module != 'undefined')
{
    Vec2d  = require('./Vector2d');
    // console.log("======================");
    // vec2d = vec2dModule.Vec2d ;
    // console.log(typeof vec2dModule.Vec2d);
}


function Circle(position=new Vec2d(0,0),r=1)
{
    this.position = position;
    this.r  = r;
    
    this.draw = function(method=DRAW_METHODS.stroke){
        draw_circle(this.position.x, this.position.y, this.r, method);
    }
    
    
}

function Line(p1=new Vec2d(0,0), p2 = new Vec2d(0,0))
{
    this.p1 = p1;
    this.p2 = p2;
    
    this.draw = function(){
        draw_line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    }
}

function lineCircleIntersect(line, circle){
    var intersectionPoint = new Vec2d(0,0);
    var normal = new Vec2d(0,0);
    
    let n1 = null;
    let n2 = null;
    let p1 = null;
    let p2 = null;
    let intersect = false;
    
    var from = line.p1,
    to = line.p2,
    r = circle.r;
    
    var position = circle.position;
    
    
    var a = Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2);
    var b = 2 * ((to.x - from.x) * (from.x - position.x) + (to.y - from.y) * (from.y - position.y));
    var c = Math.pow(from.x - position.x, 2) + Math.pow(from.y - position.y, 2) - Math.pow(r, 2);
    var delta = Math.pow(b, 2) - 4 * a * c;
    
    
    if (delta === 0) {
        // single intersection point
        
        // vec2.lerp(intersectionPoint, from, to, delta);
        intersectionPoint = from.lerp(to, delta);
        
        // vec2.sub(normal, intersectionPoint, position);
        normal = intersectionPoint.subtract(position);
        // vec2.normalize(normal, normal);
        normal = normal.unit();
        
        //export
        p1 = intersectionPoint;
        p2 = null;
        n1 = normal;
        intersect = 1;
        
    } else {
        
        var sqrtDelta = Math.sqrt(delta);
        var inv2a = 1 / (2 * a);
        var d1 = (-b - sqrtDelta) * inv2a;
        var d2 = (-b + sqrtDelta) * inv2a;
        
        
        if (d1 >= 0 && d1 <= 1) {
            // vec2.lerp(intersectionPoint, from, to, d1);
            intersectionPoint = from.lerp(to, delta);
            // vec2.sub(normal, intersectionPoint, position);
            normal = intersectionPoint.subtract(position);
            // vec2.normalize(normal, normal);
            normal = normal.unit();
            
            //export
            p1 = intersectionPoint;
            n1 = normal;
            intersect++;
        }
        
        
        if (d2 >= 0 && d2 <= 1) {
            // vec2.lerp(intersectionPoint, from, to, d2);
            intersectionPoint = from.lerp(to, d2);
            // vec2.sub(normal, intersectionPoint, position);
            normal = intersectionPoint.subtract(position);
            // vec2.normalize(normal, normal);
            normal = normal.unit();
            
            //export
            p2 = intersectionPoint;
            n2 = normal;
            intersect++;
        }
        
    }
    
    return {
        p1,
        p2,
        n1,
        n2,
        intersect
    };
    
}

function circleCircleIntersect(c1, c2)
{
    let p1 = c1.position;
    let r1 = c1.r;
    let p2 = c2.position;
    let r2 = c2.r;
    let dist = p1.subtract(p2).length();
    let sumRad = r1+r2;
    return sumRad>=dist;
}

if(typeof module != 'undefined')
{
    module.exports = {
        Circle,
        Line,
        lineCircleIntersect,
        circleCircleIntersect
    };
}