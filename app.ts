import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as socketio from 'socket.io';//websocket库
import * as AV from 'leanengine';


var enrouten = require('express-enrouten');
var app: express.Express = express();


// var server: http.Server = http.createServer(app);
// var io: SocketIO.Server = socketio(http);

// io.on("connection", function (socket: SocketIO.Socket) {
//     console.log("socket.io on connection!");
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(enrouten({ directory: 'routes' }));


// catch 404 and forward to error handler
app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
    var err = new Error('Not Found');
    (<any>err).status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status((<any>err).status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status((<any>err).status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
