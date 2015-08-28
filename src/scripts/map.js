'use strict';
class Map {
    constructor(option) {
        this.WIDTH = option.width;
        this.HEIGHT = option.width * 0.4;
        this.scale = this.WIDTH / 1000;

        this.canvas = document.createElement('canvas');
        option.container.appendChild(this.canvas);
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.drawSvg('world.svg', 0, 0, this.WIDTH, this.HEIGHT);
        this.mapDate = this.ctx.getImageData(0,0,this.WIDTH,this.HEIGHT);
        this.container = {};
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
        const timestamp = +new Date;
        const startColor = '#21b384';
        const endColor = '#e32528';
        if(this.container[timestamp]) return;// 无奈
        let info = {
            start: start,
            end: end,
            startColor: startColor,
            endColor: endColor,
            duration: 1000,
            radius: 70 + parseInt(Math.random() * 20),
            stage: 0
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
        for(let key of Object.keys(this.container)) {
            const time = now - key;
            const info = this.container[key];
            if(time < info.duration) {
                const r = this.easeOutQuint(time, 0, info.radius, info.duration);
                const offsetx = this.easeOutQuint(time > info.duration / 2 ? time - info.duration / 2 : time , info.start.x, info.end.x - info.start.x, info.duration / 2);
                const offsety = this.easeOutQuint(time > info.duration / 2 ? time - info.duration / 2 : time, info.start.y, info.end.y - info.start.y, info.duration / 2);
                const opacity = this.easeOutQuint(time, 1, -1, info.duration);

                // circle
                this.ctx.globalAlpha = opacity;
                this.ctx.strokeStyle = info.startColor;
                this.ctx.lineWidth = 5;
                this.ctx.beginPath();
                this.ctx.arc(info.start.x, info.start.y, r, 0, 2*Math.PI);
                this.ctx.stroke();

                // line
                this.ctx.globalAlpha = 0.5;
                this.ctx.strokeStyle = info.endColor;
                this.ctx.beginPath();
                time < info.duration / 2 ? this.ctx.moveTo(info.start.x, info.start.y) : this.ctx.moveTo(info.end.x, info.end.y);
                //this.ctx.moveTo(info.start.x, info.start.y);
                this.ctx.lineTo(offsetx, offsety);
                this.ctx.stroke();
            } else if(time < info.duration * 2) {
                const r = this.easeOutQuint(time - info.duration, 0, info.radius, info.duration);
                const offsetx = this.easeOutQuint(time - info.duration, info.start.x, info.end.x - info.start.x, info.duration);
                const offsety = this.easeOutQuint(time - info.duration, info.start.y, info.end.y - info.start.y, info.duration);
                const opacity = this.easeOutQuint(time - info.duration, 1, -1, info.duration);

                // circle
                this.ctx.globalAlpha = opacity;
                this.ctx.strokeStyle = info.endColor;
                this.ctx.lineWidth = 5;
                this.ctx.beginPath();
                this.ctx.arc(info.end.x, info.end.y, r, 0, 2*Math.PI);
                this.ctx.stroke();

                // // line
                // this.ctx.globalAlpha = 0.5;
                // this.ctx.strokeStyle = info.endColor;
                // this.ctx.beginPath();
                // this.ctx.moveTo(info.end.x, info.end.y);
                // this.ctx.lineTo(offsetx, offsety);
                // this.ctx.stroke();
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
     * 经纬度2XY
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
