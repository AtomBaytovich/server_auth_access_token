module.exports = {
    apps: [{
        name: 'app',
        script: 'index.js',
        node_args: '-r dotenv/config',
        env: {
            NODE_ENV: 'production',
            PORT: 5000
        }
    }],
}