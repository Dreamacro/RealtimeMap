'use strict';
class Map {
    constructor(option) {
        this.WIDTH = option.width;
        this.HEIGHT = option.width * 0.4;
        this.scale = this.WIDTH / 1000;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        option.container.appendChild(this.canvas);

        this.ctx.drawSvg('world.svg', 0, 0, this.WIDTH, this.HEIGHT);
        this.mapDate = this.ctx.getImageData(0, 0, this.WIDTH,this.HEIGHT);
        this.container = {};

        this.particles = {}
        this.particle = (() => {
          let nextIndex = 0;
          return (x,y,r,o,c,xv,yv,rv,ov) => {
            this.particles[++nextIndex] = {
              index: nextIndex,
              x: x,
              y: y,
              r: r,
              o: o,
              c: c,
              xv: xv,
              yv: yv,
              rv: rv,
              ov: ov
            };
          };
        })();
        this.count = 0;// queue总数
    }

    /**
     * 触发动画
     * @param  {Object} start
     * @param  {Object} end
     * @return {null}
     */
    trigger(start, end) {
        start = this.getXY(start);
        end = this.getXY(end);
        const timestamp = +new Date,
              startColor = '#21b384',
              endColor = '#e32528',
              particleColor = '#F8BD19';
        if(this.container[timestamp]) return;// 无奈
        let info = {
            start: start,
            end: end,
            startColor: startColor,
            endColor: endColor,
            particleColor: particleColor,
            duration: 1000,
            radius: 70 + parseInt(Math.random() * 20),
            stage: 0,
            xv: (start.x - end.x) / 500,
            yv: (start.y - end.y) / 500
        }
        this.container[timestamp] = info;
        if(!(this.count)++) {
            this.draw();
        }
    }

    clear() {
        this.ctx.clearRect(0,0,this.WIDTH,this.HEIGHT);
        this.ctx.putImageData(this.mapDate, 0, 0);
    }

    /**
     * 渲染
     * @return {null}
     */
    draw() {
        const now = +new Date;
        this.clear();

        // particles
        for(let key of Object.keys(this.particles)) {
            let p = this.particles[key];
            this.ctx.beginPath();
            this.ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
            this.ctx.globalAlpha = p.o;
            this.ctx.fillStyle = p.c;
            this.ctx.fill();
            p.x += p.xv;
            p.y += p.yv;
            p.r += p.rv;
            p.o += p.ov;
            if(p.r < 0 || p.o < 0) delete this.particles[p.index];
        }

        // fireballs
        for(let key of Object.keys(this.container)) {
            const time = now - key;
            const info = this.container[key];
            if(time < info.duration) {
                const r = this.easeOutQuint(time, 0, info.radius, info.duration);
                const offsetx = info.start.x + time / info.duration * (info.end.x - info.start.x); //this.easeOutQuint(time, info.start.x, info.end.x - info.start.x, info.duration);
                const offsety = info.start.y + time / info.duration * (info.end.y - info.start.y);//this.easeOutQuint(time, info.start.y, info.end.y - info.start.y, info.duration);
                const opacity = this.easeOutQuint(time, 1, -1, info.duration);

                // circle
                this.ctx.globalAlpha = opacity;
                this.ctx.strokeStyle = info.startColor;
                this.ctx.lineWidth = 5;
                this.ctx.beginPath();
                this.ctx.arc(info.start.x, info.start.y, r, 0, 2*Math.PI);
                this.ctx.stroke();

                let numParticles = Math.sqrt(info.xv*info.xv+info.yv*info.yv)/5;
                if(numParticles<1)numParticles=1;
                let numParticlesInt = Math.ceil(numParticles),
                    numParticlesDif = numParticles/numParticlesInt;
                for(let j=0;j<numParticlesInt;j++) {
                  this.particle(
                    offsetx-info.xv*j/numParticlesInt,
                    offsety-info.yv*j/numParticlesInt,
                    7,
                    numParticlesDif,
                    info.particleColor,
                    Math.random()*0.6,
                    Math.random()*0.6,
                    -0.3,
                    -0.05*numParticlesDif
                  );
                }
            } else if(time < info.duration * 2) {
                const r = this.easeOutQuint(time - info.duration, 0, info.radius, info.duration);
                const opacity = this.easeOutQuint(time - info.duration, 1, -1, info.duration);

                // circle
                this.ctx.globalAlpha = opacity;
                this.ctx.strokeStyle = info.endColor;
                this.ctx.lineWidth = 5;
                this.ctx.beginPath();
                this.ctx.arc(info.end.x, info.end.y, r, 0, 2*Math.PI);
                this.ctx.stroke();
            } else {
                delete this.container[key];
                this.count--;
            }
        }
        if(this.count) {
            window.requestAnimationFrame(this.draw.bind(this));
        }
    }

    /**
     * 经纬度 to XY
     * @param  {Object} option
     * @return {Object}
     */
    getXY (option) {
        return {
            x: (option.lon * 2.6938 + 465.4) * this.scale,
            y: (option.lat * -2.6938 + 227.066) * this.scale
        };
    };

    /**
     * 缓动函数
     * @param  {Number} t 准确时间
     * @param  {Number} b 开始值
     * @param  {Number} c 改变值
     * @param  {Number} d 总时间
     * @return {Number}   value
     */
     easeOutQuint (t, b, c, d) {
 		return c * Math.sin(t/d * (Math.PI/2)) + b;
 	}
}
