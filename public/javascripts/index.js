$(function () {
    var server;
    var vm;
    /** 聊天服务器地址 */
    var chatServerUrl = location.protocol + "//localhost:3000";
    var vmData = {
        /** 登录用户名 */
        userName: "jch",
        /** 房间号 */
        roomId: "1001",
        /** 当前在线用户列表 */
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
    var vmWatch = {};
    vm = new Vue({
        el: "#main",
        data: vmData,
        methods: vmMethod,
        computed: vmComputed
    });
    /** 系统消息用户 */
    var systemUser = {
        name: "system",
        uid: "-1",
        roomId: "-1"
    };
    /**
     * 浏览器端发起用户登录
     *
     * @param {string} username 用户名
     */
    function clinetLogin(username) {
        server = io(chatServerUrl, {});
        server.emit("login", { name: username, roomId: vm.roomId }, function (data) {
            //当前用户登录成功
            console.log("当前用户登录成功");
            vm.currentUser = data.user;
            vm.onLineUserArr = data.onLineUserArr;
            vm.roomId = data.user.roomId;
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
        vm.messArr.push(createSystemMessage("新用户<" + data.user.name + ">登录，房间ID:" + data.user.roomId));
    }
    /**
     * 收到服务器发来的logout消息，有用户退出登录，更新当前在线用户列表
     *
     * @param {cr.serverLogout} data
     */
    function serverLogout(data) {
        vm.onLineUserArr = data.onLineUserArr;
        vm.messArr.push(createSystemMessage("用户<" + data.user.name + ">退出"));
    }
    /**
     * 向服务器发送聊天内容
     *
     * @param {string} mess 聊天内容
     */
    function sendMessage(mess) {
        server.emit("chat", { message: mess }, serverChat);
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
    function createSystemMessage(message) {
        return createClientMessage(message, systemUser, false, "system");
    }
    function createClientMessage(message, user, isMe, type) {
        if (isMe === void 0) { isMe = false; }
        if (type === void 0) { type = "chat"; }
        return {
            message: message,
            user: user,
            isMe: isMe,
            type: type
        };
    }
    function logout() {
    }
});
//# sourceMappingURL=index.js.map