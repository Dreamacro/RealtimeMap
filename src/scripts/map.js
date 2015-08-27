'use strict';
class Map {
    constructor(option) {
        this.scale = option.width / 1000;
        this.svg = this.createSVGElement('svg', {
            width: option.width,
            height: option.height
        });
        option.container.appendChild(this.svg);
        for (let country of Object.keys(option.worldmap.shapes)) {
            const path = this.createSVGElement('path', {
                stroke: "#ccc6ae",
                fill: "#000",
                d: option.worldmap.shapes[country],
                transform: `scale(${ this.scale })`
            });
            this.svg.appendChild(path);
        }

        this.container = {};
        this.count = 0;// queue总数
    }

    /**
     * SVGElement
     * @param  {String} name
     * @param  {Object} attr
     * @return {Element}
     */
    createSVGElement(name, attr) {
        let ele =  document.createElementNS('http://www.w3.org/2000/svg', name);
        return this.setAttr(ele, attr);
    }

    /**
     * set attr
     * @param {Element} ele
     * @param {Object} attr
     */
    setAttr(ele, attr) {
        for(let key of Object.keys(attr)) {
            ele.setAttribute(key, attr[key]);
        }
        return ele;
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
        let option = {
            'stroke-width': 2,
            'fill:': 'none',
            r: 0,
            opacity: 1
        }
        let startCircle = this.createSVGElement('circle', option);
        let endCircle = this.createSVGElement('circle', option);
        option = {
            stroke: endColor,
            'stroke-width': 5,
            opacity: 0.5,
            'stroke-linecap': 'round',
            d: `M${ start.cx } ${ start.cy } L${ end.cx } ${ end.cy }`
        }
        let line = this.createSVGElement('path', option);
        const totalLength = line.getTotalLength();
        this.setAttr(line, {
            'stroke-dasharray': totalLength,
            'stroke-dashoffset': totalLength
        });
        this.setAttr(startCircle, {
            stroke: startColor,
            cx: start.cx,
            cy: start.cy
        });
        this.setAttr(endCircle, {
            stroke: endColor,
            cx: end.cx,
            cy: end.cy
        });
        this.svg.appendChild(startCircle);
        this.svg.appendChild(endCircle);
        this.svg.appendChild(line);
        let info = {
            startCircle: startCircle,
            endCircle: endCircle,
            path: line,
            totalLength: totalLength,
            duration: 1000,
            radius: 70 + parseInt(Math.random() * 20),
            stage: 0
        }
        this.container[timestamp] = info;
        if(!(this.count)++) {
            this.draw();
        }
    }

    /**
     * 渲染
     * @return {null}
     */
    draw() {
        const now = +new Date;
        for(let key of Object.keys(this.container)) {
            const time = now - key;
            const info = this.container[key];
            if(time < info.duration) {
                const r = this.easeOutQuint(time, 0, info.radius, info.duration);
                const dashoffset = this.easeOutQuint(time, info.totalLength, -2 * info.totalLength, info.duration);
                const opacity = this.easeOutQuint(time, 1, -1, info.duration);
                this.setAttr(info.startCircle, {
                    r: r,
                    opacity: opacity
                });
                this.setAttr(info.path, {
                    'stroke-dashoffset': dashoffset
                });
            } else if(time < info.duration * 2) {
                if(info.stage === 0) {
                    this.svg.removeChild(info.startCircle);
                    this.svg.removeChild(info.path);
                    info.stage = 1;
                }
                const r = this.easeOutQuint(time - info.duration, 0, info.radius, info.duration);
                const opacity = this.easeOutQuint(time - info.duration, 1, -1, info.duration);
                this.setAttr(info.endCircle, {
                    r: r,
                    opacity: opacity
                });
            } else {
                this.svg.removeChild(info.endCircle);
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
            cx: (option.lon * 2.6938 + 465.4) * this.scale,
            cy: (option.lat * -2.6938 + 227.066) * this.scale
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
