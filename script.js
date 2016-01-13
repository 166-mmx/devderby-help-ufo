var landscape = false;
var portrait = false;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

CanvasRenderingContext2D.prototype.fillImage = function(img) {
	this.save();
	
	var w = img.width,
		h = img.height,
		cW = this.canvas.width,
		cH = this.canvas.height,
		i,j;
	
	this.globalCompositeOperation = 'source-atop';
	
	var cols = Math.ceil(cW/w),
		rows = Math.ceil(cH/h);

	for (i = 0; i < cols; i++) {
		for (j = 0; j < rows; j++) {
			this.drawImage(img, i*w, j*w);
		}
	}
	this.restore();
};

window.requestAnimationFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
})();



var x = 200;
var y = 200;

var beta = 0;
var gamma = 0;

var pureBeta = 0;
var pureGamma = 0;

var reX = 0;
var reY = 0;

var reverseX = 1;
var reverseY = 1;

var switchXY = false;

var lastTimestamp = 0;

function setCenter() {
	reX = pureGamma;
	reY = pureBeta;
}

var BlackHole = (function() {
	
	function BlackHole(definition) {
		this.x = definition.x;
		this.ctx = ctx;
		this.y = definition.y;
		this.width = definition.width*2;
		this.height = definition.height*2;
		this.r = definition.width;
		this.part = 10;
		
		this.TLx = this.x;
		this.TLy = this.y;
		
		this.BRx = this.x + this.width;
		this.BRy = this.y + this.height;
		this.image = null;
		
		this.render = function() {
			this.ctx.drawImage(this.image,this.x, this.y);
			
		};
		
		this.prerender = function() {
			var canvas = document.createElement('canvas'),
				ctx = canvas.getContext('2d'),
				i,
				width = this.width - 6,
				height = this.height - 6,
				lingrad;
			
			canvas.width = this.width;
			canvas.height = this.height;
			
			
			var radgrad = ctx.createRadialGradient(width/2, height/2, this.r*0.25, width/2, height/2, width/2);
			radgrad.addColorStop(0, 'rgba(255, 253, 208, 1)');
			radgrad.addColorStop(0.1, 'rgba(255,255,255,0.5)');
			radgrad.addColorStop(0.15, 'rgba(255,255,255,0.4)');
			radgrad.addColorStop(1, 'rgba(255,255,255,0)');
			
			ctx.fillStyle = radgrad;
			ctx.fillRect(0,0,width, height);
			
			ctx.fillStyle = 'black';
			ctx.beginPath();
			ctx.arc(width/2,height/2,this.r*0.24,0,Math.PI*2,true);
			ctx.fill();
			
			
			this.image = canvas;
			
		};
		
		this.prerender();
		
	};
	return BlackHole;
	
})();

var Rectangle = (function() {
		
	function Rectangle(definition) {
		this.x = definition.x;
		this.ctx = ctx;
		this.y = definition.y;
		this.width = definition.width;
		this.height = definition.height;
		this.part = 10;
		
		this.TLx = this.x;
		this.TLy = this.y;
		
		this.BRx = this.x + this.width;
		this.BRy = this.y + this.height;
		this.image = null;
		
		this.render = function() {
			this.ctx.drawImage(this.image,this.x, this.y);
		};
		
		this.matchPoints = function(a) {
			if (a>=64 && a<128)
				return 3;
			if (a>=128 && a<256)
				return 4;
			if (a>=256 && a<512)
				return 5;
			if (a>=512)
				return 6;
		};
		
		this.prerender = function() {
			var canvas = document.createElement('canvas'),
				ctx = canvas.getContext('2d'),
				i,
				width = this.width - 6,
				height = this.height - 6,
				lingrad;
			
			canvas.width = this.width;
			canvas.height = this.height;
			
			ctx.beginPath();
			ctx.lineWidth = 1;
			
			lingrad = ctx.createLinearGradient(this.width,0,this.width-this.width*Math.random(),this.height);
			lingrad.addColorStop(0, '#cccccc');
			lingrad.addColorStop(0.5, '#aaaaaa');
			lingrad.addColorStop(1, '#333333');
			
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'white';
			ctx.fillStyle = 'black';
			
			// top
			var array = fractalMidpoint(0, 12, this.matchPoints(width)),
				step = (width-30) / array.length;
			
			ctx.moveTo(15,15);
			for (i in array) {
				ctx.lineTo(Math.round(step*i) + 15, 15-array[i]);
			}
			
			// right
			array = fractalMidpoint(0, 12, this.matchPoints(height));
			step = (height-30) / array.length;
			
			for (i in array) {
				ctx.lineTo(width - 15+array[i], Math.round(step*i) + 15);
			}
			
			// bottom
			array = fractalMidpoint(0, 12, this.matchPoints(width));
			step = (width-30) / array.length;
			
			for (i in array) {
				ctx.lineTo(width -15 - Math.round(step*i), height - 15+array[i]);
			}
			
			// right
			array = fractalMidpoint(0, 12, this.matchPoints(height));
			step = (height-30) / array.length;
			
			for (i in array) {
				ctx.lineTo(15 - array[i], height - Math.round(step*i) - 15);
			}
			
			
			//ctx.lineTo(0.2*width+3,2);
			/*var countPoints = Math.floor(height/this.part);
			for (i =1; i< countPoints; i++) {
				ctx.lineTo((0.2-(0.2*Math.random())) * width + 3, this.part*i+2);
			}
			ctx.lineTo(0.2*width+3, height+2);
			ctx.lineTo(0.8*width+3, height+2);
			for (i =1; i<= countPoints; i++) {
				ctx.lineTo((0.8+(0.2*Math.random())) * width+3, height-(this.part*i)+2);
			}
			ctx.lineTo(0.8*this.width+3, 2);*/
			ctx.closePath();
			ctx.fill();
			
			var f = fractal(8);
			
			ctx.fillImage(f);
			ctx.stroke();
			
			// prepare 18 lines on each
			ctx.globalCompositeOperation = 'source-atop';
			var opacity, a, b, dY, y;
			for (i = 0;i < 50; i++) {
				opacity = 0.2 + 0.2*Math.random();
				a = 3-6*Math.random();
				b = height - (height*0.1 + height*0.8*Math.random());
				dY = -height*Math.random();
				ctx.lineWidth = 2;
				ctx.strokeStyle = 'rgba(255,255,255, '+opacity.toFixed(4)+')';
				ctx.fillStyle = 'rgba(255,255,255, '+opacity.toFixed(4)+')';
				ctx.beginPath();
				ctx.moveTo(0, b+dY);
				ctx.lineTo(this.width, a*this.width+b+dY);
				ctx.stroke();
				
				for (var j =0; j<8; j++) {
					ctx.beginPath();
					x = Math.random() * this.width; 
					ctx.arc(x, a*x+b+dY, 4*Math.random(), 0, Math.PI*2, true);
					ctx.fill();					
				}
				
			}
			
			// postprocessing
			
			for (i = 0; i<500; i++) {
				ctx.beginPath();
				x = Math.random() * this.width; 
				ctx.fillStyle = 'rgba(20,20,20, '+Math.random().toFixed(4)+')';
				ctx.arc(this.width*Math.random(), this.height*Math.random(), 3*Math.random(), 0, Math.PI*2, true);
				ctx.fill();	
			}
			
			this.image = canvas;
			
		};
		
		this.prerender();
		
	};
	
	
	
	return Rectangle;
})();


