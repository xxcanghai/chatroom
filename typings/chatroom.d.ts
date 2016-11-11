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
    interface clientEmitLogin {
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
    interface serverEmitLogin {
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
     * 服务器端发起的login确认事件传输实体。通知当前用户登录成功
     * 
     * @interface serverLogin
     */
    interface serverEmitLoginACK {
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
    interface clientEmitLogout {

    }

    /**
     * 服务器端发起的Logout事件传输实体，有用户退出登录操作
     * 
     * @interface serverLogout
     */
    interface serverEmitLogout {

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

    /**
     * 客户端发起的chat事件传输实体，发送聊天内容
     * 
     * @interface clientChat
     */
    interface clientEmitChat {
        /**
         * 客户端发送的聊天文字信息
         * 
         * @type {string}
         * @memberOf clientChat
         */
        message?: string;
    }

    /**
     * 服务器端发起的chat事件的传输实体，向所有人通知有人发送了聊天消息
     * 
     * @interface serverChat
     */
    interface serverEmitChat {
        /**
         * 客户端发送的聊天文字信息
         * 
         * @type {string}
         * @memberOf clientChat
         */
        message?: string;

        /**
         * 当前发出聊天信息的用户对象
         * 
         * @type {cr.clientUser}
         */
        user?: cr.clientUser;
    }

    /**
     * 在浏览器端的消息对象实体
     * 
     * @interface clientMessage
     */
    interface clientMessage{
        /**
         * 客户端发送的聊天文字信息
         * 
         * @type {string}
         * @memberOf clientChat
         */
        message?: string;

        /**
         * 发出此聊天信息的用户对象
         * 
         * @type {cr.clientUser}
         */
        user?: cr.clientUser;

        /**
         * 当前消息对象是否为我自己说的话
         * 
         * @type {boolean}
         * @memberOf clientMessage
         */
        isMe?:boolean;
    }
}