declare namespace cr {
    /**
     * 聊天室的一个用户socket
     */
    interface socketClient extends SocketIO.Socket {
        /**
         * 当前用户GUID
         * 
         * @type {string}
         */
        uid: string;
    }

    /**
     * 聊天室的一个用户实体基类
     */
    interface baseUser {
        /**
         * 用户名 
         * 
         * @type {string}
         */
        name?: string;

        /**
         * 用户的uid，随机字符串
         * 
         * @type {string}
         */
        uid?: string;
    }

    /**
     * 在服务器端的一个用户实体
     * 
     * @interface serverUser
     * @extends {baseUser}
     */
    interface serverUser extends baseUser {
        /**
         * 当前用户的socket连接对象
         * 
         * @type {cr.socketClient}
         */
        socket?: cr.socketClient;
    }

    /**
     * 在浏览器端的一个用户实体
     * 
     * @interface clientUser
     * @extends {baseUser}
     */
    interface clientUser extends baseUser {

    }

    /**
     * 用户发起的login事件传输实体。用户登录操作
     * 
     * @interface clientLogin
     */
    interface clientLogin {
        /**
         * 当前要登录的用户名
         * 
         * @type {string}
         */
        name?: string;
    }

    /**
     * 服务器端发起的login事件传输实体。有新用户登录操作
     * 
     * @interface serverLogin
     */
    interface serverLogin {
        /**
         * 只包含用户名和uid的在线用户数组
         * 
         * @type {cr.user[]}
         */
        onLineUserArr: cr.clientUser[];

        /**
         * 当前登录的用户对象
         * 
         * @type {clientUser}
         */
        user: clientUser;
    }

    /**
     * 浏览器端发起Logout操作传输实体，有用户主动退出登录
     * 
     * @interface clientLogout
     */
    interface clientLogout {

    }

    /**
     * 服务器端发起的Logout事件传输实体，有用户退出登录操作
     * 
     * @interface serverLogout
     */
    interface serverLogout {

        /**
         * 只包含用户名和uid的在线用户数组
         * 
         * @type {cr.user[]}
         */
        onLineUserArr: cr.clientUser[];

        /**
         * 当前退出的用户对象
         * 
         * @type {cr.clientUser}
         */
        user: cr.clientUser;
    }
}