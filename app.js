// 動作確認用HTMLサーバ(結構適当)
// 要:node.jsのインストール
// node app.jsを実行してブラウザでlocalhost:8000でアクセス

'use strict';
const http = require('http');
const pug = require('pug');
const server = http.createServer((req, res) => {
    // debug
//    console.log(`${req.method} ${req.url}`);
    
    // 結構適当
    // index.htmlに必要なものだったらパイプで渡して読み込む
    if (   (req.method === 'GET')
        && (   (req.url === '/favicon.ico')
            || (req.url === '/YuyuyuiStaminaCalc.css')
            || (req.url === '/YuyuyuiStaminaCalc.js') ) ) {
        const fs = require('fs');
        const rs = fs.createReadStream(`.${req.url}`);
        rs.pipe(res);
    }
    // それ以外はindex.htmlを出力
    else {
        res.writeHead(200, {
            'Content-type': 'text/html; charset=utf-8'
        });
        res.write(pug.renderFile('./pages.pug'));
        res.end();
    }
})

const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log('Listening on ' + port);
});
