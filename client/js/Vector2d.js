/**
* # Vec2d - A JavaScript 2D vector class with methods for common vector operations
*/

/**
* Constructor. Will also work without the `new` keyword
*
* ### Examples:
*     var vec1 = new Vec2d(100, 50);
*     var vec2 = Vec2d(42, 1337);
*
* @param {Number} x Value of the x axis
* @param {Number} y Value of the y axis
* @return {Vec2d}
* @api public
*/
function Vec2d (x, y) {
    if (!(this instanceof Vec2d)) {
        return new Vec2d(x, y);
    }
    
    /**
    * The X axis
    *
    * ### Examples:
    *     var vec = new Vec2d.fromArray(42, 21);
    *
    *     vec.x;
    *     // => 42
    *
    * @api public
    */
    this.x = x || 0;
    
    /**
    * The Y axis
    *
    * ### Examples:
    *     var vec = new Vec2d.fromArray(42, 21);
    *
    *     vec.y;
    *     // => 21
    *
    * @api public
    */
    this.y = y || 0;
};

/**
* # Static
*/

/**
* Creates a new instance from an array
*
* ### Examples:
*     var vec = Vec2d.fromArray([42, 21]);
*
*     vec.toString();
*     // => x:42, y:21
*
* @name Vec2d.fromArray
* @param {Array} array Array with the x and y values at index 0 and 1 respectively
* @return {Vec2d} The new instance
* @api public
*/
Vec2d.fromArray = function (arr) {
    return new Vec2d(arr[0] || 0, arr[1] || 0);
};

Vec2d.fromAngle = function (angle) {
    return new Vec2d(Math.cos(angle), Math.sin(angle));
};

/**
* Creates a new instance from an object
*
* ### Examples:
*     var vec = Vec2d.fromObject({ x: 42, y: 21 });
*
*     vec.toString();
*     // => x:42, y:21
*
* @name Vec2d.fromObject
* @param {Object} obj Object with the values for x and y
* @return {Vec2d} The new instance
* @api public
*/
Vec2d.fromObject = function (obj) {
    return new Vec2d(obj.x || 0, obj.y || 0);
};

/**
* # Manipulation
*
* These functions are chainable.
*/



/**
* Adds another vector to this one
*
* ### Examples:
*     var vec1 = new Vec2d(10, 10);
*     var vec2 = new Vec2d(20, 30);
*
*     vec1.add(vec2);
*     vec1.toString();
*     // => x:30, y:40
*
* @param {Vec2d} vector The other vector you want to add to this one
* @return {Vec2d} `this` for chaining capabilities
* @api public
*/
Vec2d.prototype.add = function (vec) {
    let tmp = new Vec2d(this.x, this.y);
    tmp.x += vec.x;
    tmp.y += vec.y;
    return tmp;
};


Vec2d.prototype.addVec = Vec2d.prototype.add;

Vec2d.prototype.set = function (x, y) {
    this.x = x;
    this.y = y;
    return new Vec2d(this.x, this.y);
};

/**
* Adds the given scalar to both vector axis
*
* ### Examples:
*     var vec = new Vec2d(1, 2);
*
*     vec.addScalar(2);
*     vec.toString();
*     // => x: 3, y: 4
*
* @param {Number} scalar The scalar to add
* @return {Vec2d} `this` for chaining capabilities
* @api public
*/
Vec2d.prototype.addScalar = function (scalar) {
    let tmp = new Vec2d(this.x, this.y);
    tmp.x += scalar;
    tmp.y += scalar;
    return tmp;
};




/**
* Subtracts another vector from this one
*
* ### Examples:
*     var vec1 = new Vec2d(100, 50);
*     var vec2 = new Vec2d(20, 30);
*
*     vec1.subtract(vec2);
*     vec1.toString();
*     // => x:80, y:20
*
* @param {Vec2d} vector The other vector you want subtract from this one
* @return {Vec2d} `this` for chaining capabilities
* @api public
*/
Vec2d.prototype.subtract = function (vec) {
    let tmp = new Vec2d(this.x, this.y);
    tmp.x -= vec.x;
    tmp.y -= vec.y;
    return tmp;
};

