const createError = require('http-errors');

const errorFlag = 'topLevelError';
let app;

function initialize(a){
    if(app === undefined) app = a;
}

function middleware(req, res, next) {
    if(app.enabled(errorFlag)) next(createError(500))
    else next();
}

function trigger(){ app.enable(errorFlag);}
function stop(){ app.disable(errorFlag);}
function enabled() { return app.enabled(errorFlag);}

module.exports = {
    initialize,
    middleware,
    trigger,
    stop,
    enabled,
};