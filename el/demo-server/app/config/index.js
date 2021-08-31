const path = require('path');


function loadConfigs(app) {
    let obj = require('require-all')({
        dirname: __dirname,
        filter: /(.+)\.api\.js$/,
        resolve: function (fn) {
            return fn(app);
        }
    });
    app.DemoConfig = obj;
}

module.exports = loadConfigs