/**
* Subtracts the given scalar from both axis
*
* ### Examples:
*     var vec = new Vec2d(100, 200);
*
*     vec.subtractScalar(20);
*     vec.toString();
*     // => x: 80, y: 180
*
* @param {Number} scalar The scalar to subtract
* @return {Vec2d} `this` for chaining capabilities
* @api public
*/
Vec2d.prototype.subtractScalar = function (scalar) {
    let tmp = new Vec2d(this.x, this.y);
    tmp.x -= scalar;
    tmp.y -= scalar;
    return tmp;
};

/**
* Divides both vector axis by a axis values of given vector
*
* ### Examples:
*     var vec = new Vec2d(100, 50);
*     var vec2 = new Vec2d(2, 2);
*
*     vec.divide(vec2);
*     vec.toString();
*     // => x:50, y:25
*
* @param {Vec2d} vector The vector to divide by
* @return {Vec2d} `this` for chaining capabilities
* @api public
*/
Vec2d.prototype.divide = function (vector) {
    let tmp = new Vec2d(this.x, this.y);
    tmp.x /= vector.x;
    tmp.y /= vector.y;
    return tmp;
};

/**
* Divides both vector axis by the given scalar value
*
* ### Examples:
*     var vec = new Vec2d(100, 50);
*
*     vec.divideScalar(2);
*     vec.toString();
*     // => x:50, y:25
*
* @param {Number} The scalar to divide by
* @return {Vec2d} `this` for chaining capabilities
* @api public
*/
Vec2d.prototype.divideScalar = function (scalar) {
    let tmp = new Vec2d(this.x, this.y);
    if (scalar !== 0) {
        tmp.x /= scalar;
        tmp.y /= scalar;
    } else {
        tmp.x = 0;
        tmp.y = 0;
    }
    
    return tmp;
};

/**
* Inverts both axis
*
* ### Examples:
*     var vec = new Vec2d(100, 50);
*
*     vec.invert();
*     vec.toString();
*     // => x:-100, y:-50
*
* @return {Vec2d} `this` for chaining capabilities
* @api public
*/
Vec2d.prototype.invert = function () {
    let tmp = new Vec2d(this.x, this.y);
    tmp.x *= -1;
    tmp.y *= -1;
    return tmp;
};

/**
* Multiplies both vector axis by values from a given vector
*
* ### Examples:
*     var vec = new Vec2d(100, 50);
*     var vec2 = new Vec2d(2, 2);
*
*     vec.multiply(vec2);
*     vec.toString();
*     // => x:200, y:100
*
* @param {Vec2d} vector The vector to multiply by
* @return {Vec2d} `this` for chaining capabilities
* @api public
*/
Vec2d.prototype.multiply = function (vector) {
    let tmp = new Vec2d(this.x, this.y);
    tmp.x *= vector.x;
    tmp.y *= vector.y;
    return tmp;
};

/**
* Multiplies both vector axis by the given scalar value
*
* ### Examples:
*     var vec = new Vec2d(100, 50);
*
*     vec.multiplyScalar(2);
*     vec.toString();
*     // => x:200, y:100
*
* @param {Number} The scalar to multiply by
* @return {Vec2d} `this` for chaining capabilities
* @api public
*/
Vec2d.prototype.multiplyScalar = function (scalar) {
    let tmp = new Vec2d(this.x, this.y);
    tmp.x *= scalar;
    tmp.y *= scalar;
    return tmp;
};

Vec2d.prototype.scale = Vec2d.prototype.multiplyScalar;

/**
* Normalize
*
* @return {Vec2d} `this` for chaining capabilities
* @api public
*/
Vec2d.prototype.normalize = function (unit=1) {
    let tmp = new Vec2d(this.x, this.y);
    var length = tmp.length();
    if (length === 0) {
        tmp.x = 1;
        tmp.y = 0;
    } else {
        tmp = tmp.divide(Vec2d(length, length));
    }
    //problem of the new vec does'nt have scale 
    let scaled = tmp.scale(unit);
    return new Vec2d(scaled.x, scaled.y);
};