var Spaceship = (function(undefined) {
	function Spaceship() {
		this.x = 50;
		this.y = 50;
		this.r = 20;
		
		this.level = null;
		this.ctx = ctx;
		this.animStart = 0;
		this.animData = null;
		this.callbacks = {};
		this.setLevel = function(level) {
			this.level = level;
		};
		
		this.setPlanet = function(planet) {
			this.planet = planet;
		};
		
		this.setCallback = function(type, fn) {
			this.callbacks[type] = fn;
		};
		
		this.restart = function() {
			this.x = 50;
			this.y = 50;
		};		
		
		var image = null;
		
		this.checkCircleCollision = function(obj) {
			if ( Math.pow(this.y - (obj.y+obj.r), 2) + Math.pow(this.x - (obj.x+obj.r), 2) < Math.pow(this.r+obj.r,2)  ) {
				return true;
			}
				
			return false;
	    	
		};
		
		this.checkCollision = function(a,b,bX,bY) {
			var ey, ex, newX, newY, box, closest = null, distance = -1, tmpD = -1, x = this.x, y = this.y, fX = null, fY = null, best = [];
			var possibleBoxes = [];
		    
		    for (var i in this.level.boxes) {
		    	var box = this.level.boxes[i],
		    		boxX = box.x - this.r/2,
		    		boxBRx = box.BRx + this.r/2,
		    		boxY = box.y - this.r/2,
		    		boxBRy = box.BRy + this.r/2; 
		    	// checking all edges
		    	if ((bX < boxX && x < boxX) || (bX > boxBRx && x > boxBRx)) {
		    		continue;
		    	}
		    	
		    	if ((bY < boxY && y < boxY) || (bY > boxBRy && y > boxBRy)) {
		    		continue;
		    	}
		    	
		    	closest = null;
		    	
		    	//detecting edge
		    	// LEFT
		    	
		    	ey = a*boxX + b;
		    	
		    	if (ey >= boxY && ey <= boxBRy) {
		    		tmpD = Math.pow((ey - y),2)+ Math.pow((boxX - x), 2);
		    		if (closest == null || (tmpD < distance)) {
			    		closest = 'LEFT';
			    		distance = tmpD;
			    		newX = boxX;
			    		newY = ey;
		    		}
		    	}
		    	
		    	// RIGHT
		    	
		    	
		    	ey = a*boxBRx + b;
		    	
		    	if (ey >= boxY && ey <= boxBRy) {
		    		
		    		tmpD = Math.pow((ey - y),2)+ Math.pow((boxBRx - x), 2);
		    		if (closest == null || (tmpD < distance)) {
		    			distance = tmpD;
		    			closest = 'RIGHT';
		    			newX = boxBRx;
		    			newY = ey;
		    		}
		    	}
		    	
		    	
		    	
		    	// TOP
		    	if (a == 0 || a == Number.NEGATIVE_INFINITY || a == Number.POSITIVE_INFINITY) {
		    		ex = bX;
		    	} else {
		    		ex = (boxY - b)/a;
		    	}
		    	if (ex >= boxX && ex <= boxBRx) {
		    		
		    		tmpD = Math.pow((ex - x),2)+ Math.pow((boxY - y), 2);
		    		if (closest == null || (tmpD < distance)) {
		    			distance = tmpD;
		    			closest = 'TOP';
		    			newX = ex;
			    		newY = boxY;
		    		}
		    	}
		    	
		    	// BOTTOM
		    	if (a == 0 || a == Number.NEGATIVE_INFINITY || a == Number.POSITIVE_INFINITY) {
		    		ex = bX;
		    	} else {
		    		ex = (boxBRy - b)/a;
		    	}
		    	if (ex >= boxX && ex <= boxBRx) {
		    		tmpD = Math.pow((ex - x),2)+ Math.pow((boxBRy - y), 2);
		    		if (closest == null || (tmpD < distance)) {
		    			distance = tmpD;
		    			closest = 'BOTTOM';
		    			newX = ex;
			    		newY = boxBRy;
		    		}
		    		
		    	}
		    	
		    	
		    	if (closest != null) {
			    	switch (closest) {
			    		case 'TOP':
			    			fY = newY -1;
			    			break;
			    		case 'BOTTOM':
			    			fY = newY + 1;
			    			break;
			    		case 'LEFT':
			    			fX = newX - 1;
			    			break;
			    		case 'RIGHT':
			    			fX = newX + 1;
			    			break;	
			    	}
		    	}
		    	
		    }
		    
		    var pos = {
		    		x: null,
		    		y: null
		    };
		    
		    if (fX !== null)
		    	pos.x = fX;
		    else
		    	pos.x = bX;
		    
		    if (fY !== null)
		    	pos.y = fY;
		    else
		    	pos.y = bY;
		    
		    return pos;
			
		};
		
		this.finishAnimation = function() {
			
		};
		
		this.hideAnimation = function(callback) {
			callback();
		};
		
		this.playMode = function() {
			this.move = this._move;
			this.render = this._render;
		};
		
		this.blackHoleMode = function(blackHole) {
			this.move = this._empty;
			this.animStart = new Date().getTime();
			this.animData = blackHole;
			this.render = this._renderBlackHole;
		};
		
		this.planetMode = function() {
			this.move = this._empty;
			this.animStart = new Date().getTime();
			this.render = this._renderPlanet;
		};
		
		this.pauseMode = function() {
			this.move = this._empty;
			this.render = this._empty;
		};
		
		this._empty = function() {};
		
		this.move = this._empty;
		
		this._move = function(x,y) {
			// here is done detection of collision
			if (x > 12) x = 12;
			if (y > 12) y = 12;
			
			if (x < -12) x = -12;
			if (y < -12) y = -12;
			
			if (!isMobileFlag) {
				if (keyboardHandler.down) y += 3;
				if (keyboardHandler.up) y -= 3;
				if (keyboardHandler.left) x -= 3;
				if (keyboardHandler.right) x += 3;
			}
			
			var bY = this.y + y;
			var bX = this.x + x;
		    
		    // standard collision detect
		    
		    // making vector and equation
		    var a = (bY - this.y) / (bX - this.x);
		    var b = this.y - a * this.x;
		    
		    
		    var pos = this.checkCollision(a,b,bX,bY);
		    if (pos.x !== null) {
		    	this.x = pos.x;
		    } else {
		    	this.x = bX;
		    }
		    
		    if (pos.y !== null) {
		    	this.y = pos.y;
		    } else {
		    	this.y = bY;
		    }
		    
		    // check planet
		    if (this.checkCircleCollision(this.planet)) {
		    	
		    	this.planetMode();
		    	return;
		    	
		    }
		    
		    // check black holes
		    for (var i in this.level.blackHoles) {
		    
		    	if (this.checkCircleCollision(this.level.blackHoles[i])) {
			    	
			    	this.blackHoleMode(this.level.blackHoles[i]);
			    	return;
			    	
			    }
		    	
		    }
		    
		    // borders of level
		    
		    
		    
		    if (this.x-this.r<0) {
		    	this.x = this.r;
		    }
		    
		    if (this.x+this.r>800) {
		    	this.x = 800-this.r;
		    }
		    
		    if (this.y-this.r<0) {
		    	this.y = this.r;
		    }
		    
		    if (this.y + this.r>600) {
		    	this.y = 600-this.r;
		    }
		    
		};
		
		this.prerender = function() {
			var canvas = document.createElement('canvas');
			canvas.width = this.r*2;
			canvas.height = this.r*2;
			var ctx = canvas.getContext('2d');
			
			ctx.strokeStyle = 'rgb(20,20,20)';
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(this.r,this.r*0.7);
			ctx.lineTo(1/2*this.r, 1.8*this.r);
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo(this.r,this.r*0.7);
			ctx.lineTo(3/2*this.r, 1.8*this.r);
			ctx.stroke();
			
			var factor = 2;
			ctx.save();
			ctx.scale(1, 1/factor);
			ctx.fillStyle = 'rgb(220,220,220)';
			ctx.lineWidth = 3;
			ctx.strokeStyle = 'rgb(160,160,160)';
			ctx.beginPath();
			ctx.arc(this.r, (this.r)*factor, this.r-3, 0, Math.PI*2, false);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
			
			ctx.save();
			ctx.beginPath();
			factor = 1.8;
			ctx.scale(1/factor, 1);
			ctx.fillStyle = 'rgb(20,180,20)';
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'green';
			ctx.arc((this.r)*factor, this.r*0.95, this.r-9, 0, Math.PI, true);
			ctx.fill();
			ctx.stroke();
			ctx.restore();
			
			ctx.save();
			ctx.beginPath();
			factor = 1.8;
			factorY = 6;
			ctx.scale(1/factor, 1/factorY);
			ctx.fillStyle = 'rgb(20,180,20)';
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'green';
			ctx.arc((this.r)*factor, (this.r*0.95)*factorY, this.r-9, 0, Math.PI, false);
			ctx.fill();
			ctx.stroke();
			ctx.restore();
			
			ctx.save();
			factor = 2;
			ctx.scale(1, 1/factor);
			ctx.beginPath();
			ctx.fillStyle = 'yellow';
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'rgb(120,120,0)';
			ctx.arc(this.r-12, this.r*factor, this.r-16, 0, Math.PI*2, true);
			ctx.fill();
			ctx.stroke();
			
			ctx.beginPath();
			ctx.arc(this.r, (this.r+4)*factor, this.r-16, 0, Math.PI*2, true);
			ctx.fill();
			ctx.stroke();
			
			ctx.beginPath();
			ctx.arc(this.r+12, this.r*factor, this.r-16, 0, Math.PI*2, true);
			ctx.fill();
			ctx.stroke();
			
			ctx.restore();
			
			image = canvas;
		};
		
		this.render = this._empty;
		
		this._renderPlanet = function() {
			var length = 2000,
				diff = (new Date().getTime()) - this.animStart,
				p = diff / length,
				dX = this.planet.x - this.x + this.planet.r + this.r,
				dY = this.planet.y - this.y + this.planet.r + this.r;
			
			if (diff > length) {
				this.pauseMode();
				this.callbacks.planet();
			}
			try {
				this.ctx.drawImage(image, this.x - this.r + dX*p, this.y - this.r + dY*p, this.r*2*(1-p), this.r*2*(1-p) );
			} catch(e) {}
			
		};
		
		this._renderBlackHole = function() {
			var length = 2000,
				diff = (new Date().getTime()) - this.animStart,
				p = diff / length,
				dX = this.animData.x - this.x + this.animData.r,
				dY = this.animData.y - this.y + this.animData.r;
			
			if (diff > length) {
				this.pauseMode();
				this.callbacks.blackHole();
			}
			this.ctx.drawImage(image, this.x-this.r + dX*p, this.y-this.r + dY*p, this.r*2*(1-p), this.r*2*(1-p) );
			
		};
		
		this._render = function() {
			this.ctx.drawImage(image, this.x-this.r, this.y-this.r);
		};
		
		this.prerender();
	}
	
	return Spaceship;
})();

