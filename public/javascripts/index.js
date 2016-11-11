$(function () {
    var server;
    var vm;
    var vmData = {
        /** 登录用户名 */
        userName: "jch",
        currentUser: {},
        /** 当前用户是否已经登录 */
        isLogin: false,
        /** 在线用户列表 */
        onLineUserArr: [],
        /** 要发送的聊天内容 */
        chatMess: "你好呀~",
        /** 聊天记录对象数组 */
        messArr: []
    };
    var vmMethod = {
        /** 当点击登录按钮时执行登录操作 */
        onLoginClick: function (e) {
            clinetLogin(vm.userName);
        },
        /** 当点击发送消息按钮时发送聊天消息 */
        onSendMessClick: function (e) {
            sendMessage(vm.chatMess);
            vm.chatMess = "";
        }
    };
    var vmComputed = {
        onLineUserText: function () {
            vm = this;
            return vm.onLineUserArr.map(function (u) { return u.name; }).join(",");
        }
    };
    vm = new Vue({
        el: "#main",
        data: vmData,
        methods: vmMethod,
        computed: vmComputed
    });
    /**
     * 浏览器端发起用户登录
     *
     * @param {string} username 用户名
     */
    function clinetLogin(username) {
        server = io.connect('ws://localhost:3000');
        server.emit("login", { name: username }, function (data) {
            vm.currentUser = data.user;
        });
        vm.isLogin = true; //TODO 此处应该改，应该在服务器返回当前用户已经登录后再修改此值
        server.on("login", serverLogin);
        server.on("logout", serverLogout);
        server.on("chat", serverChat);
    }
    /**
     * 收到服务器发来的login，有用户登录通知，更新当前在线用户列表
     *
     * @param {cr.serverLogin} data
     */
    function serverLogin(data) {
        vm.onLineUserArr = data.onLineUserArr;
    }
    /**
     * 收到服务器发来的logout消息，有用户退出登录，更新当前在线用户列表
     *
     * @param {cr.serverLogout} data
     */
    function serverLogout(data) {
        vm.onLineUserArr = data.onLineUserArr;
    }
    /**
     * 向服务器发送聊天内容
     *
     * @param {string} mess 聊天内容
     */
    function sendMessage(mess) {
        server.emit("chat", { message: mess });
    }
    /**
     * 收到服务器发来的chat消息，有用户发送了聊天内容
     *
     * @param {cr.serverChat} data
     */
    function serverChat(data) {
        console.log("onchat:", data);
        vm.messArr.push(createClientMessage(data.message, data.user, data.user.uid == vm.currentUser.uid));
    }
    function createClientMessage(message, user, isMe) {
        return {
            message: message,
            user: user,
            isMe: isMe
        };
    }
    function logout() {
    }
});
//# sourceMappingURL=index.js.map