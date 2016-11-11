$(function () {
    var server: SocketIOClient.Socket;
    var vm: vuejs.Vue & typeof vmData & typeof vmMethod & typeof vmComputed;

    var vmData = {
        /** 登录用户名 */
        userName: "jch",
        currentUser: <cr.clientUser>{},
        /** 当前用户是否已经登录 */
        isLogin: false,
        /** 在线用户列表 */
        onLineUserArr: <cr.clientUser[]>[],
        /** 要发送的聊天内容 */
        chatMess: "你好呀~",
        /** 聊天记录对象数组 */
        messArr: <cr.clientMessage[]>[]
    };

    var vmMethod = {
        /** 当点击登录按钮时执行登录操作 */
        onLoginClick: function (e: JQueryMouseEventObject) {
            clinetLogin(vm.userName);
        },
        /** 当点击发送消息按钮时发送聊天消息 */
        onSendMessClick: function (e: JQueryMouseEventObject) {
            sendMessage(vm.chatMess);
            vm.chatMess = "";
        }
    };

    var vmComputed = {
        onLineUserText: <string>(<any>function () {
            vm = this;
            return vm.onLineUserArr.map(u => u.name).join(",");
        }),
    };

    vm = <any>new Vue({
        el: "#main",
        data: vmData,
        methods: vmMethod,
        computed: <any>vmComputed
    });


    /**
     * 浏览器端发起用户登录
     * 
     * @param {string} username 用户名
     */
    function clinetLogin(username: string) {
        server = io.connect('ws://localhost:3000');
        server.emit("login", <cr.clientEmitLogin>{ name: username }, function (data: cr.serverEmitLoginACK) {
            vm.currentUser = data.user;
        });

        vm.isLogin = true;//TODO 此处应该改，应该在服务器返回当前用户已经登录后再修改此值
        server.on("login", serverLogin);
        server.on("logout", serverLogout);
        server.on("chat", serverChat);
    }

    /**
     * 收到服务器发来的login，有用户登录通知，更新当前在线用户列表
     * 
     * @param {cr.serverLogin} data
     */
    function serverLogin(data: cr.serverEmitLogin) {
        vm.onLineUserArr = data.onLineUserArr;
    }


    /**
     * 收到服务器发来的logout消息，有用户退出登录，更新当前在线用户列表
     * 
     * @param {cr.serverLogout} data
     */
    function serverLogout(data: cr.serverEmitLogout) {
        vm.onLineUserArr = data.onLineUserArr;
    }

    /**
     * 向服务器发送聊天内容
     * 
     * @param {string} mess 聊天内容
     */
    function sendMessage(mess: string) {
        server.emit("chat", <cr.clientEmitChat>{ message: mess });
    }

    /**
     * 收到服务器发来的chat消息，有用户发送了聊天内容
     * 
     * @param {cr.serverChat} data
     */
    function serverChat(data: cr.serverEmitChat) {
        console.log("onchat:", data);
        vm.messArr.push(createClientMessage(data.message, data.user, data.user.uid == vm.currentUser.uid));
    }

    function createClientMessage(message: string, user: cr.clientUser, isMe: boolean): cr.clientMessage {
        return {
            message: message,
            user: user,
            isMe: isMe
        };
    }

    function logout() {

    }

});