var Planet = (function(undefined) {
	function Planet() {
		this.r = 30;
		this.x = 720;
		this.y = 20;
		
		this.ctx = ctx;
		
		this.image = null;
		
		this.render = function() {
			this.ctx.drawImage(this.image, this.x, this.y);
		};

		this.prerender = function() {
			var canvas = document.createElement('canvas'),
				ctx = canvas.getContext('2d');
			
			canvas.width = this.r*2;
			canvas.height = this.r*2;
			
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#006600';
			ctx.fillStyle = 'green';
			
			ctx.beginPath();
			ctx.moveTo(this.r, this.r);
			ctx.bezierCurveTo(this.r*0.8, this.r*0.5,  this.r*0.3, this.r*0.5, this.r*0.3, this.r*0.3);
			ctx.bezierCurveTo(this.r*0.3, this.r*0.1,  this.r, this.r*-0.1, this.r, this.r*-0.05);
			ctx.bezierCurveTo(this.r*1.3, this.r*-0.1,  this.r*1.5, this.r*0.6, this.r*1.3, this.r*0.8);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo(this.r*0.6, this.r*0.9);
			ctx.bezierCurveTo(this.r*0.5, this.r*0.6,  this.r*0.3, this.r*0.7, this.r*0.2, this.r*1.1);
			ctx.bezierCurveTo(this.r*0.1, this.r*1.2,  this.r*0.5, this.r*1.4, this.r*0.6, this.r*1.4);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
			
			
			ctx.beginPath();
			ctx.moveTo(this.r*1.6, this.r*1.1);
			ctx.bezierCurveTo(this.r*1.7, this.r*0.9,  this.r*1.8, this.r*1.3, this.r*1.7, this.r*1.4);
			ctx.bezierCurveTo(this.r*1.6, this.r*1.7,  this.r*1.5, this.r*1.9, this.r*1.3, this.r*1.9);
			ctx.bezierCurveTo(this.r*0.8, this.r*2,  this.r*0.8, this.r*1.5, this.r, this.r*1.2);
			ctx.closePath();
			ctx.fill();
			ctx.fillImage(fractal(7, 0.2));
			ctx.stroke();
			
			
			ctx.beginPath();
			ctx.moveTo(this.r, this.r);
			ctx.bezierCurveTo(this.r*0.8, this.r*0.5,  this.r*0.3, this.r*0.5, this.r*0.3, this.r*0.3);
			ctx.bezierCurveTo(this.r*0.3, this.r*0.1,  this.r, this.r*-0.1, this.r, this.r*-0.05);
			ctx.bezierCurveTo(this.r*1.3, this.r*-0.1,  this.r*1.5, this.r*0.6, this.r*1.3, this.r*0.8);
			ctx.closePath();
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo(this.r*0.6, this.r*0.9);
			ctx.bezierCurveTo(this.r*0.5, this.r*0.6,  this.r*0.3, this.r*0.7, this.r*0.2, this.r*1.1);
			ctx.bezierCurveTo(this.r*0.1, this.r*1.2,  this.r*0.5, this.r*1.4, this.r*0.6, this.r*1.4);
			ctx.closePath();
			ctx.stroke();
			
			ctx.save();
			
			ctx.globalCompositeOperation = 'destination-over';
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'rgba(255,255,255,0.5)';
			var radgrad = ctx.createRadialGradient(this.r*1.2,this.r*0.8,this.r*0.2,this.r,this.r,this.r*0.8);
			radgrad.addColorStop(0, '#0087BD');
			radgrad.addColorStop(1, '#0047ab');
			ctx.fillStyle = radgrad;
			
			ctx.beginPath();
			ctx.arc(this.r, this.r, this.r-2, 0, Math.PI*2, true);
			ctx.stroke();
			ctx.fill();
			
			
			ctx.restore();
			
			this.image = canvas;
				
		};
		
		this.prerender();
	}
	return Planet;
})();

