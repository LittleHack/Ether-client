let config = {
    staging: {
        env: 'staging',
        port: process.env.SERVER_PORT || 3000,
        db: process.env.MONGO_STRING || 'mongodb://127.0.0.1:27017/db',
        keystorePath: process.env.KEYSTORE_PATH || './keystore',
        node_host: process.env.NODE_HOST || 'https://kovan.infura.io/v3/b7c131ea94f54d45b80e230f68fc4e71'
    },
    default: {
        env: 'development',
        port: process.env.SERVER_PORT || 3000,
        db: process.env.MONGO_STRING || 'mongodb://127.0.0.1:27017/db',
        keystorePath: process.env.KEYSTORE_PATH || './keystore',
        node_host: process.env.NODE_HOST || 'https://kovan.infura.io/v3/b7c131ea94f54d45b80e230f68fc4e71'
    },
    test: {
        env: 'test',
        port: 4000,
        db: process.env.MONGO_STRING || 'mongodb://127.0.0.1:27017/db',
        keystorePath: process.env.KEYSTORE_PATH || './keystore',
        node_host: process.env.NODE_HOST || 'https://kovan.infura.io/v3/b7c131ea94f54d45b80e230f68fc4e71'
    }
}

exports.get = function get(env) {
    return config[env] || config.default;
};