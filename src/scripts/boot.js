'use strict';

let map = new Map({
    container: document.querySelector('.map'),
    width: screen.width,
    worldmap: worldmap
});

let list = document.querySelector('.list');

let origin = {},
    targets = {},
    realtime = [];

const ws = new WebSocket('ws://mbsd.ipviking.com:443');
ws.onmessage = function(e) {
    let data = JSON.parse(e.data);
    const start = {
        lat: +data['latitude'],
        lon: +data['longitude']
    };
    const end = {
        lat: +data['latitude2'],
        lon: +data['longitude2']
    };
    const oriCountry = worldmap.name[data['countrycode']] || 'Unknow';
    origin[oriCountry] ? origin[oriCountry]++ : origin[oriCountry] = 1;
    const tarCountry = worldmap.name[data['countrycode2']] || 'Unknow';
    targets[tarCountry] ? targets[tarCountry]++ : targets[tarCountry] = 1;

    realtime.push({
        Time: new Date().toLocaleString(),
        Origin: oriCountry,
        Targets: tarCountry,
        Type: services[data['dport']] || 'Unknow'
    });

    if(realtime.length > 8) realtime.shift();

    React.render(
        <Info className="info" origin={ origin } targets={ targets } realtime={ realtime } />,
        list);

    map.trigger(start, end);
};

ws.onerror = function (e) {
    alert('WebSocket发生异常，请重新刷新网页。');
    console.log(e);
};