Vec2d.prototype.norm = Vec2d.prototype.normalize;
Vec2d.prototype.unit = Vec2d.prototype.normalize;

/**
* If the absolute vector axis is greater than `max`, multiplies the axis by `factor`
*
* ### Examples:
*     var vec = new Vec2d(100, 50);
*
*     vec.limit(80, 0.9);
*     vec.toString();
*     // => x:90, y:50
*
* @param {Number} max The maximum value for both x and y axis
* @param {Number} factor Factor by which the axis are to be multiplied with
* @return {Vec2d} `this` for chaining capabilities
* @api public
*/
Vec2d.prototype.limit = function (max, factor) {
    let tmp = new Vec2d(this.x, this.y);
    if (Math.abs(tmp.x) > max){ tmp.x *= factor; }
    if (Math.abs(tmp.y) > max){ tmp.y *= factor; }
    return tmp;
};


/**
* Rounds both axis to an integer value
*
* ### Examples:
*     var vec = new Vec2d(100.2, 50.9);
*
*     vec.unfloat();
*     vec.toString();
*     // => x:100, y:51
*
* @return {Vec2d} `this` for chaining capabilities
* @api public
*/
Vec2d.prototype.unfloat = function () {
    let tmp = new Vec2d(this.x, this.y);
    tmp.x = Math.round(tmp.x);
    tmp.y = Math.round(tmp.y);
    return tmp;
};

/**
* Rounds both axis to a certain precision
*
* ### Examples:
*     var vec = new Vec2d(100.2, 50.9);
*
*     vec.unfloat();
*     vec.toString();
*     // => x:100, y:51
*
* @param {Number} Precision (default: 8)
* @return {Vec2d} `this` for chaining capabilities
* @api public
*/
Vec2d.prototype.toFixed = function (precision) {
    let tmp = new Vec2d(this.x, this.y);
    if (typeof precision === 'undefined') { precision = 8; }
    tmp.x = tmp.x.toFixed(precision);
    tmp.y = tmp.y.toFixed(precision);
    return tmp;
};





/**
* Performs a linear blend / interpolation towards another vector
*
* ### Examples:
*     var vec1 = new Vec2d(100, 100);
*     var vec2 = new Vec2d(200, 200);
*
*     vec1.mix(vec2, 0.5);
*     vec.toString();
*     // => x:150, y:150
*
* @param {Vec2d} vector The other vector
* @param {Number} amount The blend amount (optional, default: 0.5)
* @return {Vec2d} `this` for chaining capabilities
* @api public
*/
Vec2d.prototype.lerp = function (vec, amount) {
    let tmp = new Vec2d(this.x, this.y);
    tmp.x = lerp(tmp.x, vec.x, amount);
    tmp.y = lerp(tmp.y, vec.y, amount);
    return tmp;
};

/**
* # Products
*/

/**
* Creates a clone of this vector
*
* ### Examples:
*     var vec1 = new Vec2d(10, 10);
*     var vec2 = vec1.clone();
*
*     vec2.toString();
*     // => x:10, y:10
*
* @return {Vec2d} A clone of the vector
* @api public
*/
Vec2d.prototype.clone = function () {
    return new Vec2d(this.x, this.y);
};


/**
* Calculates the dot product of this vector and another
*
* ### Examples:
*     var vec1 = new Vec2d(100, 50);
*     var vec2 = new Vec2d(200, 60);
*
*     vec1.dot(vec2);
*     // => 23000
*
* @param {Vec2d} vector The second vector
* @return {Number} Dot product
* @api public
*/
Vec2d.prototype.dot = function (vec2) {
    return this.x * vec2.x + this.y * vec2.y;
};

Vec2d.prototype.cross = function (vec2) {
    return (this.x * vec2.y ) - (this.y * vec2.x );
};

