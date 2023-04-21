const fs = require('fs');

fs.readFile('./resource/content.text', (err, data) => {
    if(err) throw err;
    console.log(data.toString());
});

let p = new Promise(function(resolve, reject){
    fs.readFile('./resource/content.text', (err, data) => {
        if(err) throw err;
        resolve(data);
    });
});

p.then(function(res) {
    console.log('--读取文件成功---解析成功----', res.toString());
}, function(err) {
    console.log('===读取文件出错===', err);
});