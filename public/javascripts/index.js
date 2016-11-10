$(function () {
    var server;
    var vm;
    var vmData = {
        userName: "jch",
        isLogin: false,
        onLineUserArr: []
    };
    var vmMethod = {
        onLoginClick: function () {
            clinetLogin(vm.userName);
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
        server.emit("login", { name: username });
        vm.isLogin = true; //TODO 此处应该改，应该在服务器返回当前用户已经登录后再修改此值
        server.on("login", serverLogin);
        server.on("logout", serverLogout);
    }
    /**
     * 收到服务器发来的login，有用户登录通知，更新当前在线用户列表
     *
     * @param {cr.serverLogin} data
     */
    function serverLogin(data) {
        vm.onLineUserArr = data.onLineUserArr;
    }
    function serverLogout(data) {
        vm.onLineUserArr = data.onLineUserArr;
    }
    function logout() {
    }
});
//# sourceMappingURL=index.js.map