/**
* Projects a vector onto another vector, setting itself to the result.
*
* ### Examples:
*     var vec = new Vec2d(100, 0);
*     var vec2 = new Vec2d(100, 100);
*
*     vec.projectOnto(vec2);
*     vec.toString();
*     // => x:50, y:50
*
* @param {Vec2d} vector The other vector you want to project this vector onto
* @return {Vec2d} `this` for chaining capabilities
* @api public
*/
Vec2d.prototype.projectOnto = function (vec2) {
    let tmp = new Vec2d(this.x, this.y);
    var coeff = ( (tmp.x * vec2.x)+(tmp.y * vec2.y) ) / ((vec2.x*vec2.x)+(vec2.y*vec2.y));
    tmp.x = coeff * vec2.x;
    tmp.y = coeff * vec2.y;
    return tmp;
};


Vec2d.prototype.horizontalAngle = function () {
    return Math.atan2(this.y, this.x);
};

Vec2d.prototype.horizontalAngleDeg = function () {
    return radian2degrees(this.horizontalAngle());
};

Vec2d.prototype.verticalAngle = function () {
    return Math.atan2(this.x, this.y);
};

Vec2d.prototype.verticalAngleDeg = function () {
    return radian2degrees(this.verticalAngle());
};

Vec2d.prototype.angle = Vec2d.prototype.horizontalAngle;
Vec2d.prototype.angleDeg = Vec2d.prototype.horizontalAngleDeg;
Vec2d.prototype.direction = Vec2d.prototype.horizontalAngle;

Vec2d.prototype.rotate = function (angle) {
    let tmp = new Vec2d(this.x, this.y);    
    var nx = (tmp.x * Math.cos(angle)) - (tmp.y * Math.sin(angle));
    var ny = (tmp.x * Math.sin(angle)) + (tmp.y * Math.cos(angle));
    
    tmp.x = nx;
    tmp.y = ny;
    
    return tmp;
};

Vec2d.prototype.rotateDeg = function (angle) {
    angle = degrees2radian(angle);
    return this.rotate(angle);
};

Vec2d.prototype.rotateTo = function(rotation) {
    return this.rotate(rotation-this.angle());
};

Vec2d.prototype.rotateToDeg = function(rotation) {
    rotation = degrees2radian(rotation);
    return this.rotateTo(rotation);
};

Vec2d.prototype.rotateBy = function (rotation) {
    var angle = this.angle() + rotation;
    
    return this.rotate(angle);
};

Vec2d.prototype.rotateByDeg = function (rotation) {
    rotation = degrees2radian(rotation);
    return this.rotateBy(rotation);
};

/**
* Calculates the distance of the X axis between this vector and another
*
* ### Examples:
*     var vec1 = new Vec2d(100, 50);
*     var vec2 = new Vec2d(200, 60);
*
*     vec1.distanceX(vec2);
*     // => -100
*
* @param {Vec2d} vector The second vector
* @return {Number} Distance
* @api public
*/
Vec2d.prototype.distanceX = function (vec) {
    return this.x - vec.x;
};

/**
* Same as `distanceX()` but always returns an absolute number
*
* ### Examples:
*     var vec1 = new Vec2d(100, 50);
*     var vec2 = new Vec2d(200, 60);
*
*     vec1.absDistanceX(vec2);
*     // => 100
*
* @param {Vec2d} vector The second vector
* @return {Number} Absolute distance
* @api public
*/
Vec2d.prototype.absDistanceX = function (vec) {
    return Math.abs(this.distanceX(vec));
};

/**
* Calculates the distance of the Y axis between this vector and another
*
* ### Examples:
*     var vec1 = new Vec2d(100, 50);
*     var vec2 = new Vec2d(200, 60);
*
*     vec1.distanceY(vec2);
*     // => -10
*
* @param {Vec2d} vector The second vector
* @return {Number} Distance
* @api public
*/
Vec2d.prototype.distanceY = function (vec) {
    return this.y - vec.y;
};

