
const DRAW_METHODS = {
    fill:0,
    stroke:1,
    both:2
};

function draw_circle(x, y, r,method=DRAW_METHODS.fill)
{
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI);
    ctx.closePath();
    if(method == DRAW_METHODS.fill || method==DRAW_METHODS.both)
    {
        ctx.fill();
    }
    if(method == DRAW_METHODS.stroke || method==DRAW_METHODS.both){
        ctx.stroke();
    }
}

function draw_vector(x,y, vec)
{
    draw_line(x,y, x+vec.x, y+vec.y);
}

function draw_line(x1,y1,x2,y2)
{
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
}

function draw_text(text, x, y, align='start', method=DRAW_METHODS.fill)
{
    let tmp = ctx.textAlign;

    ctx.textAlign = align;
    if(method == DRAW_METHODS.fill || method == DRAW_METHODS.both)
    {
        ctx.fillText(text, x, y);
    }

    if(method == DRAW_METHODS.stroke || method == DRAW_METHODS.both)
    {
        ctx.strokeText(text, x, y);
    }

    ctx.textAlign = tmp;
}