var Level = (function(undefined) {
	function Level(definition, callback) {
		var self = this;
		this.boxes = [];
		this.blackHoles = [];
		this.boxesCount = 0;
		this.boxesLoaded = 0;
		
		this.render = function() {
			var len = this.boxes.length;
			for(var i = 0;i<len;i++) {
				this.boxes[i].render();
			}
			len = this.blackHoles.length;
			for(var i = 0;i<len;i++) {
				this.blackHoles[i].render();
			}
		};
		
		this.load = function(def, callback) {
			setTimeout(function() {
				self.boxes.push(new Rectangle(def));
				self.boxesLoaded++;
				game.updateLoadingScreen(~~((self.boxesLoaded / self.boxesCount)*100) + '%');
				if (self.boxesCount == self.boxesLoaded)
					callback();
				else
					self.load(definition[self.boxesLoaded], callback);
			}, 1);
		};
		
		for (var i in definition) {
			if (definition[i].type == 'rock')
				this.boxesCount++;
		}
		
		game.loadingScreen();
		if (this.boxesCount == 0)
			game.updateLoadingScreen('100%');
		
		if (definition[0].type == 'rock') {
			this.load(definition[0], callback);
		}
		
		for (var i in definition) {
			
			if (definition[i].type == 'blackHole')
				this.blackHoles.push(new BlackHole(definition[i]));
			
		}
		
	}
	return Level;
})();