/**
* Same as `distanceY()` but always returns an absolute number
*
* ### Examples:
*     var vec1 = new Vec2d(100, 50);
*     var vec2 = new Vec2d(200, 60);
*
*     vec1.distanceY(vec2);
*     // => 10
*
* @param {Vec2d} vector The second vector
* @return {Number} Absolute distance
* @api public
*/
Vec2d.prototype.absDistanceY = function (vec) {
    return Math.abs(this.distanceY(vec));
};

/**
* Calculates the euclidean distance between this vector and another
*
* ### Examples:
*     var vec1 = new Vec2d(100, 50);
*     var vec2 = new Vec2d(200, 60);
*
*     vec1.distance(vec2);
*     // => 100.4987562112089
*
* @param {Vec2d} vector The second vector
* @return {Number} Distance
* @api public
*/
Vec2d.prototype.distance = function (vec) {
    return Math.sqrt(this.distanceSq(vec));
};

/**
* Calculates the squared euclidean distance between this vector and another
*
* ### Examples:
*     var vec1 = new Vec2d(100, 50);
*     var vec2 = new Vec2d(200, 60);
*
*     vec1.distanceSq(vec2);
*     // => 10100
*
* @param {Vec2d} vector The second vector
* @return {Number} Distance
* @api public
*/
Vec2d.prototype.distanceSq = function (vec) {
    var dx = this.distanceX(vec),
    dy = this.distanceY(vec);
    
    return dx * dx + dy * dy;
};

/**
* Calculates the length or magnitude of the vector
*
* ### Examples:
*     var vec = new Vec2d(100, 50);
*
*     vec.length();
*     // => 111.80339887498948
*
* @return {Number} Length / Magnitude
* @api public
*/
Vec2d.prototype.length = function () {
    return Math.sqrt(this.lengthSq());
};




/**
* Squared length / magnitude
*
* ### Examples:
*     var vec = new Vec2d(100, 50);
*
*     vec.lengthSq();
*     // => 12500
*
* @return {Number} Length / Magnitude
* @api public
*/
Vec2d.prototype.lengthSq = function () {
    return this.x * this.x + this.y * this.y;
};

Vec2d.prototype.magnitude = Vec2d.prototype.length;

/**
* Returns a true if vector is (0, 0)
*
* ### Examples:
*     var vec = new Vec2d(100, 50);
*     vec.zero();
*
*     // => true
*
* @return {Boolean}
* @api public
*/
Vec2d.prototype.isZero = function() {
    return this.x === 0 && this.y === 0;
};

/**
* Returns a true if this vector is the same as another
*
* ### Examples:
*     var vec1 = new Vec2d(100, 50);
*     var vec2 = new Vec2d(100, 50);
*     vec1.isEqualTo(vec2);
*
*     // => true
*
* @return {Boolean}
* @api public
*/
Vec2d.prototype.isEqualTo = function(vec2) {
    return this.x === vec2.x && this.y === vec2.y;
};

/**
* # Utility Methods
*/

/**
* Returns an string representation of the vector
*
* ### Examples:
*     var vec = new Vec2d(10, 20);
*
*     vec.toString();
*     // => x:10, y:20
*
* @return {String}
* @api public
*/
Vec2d.prototype.toString = function () {
    return 'x:' + this.x + ', y:' + this.y;
};

/**
* Returns an array representation of the vector
*
* ### Examples:
*     var vec = new Vec2d(10, 20);
*
*     vec.toArray();
*     // => [10, 20]
*
* @return {Array}
* @api public
*/
Vec2d.prototype.toArray = function () {
    return [ this.x, this.y ];
};

/**
* Returns an object representation of the vector
*
* ### Examples:
*     var vec = new Vec2d(10, 20);
*
*     vec.toObject();
*     // => { x: 10, y: 20 }
*
* @return {Object}
* @api public
*/
Vec2d.prototype.toObject = function () {
    return { x: this.x, y: this.y };
};


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


if(typeof module != 'undefined')
{
    module.exports = Vec2d;
}