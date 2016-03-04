'use strict'

let map = new Map({
    container: document.querySelector('.map'),
    width: document.body.clientWidth,
    worldmap: worldmap
})

let list = document.querySelector('.list')

let origin = {}
let targets = {}
let realtime = []

let ws = new WebSocket('ws://map.norsecorp.com/socketcluster/')

ws.onopen = () => {
    ws.send(JSON.stringify({"event":"#handshake","data":{"authToken":null},"cid":1}))
    ws.send(JSON.stringify({"event":"#subscribe","data":{"channel":"global"},"cid":2}))
}

ws.onmessage = (e) => {
    if (e.data === '#1') {
        ws.send('#2')
        return
    } else if (JSON.parse(e.data).event !== '#publish') {
        return
    }

    const data = JSON.parse(e.data).data.data[0]
    const start = {
        lat: +data['latitude'],
        lon: +data['longitude']
    }
    const end = {
        lat: +data['latitude2'],
        lon: +data['longitude2']
    }
    const oriCountry = worldmap.name[data['countrycode']] || 'Unknow'
    origin[oriCountry] ? origin[oriCountry]++ : origin[oriCountry] = 1
    const tarCountry = worldmap.name[data['countrycode2']] || 'Unknow'
    targets[tarCountry] ? targets[tarCountry]++ : targets[tarCountry] = 1

    realtime.push({
        Time: new Date().toLocaleString(),
        Origin: {
            org: data['org'],
            location: data['city'] + ',' + oriCountry,
            ip: data['md5']
        },
        Targets: tarCountry,
        Type: {
            service: data['svc'],
            port: data['dport']
        }
    })

    if(realtime.length > 8) {
        realtime.shift()
    }

    React.render(
        <Info className="info" origin={ origin } targets={ targets } realtime={ realtime } />,
        list)

    map.trigger(start, end)
}

ws.onerror = (e) => {
    alert('WebSocket发生异常，请重新刷新网页。')
    console.log(e)
}