var Orientation = function() {
	var a = false;
	var el = document.getElementById('data');
	var ff = (navigator.userAgent.indexOf('Firefox') != -1) ? true : false;
	
	/**
	 * handling devicemotion event by http://www.html5rocks.com/en/tutorials/device/orientation/
	 * license: Apache 2.0
	 */
	var handleMotion = function(e) {
		var acceleration = e.accelerationIncludingGravity,
			tiltLR, tiltFB;

		if (ff) {
			tiltLR = ((acceleration.x) ) * 90;
			tiltFB = ((acceleration.y ) ) * -90;  
		} else {
			tiltLR = Math.round(((acceleration.x) / 9.81) * -90);
			tiltFB = Math.round(((acceleration.y + 9.81) / 9.81) * 90);
		}

		pureGamma = tiltFB;
		pureBeta = tiltLR;

		if (switchXY) {
			gamma = (tiltFB - reX) * this.reverseX;
			beta = (tiltLR - reY) * this.reverseY;
		} else {
			beta = (tiltFB - reX) * this.reverseY;
			gamma = (tiltLR - reY) * this.reverseX;
		}

	};
	
	var handleOrientation = function(e) {
		if (!e.gamma && !e.beta) {
			e.gamma = -(e.x * (180 / Math.PI));
			e.beta = -(e.y * (180 / Math.PI));
		}

		pureGamma = e.gamma;
		pureBeta = e.beta;

		if (switchXY) {
			gamma = (e.beta - reY) * this.reverseX;
			beta = (e.gamma - reX) * this.reverseY;
		} else {
			beta = (e.beta - reY) * this.reverseY;
			gamma = (e.gamma - reX) * this.reverseX;
		}
		
	};
	
	if (window.DeviceMotionEvent) {
		window.addEventListener('devicemotion',  	  handleMotion, true);
	} else if (window.DeviceOrientationEvent || window.OrientationEvent) {
		window.addEventListener('deviceorientation',  handleOrientation, true);
		window.addEventListener('MozOrientation',     handleOrientation, true);
	} else {
		// browser doesn't have support
	}
	
	
};

var orientation = new Orientation();


var levelBuilder = {
	levels : {
		1 : [ {
			x : 150,
			y : 300,
			width : 500,
			height : 90,
			type : 'rock'
		}, {
			x : 350,
			y : 0,
			width : 90,
			height : 300,
			type : 'rock'
		},

		{
			x : 500,
			y : 480,
			width : 60,
			height : 60,
			type : 'blackHole'
		} ],
		2 : [ {
			x : 200,
			y : 0,
			width : 100,
			height : 230,
			type : 'rock'
		},

		{
			x : 550,
			y : 0,
			width : 90,
			height : 250,
			type : 'rock'
		},

		{
			x : 202,
			y : 400,
			width : 117,
			height : 200,
			type : 'rock'
		},

		{
			x : 530,
			y : 420,
			width : 92,
			height : 180,
			type : 'rock'
		}, {
			x : 370,
			y : 270,
			width : 60,
			height : 60,
			type : 'blackHole'
		} ],
		3 : [ {
			x : 100,
			y : 0,
			width : 150,
			height : 280,
			type : 'rock'
		},

		{
			x : 250,
			y : 250,
			width : 90,
			height : 120,
			type : 'rock'
		},

		{
			x : 340,
			y : 350,
			width : 117,
			height : 120,
			type : 'rock'
		},

		{
			x : 530,
			y : 170,
			width : 270,
			height : 80,
			type : 'rock'
		}, {
			x : 60,
			y : 470,
			width : 60,
			height : 60,
			type : 'blackHole'
		}, {
			x : 600,
			y : 400,
			width : 60,
			height : 60,
			type : 'blackHole'
		}, {
			x : 370,
			y : 5,
			width : 60,
			height : 60,
			type : 'blackHole'
		} ],

		4 : [ {
			x : 300,
			y : 0,
			width : 280,
			height : 180,
			type : 'rock'
		},

		{
			x : 490,
			y : 180,
			width : 90,
			height : 220,
			type : 'rock'
		},

		{
			x : 290,
			y : 350,
			width : 117,
			height : 250,
			type : 'rock'
		},

		{
			x : 60,
			y : 470,
			width : 60,
			height : 60,
			type : 'blackHole'
		}, {
			x : 600,
			y : 400,
			width : 60,
			height : 60,
			type : 'blackHole'
		}, {
			x : 430,
			y : 180,
			width : 30,
			height : 30,
			type : 'blackHole'
		} ],
		5 : [ {
			x : 100,
			y : 250,
			width : 95,
			height : 350,
			type : 'rock'
		},

		{
			x : 250,
			y : 0,
			width : 90,
			height : 350,
			type : 'rock'
		},

		{
			x : 400,
			y : 260,
			width : 117,
			height : 350,
			type : 'rock'
		},

		{
			x : 585,
			y : 0,
			width : 92,
			height : 350,
			type : 'rock'
		}, {
			x : 250,
			y : 450,
			width : 60,
			height : 60,
			type : 'blackHole'
		}, {
			x : 400,
			y : 50,
			width : 60,
			height : 60,
			type : 'blackHole'
		}, {
			x : 590,
			y : 370,
			width : 60,
			height : 60,
			type : 'blackHole'
		} ]
	},
	getLevel: function(level, callback) {
		if (this.levels[level])
			return new Level(this.levels[level], callback);
		else
			return null;
	}
};

