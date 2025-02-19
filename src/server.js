const Hapi = require('@hapi/hapi');
const routes = require('./routes')
//fungsi localhost 9000
const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*']
            },
        },
    });

    server.route(routes);

    await server.start();
    console.log(`The server is running on ${server.info.uri}`);
};

init();