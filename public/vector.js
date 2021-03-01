function Vector(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;

    this.add = function(s) {
        if (s instanceof Vector) {
            this.x += s.x;
            this.y += s.y;
            this.z += s.z;
        } else {
            this.x += s;
            this.y += s;
            this.z += s;
        }
    }

    this.addNew = function(s) {
        if (s instanceof Vector) {
            var x = this.x += s.x;
            var y = this.y += s.y;
            var z = this.z += s.z;
        } else {
            var x = this.x += s;
            var y = this.y += s;
            var z = this.z += s;
        }
        return new Vector(x, y, z);
    }

    this.mult = function(s) {
        if (s instanceof Vector) {
            this.x *= s.x;
            this.y *= s.y;
            this.z *= s.z;
        } else {
            this.x *= s;
            this.y *= s;
            this.z *= s;
        }
    }

    this.multNew = function(s) {
        if (s instanceof Vector) {
            var x = this.x *= s.x;
            var y = this.y *= s.y;
            var z = this.z *= s.z;
        } else {
            var x = this.x *= s;
            var y = this.y *= s;
            var z = this.z *= s;
        }
        return new Vector(x, y, z);
    }

    this.sub = function(s) {
        if (s instanceof Vector) {
            this.x -= s.x;
            this.y -= s.y;
            this.z -= s.z;
        } else {
            this.x -= s;
            this.y -= s;
            this.z -= s;
        }
    }

    this.subNew = function(s) {
        if (s instanceof Vector) {
            var x = this.x -= s.x;
            var y = this.y -= s.y;
            var z = this.z -= s.z;
        } else {
            var x = this.x -= s;
            var y = this.y -= s;
            var z = this.z -= s;
        }
        return new Vector(x, y, z);
    }

    this.div = function(s) {
        if (s instanceof Vector) {
            this.x /= s.x;
            this.y /= s.y;
            this.z /= s.z;
        } else {
            this.x /= s;
            this.y /= s;
            this.z /= s;
        }
    }

    this.divNew = function(s) {
        if (s instanceof Vector) {
            var x = this.x /= s.x;
            var y = this.y /= s.y;
            var z = this.z /= s.z;
        } else {
            var x = this.x /= s;
            var y = this.y /= s;
            var z = this.z /= s;
        }
        return new Vector(x, y, z);
    }

    this.mag = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    this.normalise = function() {
        this.div(this.mag());
    }

    this.normaliseNew = function() {
        return this.div(this.mag());
    }

    this.setMag = function(s) {
        this.mult(s)
    }

    this.asArray = function(){
        return [this.x, this.y, this.z];
    }

    this.print = function() {
        post(this.x, this.y, this.z);
        post();
    }
}

export { Vector }