var Game = (function() {
	var Game = function() {
		var self = this;
		this.level = null;
		this.screens = {};
		this.currentLevel;
		this.calibrateBall = null;
		this.paused = false;
		this.playingMode = false;
		this.controls = document.getElementById('game-control');
		this.levelControl = document.getElementById('level');
		
		var bgimage = document.createElement('canvas');
		var radgrad = ctx.createRadialGradient(800,40,40,400,300, 800);
		radgrad.addColorStop(0, '#003366');
		radgrad.addColorStop(1, '#000000');
		
		this.init = function() {
			this.spaceship = new Spaceship();
			this.planet = new Planet();
			
			this.spaceship.setLevel(this.level);
			this.spaceship.setPlanet(this.planet);
			this.spaceship.setCallback('blackHole', function() {
				self.blackHoleScreen();
			});
			
			this.spaceship.setCallback('planet', function() {
				self.nextLevel();
			});
			
			this.screens.start = document.getElementById('start-screen');
			this.screens.calibrate = document.getElementById('calibrate-screen');
			this.screens.blackHole = document.getElementById('black-hole-screen');
			this.screens.finish = document.getElementById('finish-screen');
			this.screens.loading = document.getElementById('loading-screen');
			
			this.calibrateBall = document.getElementById('current-bubble');
			this.loadedElements = document.getElementById('loaded-elements');
			
			ctx.fillStyle = radgrad;
			ctx.fillRect(0,0,800,600);
			
			var bh = new BlackHole({height:60, width:60}); 
			document.getElementById('black-hole').getContext('2d').drawImage(bh.image,0,0);
			bh = null;
			
			var pl = new Planet(); 
			document.getElementById('planet').getContext('2d').drawImage(pl.image,0,0);
			pl = null;
			
			/**
			 * buttons
			 */
			
			document.getElementById('start').addEventListener('click', function(e) {
				self.runLevel(1);
				e.preventDefault();
				return false;
			}, true);
			
			document.getElementById('calibrate').addEventListener('click', function(e) {
				self.calibrateScreen();
				e.preventDefault();
				return false;
			}, true);
			
			document.getElementById('calibrate-pause').addEventListener('click', function(e) {
				self.calibrateScreen();
				e.preventDefault();
				return false;
			}, true);
			
			document.getElementById('calibrate-pause').addEventListener('touchstart', function(e) {
				self.calibrateScreen();
				e.preventDefault();
				return false;
			}, true);
			
			document.getElementById('again').addEventListener('click', function(e) {
				e.preventDefault();
				self.runLevel(self.currentLevel);
				return false;
			}, true);
			
			document.getElementById('restart').addEventListener('click', function(e) {
				e.preventDefault();
				self.runLevel(1);
				return false;
			}, true);
			
			document.getElementById('back-to-start-screen').addEventListener('click', function(e) {
				self.startScreen();
				e.preventDefault();
				return false;
			}, true);
			
			
			
			document.getElementById('center').addEventListener('click', function(e) {
				e.preventDefault();
				setCenter();
				return false;
			}, true);
			
			document.getElementById('switchXY').addEventListener('click', function(e) {
				e.preventDefault();
				switchXY = !switchXY;
				return false;
			}, true);
			
			document.getElementById('reverseX').addEventListener('click', function(e) {
				e.preventDefault();
				reverseX = -reverseX;
				return false;
			}, true);
			
			document.getElementById('reverseY').addEventListener('click', function(e) {
				e.preventDefault();
				reverseY = -reverseY;
				return false;
			}, true);
			
			document.getElementById('calibrating-play').addEventListener('click', function(e) {
				e.preventDefault();
				if (self.paused) {
					self.continueGame();
				} else {
					self.runLevel(1);
				}
				return false;
			}, true);
			
		};
		
		this.run = function() {
			this.init();
			this.startScreen();
		};
		
		this.startScreen = function() {
			
			this.screens.calibrate.style.display = 'none';
			this.screens.blackHole.style.display = 'none';
			this.screens.finish.style.display = 'none';
			this.screens.start.style.display = 'block';
			this.screens.loading.style.display = 'none';
			
			this.stopLoop();
		};
		
		this.calibrateScreen = function() {
			this.screens.start.style.display = 'none';
			this.screens.blackHole.style.display = 'none';
			this.screens.finish.style.display = 'none';
			this.screens.calibrate.style.display = 'block';
			this.screens.loading.style.display = 'none';
			this.pause();
			
			this.loop = this._calibrateLoop;
			this._calibrateLoop();
		};
		
		this.loadingScreen = function() {
			this.screens.start.style.display = 'none';
			this.screens.blackHole.style.display = 'none';
			this.screens.finish.style.display = 'none';
			this.screens.calibrate.style.display = 'none';
			this.screens.loading.style.display = 'block';
			this.loadedElements.innerHTML = '0%';
			
			this.stopLoop();
		};
		
		this.updateLoadingScreen = function(amount) {
			this.loadedElements.innerHTML = amount;
		}
		
		this.blackHoleScreen = function() {
			this.screens.start.style.display = 'none';
			this.screens.calibrate.style.display = 'none';
			this.screens.finish.style.display = 'none';
			this.screens.blackHole.style.display = 'block';
			this.screens.loading.style.display = 'none';
			this.controls.style.display = 'none';
			this.stopLoop();
		};
		
		this.finishScreen = function() {
			this.screens.start.style.display = 'none';
			this.screens.blackHole.style.display = 'none';
			this.screens.calibrate.style.display = 'none';
			this.screens.finish.style.display = 'block';
			this.screens.loading.style.display = 'none';
			this.controls.style.display = 'none';
			this.stopLoop();
		};
		
		this.startLoop = function() {
			this.screens.start.style.display = 'none';
			this.screens.blackHole.style.display = 'none';
			this.screens.calibrate.style.display = 'none';
			this.screens.finish.style.display = 'none';
			this.screens.loading.style.display = 'none';
			this.playingMode = true;
			this.spaceship.playMode();
			this.loop = this._gameLoop;
			requestAnimationFrame(this.loop);
		};
		
		this.continueGame = function() {
			if (this.playingMode && this.paused) {
				this.paused = false;
				this.startLoop();
			}
		};
		
		this.nextLevel = function() {
			this.runLevel(this.currentLevel+1);
		};
		
		this.runLevel = function(i) {
			var ctx, self = this;
			this.stopLoop();
			
			function callback() {
				self.levelControl.innerHTML = i;
				self.controls.style.display = 'block';
				ctx = bgimage.getContext('2d');
				bgimage.width = 800;
				bgimage.height = 600;
				
				ctx.fillStyle = radgrad;
				ctx.fillRect(0,0,800,600);
				
				self.playingMode = true;
				self.paused = false;
				self.currentLevel = i;
				self.spaceship.setLevel(self.level);
				self.spaceship.restart();
				self.spaceship.playMode();
				self.startLoop();
			}
			
			this.level = levelBuilder.getLevel(i, callback);
			if (!this.level) {
				this.finishScreen();
			}
		};
		
		this.stopLoop = function() {
			this.loop = this._empty;
			this.playingMode = false;
		};
		
		this._empty = function() {
			
		};
		
		this.loop = this._empty;
		
		this._gameLoop = function() {
			self.spaceship.move(gamma, beta);
			
			ctx.drawImage(bgimage, 0, 0);
			if (!self.level) return; 
			
			self.level.render();
			self.planet.render();
			self.spaceship.render();
			requestAnimationFrame(self.loop);
		};
		
		this._calibrateLoop = function() {
			self.calibrateBall.style.top = parseInt(92+beta)+'px';
			self.calibrateBall.style.left = parseInt(92+gamma)+'px';
			requestAnimationFrame(self.loop);
		};
		
		this.pause = function() {
			if (this.playingMode) {
				this.paused = true;
				this.loop = this._empty();
			}
		};
		
		
	};
	return Game;
})();

