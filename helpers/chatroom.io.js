"use strict";
var socketio = require("socket.io");
var tool = require("./tool");
var _ = require("underscore");
module.exports = function chatroomio(httpServer) {
    /** 所有房间的在线且已登录用户数组 */
    // var onLineUserArr: cr.serverUser[] = [];
    /** 所有命名空间数组 */
    var namespaceArr = [];
    /** 所有房间字典，内为当前房间的在线登录用户数组 */
    var roomDic = {};
    var server = socketio(httpServer);
    server.on("connection", function (client) {
        console.log("socket.io on connection!一个用户进入");
        //监听新用户加入
        client.on('login', function (data, ack) {
            var roomId = data.roomId;
            //创建全新的一个服务器端User用户
            var user = createServerUser(data.name, client, tool.getGUID(), roomId);
            /** 当前用户所在房间的在线用户列表 */
            var roomUserArr = [];
            //将uid和roomid写入socket对象中
            client.uid = user.uid;
            client.roomId = data.roomId;
            //如果当前没有此房间则创建房间
            if (roomDic[roomId] == undefined) {
                roomDic[roomId] = [];
            }
            roomUserArr = roomDic[roomId];
            //如果当前用户不在所在房间中，则加入房间
            if (!isInRoom(roomId, client)) {
                roomUserArr.push(user);
                client.join(roomId);
            }
            //向当前用户所在的房间的所有用户广播有新用户加入
            var serverLoginData = {
                onLineUserArr: roomUserArr.map(function (u) { return getClientUserByServerUser(u); }),
                user: getClientUserByServerUser(getUser(client))
            };
            ack(serverLoginData);
            client.broadcast.to(roomId).emit('login', serverLoginData); //向所有连接进来的客户端发送有新用户登录通知
            // client.broadcast.emit("login",serverLoginData);//向除了自己以外的所有客户端发送事件
            console.log(data.name + ' 加入了聊天室');
        });
        //监听用户链接断开
        client.on('disconnect', function (data) {
            console.log("disconnect");
            var user = getUser(client);
            if (user == null)
                return;
            logout(user.socket, function () { });
            client.leaveAll();
        });
        //监听用户退出
        client.on('logout', function (data, ack) {
            console.log("logout");
            var user = getUser(client);
            if (user == null)
                return;
            logout(user.socket, ack);
        });
        //监听用户发布聊天内容
        client.on('chat', function (data, ack) {
            //向所有客户端广播发布的消息
            var serverChatData = {
                message: data.message,
                user: getClientUserByServerUser(getUser(client))
            };
            ack(serverChatData);
            client.broadcast.to(client.roomId).emit('chat', serverChatData);
            console.log(serverChatData.user.name + '说：' + serverChatData.message);
        });
    });
    function getUser() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var userArr = [];
        var client;
        var roomId;
        var uid;
        if (args.length == 1) {
            client = args[0];
            if (client.uid === undefined)
                return null;
            roomId = client.roomId;
            uid = client.uid;
            userArr = roomDic[roomId].filter(function (u) { return u.socket === client; });
        }
        else if (args.length == 2) {
            if (typeof args[1] === "string") {
                roomId = args[0];
                uid = args[1];
                userArr = roomDic[roomId].filter(function (u) { return u.uid === uid; });
            }
            else {
                roomId = args[0];
                client = args[1];
                if (client.uid === undefined)
                    return null;
                userArr = roomDic[roomId].filter(function (u) { return u.socket === client; });
            }
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
    function createServerUser(name, socket, uid, roomId) {
        var user = {
            name: name,
            socket: socket,
            uid: uid,
            roomId: roomId
        };
        return user;
    }
    function isInRoom() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return getUser.apply(this, [].slice.call(args)) !== null;
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
    function logout(client, ack) {
        var user = getUser(client);
        if (user == null)
            return false;
        var roomUserArr = roomDic[user.roomId];
        roomUserArr.splice(roomUserArr.indexOf(user), 1);
        client.leave(user.roomId);
        //向所有客户端广播有用户退出
        var logoData = {
            onLineUserArr: roomUserArr.map(function (u) { return getClientUserByServerUser(u); }),
            user: getClientUserByServerUser(user)
        };
        ack(logoData);
        client.broadcast.to(client.roomId).emit('logout', logoData);
        console.log(user.name + '退出了聊天室');
        return true;
    }
    // function serverEmit(event: string, ...args: any[]): SocketIO.Namespace {
    //     return server.emit.apply(server, [].slice.call(arguments));
    // }
};
//# sourceMappingURL=chatroom.io.js.map