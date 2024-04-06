const z = require("zod");
const axios = require('axios');

function jb(e) {
    return Object.keys(e).map((t => ({
        key: t,
        value: (!1 === e[t] ? 'false' : e[t] || '').toString()
    }))).sort(((e, t) => e.key < t.key ? -1 : e.key > t.key ? 1 : 0)).map((e => e.value)).join('');
}

function wb(e) {
    return e.split('?')[0].replace(/^[^/]*\/\/[^/]+\//, '/');
}

const _b = [22, 4147, 1234, 11]
    , Ib = _b[0] + _b[3]
    , Cb = _b[1] + _b[2];

function kb(e, t, r, s = '') {
    const a = jb(t);
    return Ob(wb(e) + a + s + r);
}

function Ob(e) {
    const t = e.length;
    let r = Cb;
    for (let s = 0; s < t; s += 1)
        r = r * Ib + e.charCodeAt(s),
            r >>>= 0;
    return r;
}

const getR = (l) => {
    const n = 'https://routing.api.2gis.com/carrouting/6.0.0/global';
    const u = 'rurbbn3446';
    const d = 'baf4c54e9dae';
    return kb(n, u, d, JSON.stringify(l));
};

const pointGuard = z.object({
    x: z.number(),
    y: z.number(),
});


const typeGuard = z.object({
    points: pointGuard.array().length(2),
    viewport: z.object({
        topLeft: pointGuard,
        bottomRight: pointGuard,
        zoom: z.number()
    }),
});


const generate = async ({viewport, points}) => {
    const data = {
        'locale': 'ru',
        'point_a_name': 'Source',
        'point_b_name': 'Target',
        'points': points.map(item => ({...item, type: "pedo"})),
        'purpose': 'autoSearch',
        'type': 'online5',
        'viewport': viewport
    };
    return axios.post(
        'https://routing.api.2gis.com/carrouting/6.0.0/global',
        data,
        {
            params: {
                'key': 'rurbbn3446',
                'r': getR(data)
            },
            headers: {
                'authority': 'routing.api.2gis.com',
                'accept-language': 'ru,en;q=0.9',
                'cache-control': 'no-cache',
                'origin': 'https://2gis.ru',
                'pragma': 'no-cache',
                'referer': 'https://2gis.ru/',
                'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "YaBrowser";v="24.1", "Yowser";v="2.5"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'cross-site',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 YaBrowser/24.1.0.0 Safari/537.36'
            }
        }
    ).then((response) => response.data.result.map((item) => {
        return {
            ...item,
            path: item.maneuvers[0].outcoming_path.geometry
        }
    }));
};

module.exports = {
    typeGuard,
    generate
}