var game = new Game();
game.run();

// fractal TIME!

function fractal(levels, rStart) {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	var size = Math.pow(2, levels) + 1,
		row, col,
		array = new Array(size);
	
	if (!rStart) rStart = 2.5;
	
	for (col = 0; col<size; col++) {
		array[col] = new Array(size);
	}
	
	canvas.width = size;
	canvas.height = size;
	
	array[0][0] = 1;
	array[0][size-1] = 1;
	array[size-1][0] = 1;
	array[size-1][size-1] = 1;
	
	for (var i = 0; i < levels; i++) {
		var amount = Math.pow(2, i),
			piece = (size -1)/amount,
			r = rStart/i;
		for (j = 0; j < amount; j++) {
			for (k = 0; k < amount; k++) {
				fractalSquareStep(array, j*piece, k*piece, (j+1)*piece, (k+1)*piece, piece, r);
			}
		}
		
		for (j = 0; j < amount; j++) {
			for (k = 0; k < amount; k++) {
				fractalDiamondStep(array, j*piece, k*piece, (j+1)*piece, (k+1)*piece, piece, size, r);
			}
		}
		
	}
	
	var id = ctx.createImageData(size, size);
	
	for (col = 0; col<size; col++) {
		for (row = 0; row <size; row++) {
			id.data[col*4 + size*row*4] = 255;
			id.data[col*4 + size*row*4 + 1] = 255;
			id.data[col*4 + size*row*4 + 2] = 255;
			id.data[col*4 + size*row*4 + 3] = parseInt((array[col][row] / 2) * 255);
		}
	}
	ctx.putImageData(id, 0, 0);
	return canvas;
}

