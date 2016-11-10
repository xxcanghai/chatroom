"use strict";
var socketio = require('socket.io');
var tool = require('./tool');
var _ = require("underscore");
module.exports = function chatroomio(httpServer) {
    /** 在线且已登录用户 */
    var onLineUserArr = [];
    var server = socketio(httpServer);
    server.on("connection", function (client) {
        console.log("socket.io on connection!一个用户进入");
        // onConnArr.push(client);
        //监听新用户加入
        client.on('login', function (data) {
            //将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
            var user = createServerUser(data.name, client, tool.getGUID());
            client.uid = user.uid;
            if (onLineUserArr.filter(function (u) { return u.uid === client.uid; }).length == 0) {
                onLineUserArr.push(user);
            }
            //向所有客户端广播用户加入
            var serverLoginData = {
                onLineUserArr: onLineUserArr.map(function (u) { return getClientUserByServerUser(u); }),
                user: data
            };
            server.emit('login', serverLoginData);
            console.log(data.name + ' 加入了聊天室');
        });
        //监听用户退出
        client.on('disconnect', function (data) {
            console.log("disconnect");
            var user = getUser(client);
            if (user == null)
                return;
            logout(user.uid);
        });
        //监听用户退出
        client.on('logout', function (data) {
            console.log("logout");
            var user = getUser(client);
            if (user == null)
                return;
            logout(user.uid);
        });
        // //监听用户发布聊天内容
        // client.on('message', function (obj) {
        //     //向所有客户端广播发布的消息
        //     io.emit('message', obj);
        //     console.log(obj.username + '说：' + obj.content);
        // });
    });
    function getUser(arg) {
        var userArr = [];
        if (typeof arg === "string") {
            userArr = onLineUserArr.filter(function (u) { return u.uid === arg; });
        }
        else {
            userArr = onLineUserArr.filter(function (u) { return u.socket === arg; });
        }
        if (userArr.length > 0) {
            return userArr[0];
        }
        else {
            return null;
        }
    }
    /**
     * 创建一个服务器的用户实体
     *
     * @param {string} name
     * @param {cr.socketClient} socket
     * @param {string} uid
     * @returns
     */
    function createServerUser(name, socket, uid) {
        var user = {
            name: name,
            socket: socket,
            uid: uid
        };
        return user;
    }
    /**
     * 根据一个服务器用户返回一个浏览器用户对象
     *
     * @param {cr.serverUser} serverUser 服务器用户对象
     * @returns {cr.clientUser}
     */
    function getClientUserByServerUser(serverUser) {
        var clientUser = _.extend({}, serverUser);
        delete clientUser.socket;
        return clientUser;
    }
    function logout(uid) {
        var user = getUser(uid);
        if (user == null)
            return false;
        onLineUserArr.splice(onLineUserArr.indexOf(user), 1);
        //向所有客户端广播有用户退出
        server.emit('logout', {
            onLineUserArr: onLineUserArr.map(function (u) { return getClientUserByServerUser(u); }),
            user: getClientUserByServerUser(user)
        });
        console.log(user.name + '退出了聊天室');
        return true;
    }
};
//# sourceMappingURL=chatroom.io.js.map