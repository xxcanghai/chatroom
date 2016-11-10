import * as  socketio from 'socket.io';
import * as http from 'http';
import * as tool from './tool';
import * as _ from "underscore";

export = function chatroomio(httpServer: http.Server) {

    /** 在线且已登录用户 */
    var onLineUserArr: cr.serverUser[] = [];

    var server: SocketIO.Server = socketio(httpServer);

    server.on("connection", function (client: cr.socketClient) {
        console.log("socket.io on connection!一个用户进入");
        // onConnArr.push(client);


        //监听新用户加入
        client.on('login', function (data: cr.clientLogin) {
            //将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
            var user = createServerUser(data.name, client, tool.getGUID());
            client.uid = user.uid;

            if (onLineUserArr.filter(u => u.uid === client.uid).length == 0) {
                onLineUserArr.push(user);
            }

            //向所有客户端广播用户加入
            var serverLoginData: cr.serverLogin = {
                onLineUserArr: onLineUserArr.map(u => getClientUserByServerUser(u)),
                user: data
            };
            server.emit('login', serverLoginData);
            console.log(data.name + ' 加入了聊天室');
        });

        //监听用户退出
        client.on('disconnect', function (data: string) {
            console.log("disconnect");
            var user = getUser(client);
            if (user == null) return;
            logout(user.uid);
        });

        //监听用户退出
        client.on('logout', function (data: cr.clientLogout) {
            console.log("logout");
            var user = getUser(client);
            if (user == null) return;
            logout(user.uid);
        });

        // //监听用户发布聊天内容
        // client.on('message', function (obj) {
        //     //向所有客户端广播发布的消息
        //     io.emit('message', obj);
        //     console.log(obj.username + '说：' + obj.content);
        // });
    });

    /**
     * 根据Socket返回当前用户信息
     * 
     * @param {cr.socketClient|string} socket
     * @returns {cr.user}
     */
    function getUser(socket: cr.socketClient): cr.serverUser;
    /**
     * 根据uid返回当前用户信息
     * 
     * @param {cr.socketClient|string} socket
     * @returns {cr.user}
     */
    function getUser(uid: string): cr.serverUser;
    function getUser(arg: cr.socketClient | string): cr.serverUser {
        var userArr: cr.serverUser[] = [];
        if (typeof arg === "string") {
            userArr = onLineUserArr.filter(u => u.uid === arg);
        } else {
            userArr = onLineUserArr.filter(u => u.socket === arg);
        }
        if (userArr.length > 0) {
            return userArr[0];
        } else {
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
    function createServerUser(name: string, socket: cr.socketClient, uid: string) {
        var user: cr.serverUser = {
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
    function getClientUserByServerUser(serverUser: cr.serverUser): cr.clientUser {
        var clientUser: cr.clientUser = _.extend({}, serverUser);
        delete (<cr.serverUser>clientUser).socket;
        return clientUser;
    }

    function logout(uid: string): boolean {
        var user = getUser(uid);
        if (user == null) return false;
        onLineUserArr.splice(onLineUserArr.indexOf(user), 1);

        //向所有客户端广播有用户退出
        server.emit('logout', <cr.serverLogout>{
            onLineUserArr: onLineUserArr.map(u => getClientUserByServerUser(u)),
            user: getClientUserByServerUser(user)
        });
        console.log(user.name + '退出了聊天室');
        return true;
    }
}