function wrap(x, max, d) {
	max--;
	if (x < 0) {
		x = max - d;
	} else if (x > max) {
		x = d;
	}
	return x;
}

function fractalSquareStep(array, x1, y1, x2, y2, diff, r) {
	var diff = (x2 - x1)/2,
	cX = diff + x1,
	cY = diff + y1;
	// square step 

	array[cX][cY] = (array[x1][y1] + array[x1][y2] + array[x2][y1] + array[x2][y2]) / 4;
	array[cX][cY] += r*(0.5-Math.random());
	
	if (array[cX][cY] > 2) array[cX][cY] = 2;
	if (array[cX][cY] < 0) array[cX][cY] = 0;
}

function fractalDiamondStep(array, x1, y1, x2, y2, diff, size, r) {
	var diff = (x2 - x1)/2,
	cX = diff + x1,
	cY = diff + y1;
	
	array[x1][cY] = (array[x1][y1] + array[x1][y2] + array[cX][cY] + array[wrap(x1-diff, size, diff)][cY]) / 4 + r*(0.5-Math.random());
	array[x2][cY] = (array[x2][y1] + array[x2][y2] + array[cX][cY] + array[wrap(x2+diff, size, diff)][cY]) / 4 + r*(0.5-Math.random());

	array[cX][y1] = (array[x1][y1] + array[x2][y1] + array[cX][cY] + array[cX][wrap(y1-diff, size, diff)]) / 4 + r*(0.5-Math.random());
	array[cX][y2] = (array[x1][y2] + array[x2][y2] + array[cX][cY] + array[cX][wrap(y2+diff, size, diff)]) / 4 + r*(0.5-Math.random());
	
	if (array[x1][cY] > 2) array[x1][cY] = 2;
	if (array[x1][cY] < 0) array[x1][cY] = 0;
	if (array[x2][cY] > 2) array[x2][cY] = 2;
	if (array[x2][cY] < 0) array[x2][cY] = 0;
	
	if (array[cX][y1] > 2) array[cX][y1] = 2;
	if (array[cX][y1] < 0) array[cX][y1] = 0;
	if (array[cX][y2] > 2) array[cX][y2] = 2;
	if (array[cX][y2] < 0) array[cX][y2] = 0;
}

function fractalMidpoint(min, max, count) {
	var diff = max - min;
		array = new Array(Math.pow(2, count) + 1);
		
	array[0] = min;
	array[array.length-1] = min;
	array[(array.length-1)/2] = max;
			
	fractalMidpointStep(0, (array.length-1)/2, 1, array, max);
	fractalMidpointStep((array.length-1)/2, array.length-1, 1, array, max);
	
	return array;
}

function fractalMidpointStep(start, end, level, array, max) {
	if (end-start == 1) return;
	
	var diff = end - start,
		avg = array[start] + (array[end] - array[start])/2;
	
	array[start + diff/2] = avg + (0.5-Math.random()) * (avg - array[start]) * (5/level);
	if (array[start + diff/2] > max)
		array[start + diff/2] = max;
	
	fractalMidpointStep(start, start + diff/2, level+1, array, max);
	fractalMidpointStep(start + diff/2, end, level+1, array, max);
}

// events

var isMobileFlag = false;

function isMobile() {
	var el = document.getElementsByTagName('body');
	for (var i in el) {
		el[i].className = 'mobile';
	}
	handleMobile();
	window.addEventListener('resize', handleMobile, true);
	if ('onorientationchange' in window) {
		window.addEventListener('orientationchange', handleMobile, true);
	} else {
		document.getElementById('orientation-handler').addEventListener('resize', handleMobile, true)
	}
	isMobileFlag = true;
	
}

function handleMobile() {
	if (screen.width > screen.height) {
		if (!landscape) {
			switchXY = true;
		}
		landscape = true;
		portrait = false;
	} else {
		if (!portrait) {
			switchXY = false;
		}
		portrait = true;
		landscape = false;
	}
	
	var canvasWMax = 700,
		canvasHMax = 500;

	var pW = document.documentElement.clientWidth/canvasWMax+200;
	var pH = document.documentElement.clientHeight/canvasHMax;
	var p = Math.min(pW, pH);
	if (p>1) p = 1;
	
	transform(document.getElementById('content'), 'scale('+p+')');
	if (game.playingMode)
		game.calibrateScreen();
}

function transform(el, val) {
	el.style.transform = val;
	el.style.MozTransform = val;
	el.style.webkitTransform = val;
	el.style.OTransform = val;
}

(function(a,b){if(/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))b()})(navigator.userAgent||navigator.vendor||window.opera,isMobile);

var keyboardHandler = {
		up: false,
		down: false,
		left: false,
		right: false,
		handleUp: function(e) {
			var code = e.keyCode || e.charCode;
			
			switch(code) {
				case 65: keyboardHandler.left = false; break;
				case 68: keyboardHandler.right = false; break;
				case 83: keyboardHandler.down = false; break;
				case 87: keyboardHandler.up = false; break;
			}
		},
		handleDown: function(e) {
			var code = e.keyCode || e.charCode;
			
			switch(code) {
				case 65: keyboardHandler.left = true; break;
				case 68: keyboardHandler.right = true; break;
				case 83: keyboardHandler.down = true; break;
				case 87: keyboardHandler.up = true; break;
			}
		}
}
if (!isMobileFlag) {
	document.addEventListener('keydown', keyboardHandler.handleDown, false);
	document.addEventListener('keyup', keyboardHandler.handleUp, false);
}

