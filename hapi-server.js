'use strict';

const Hapi = require('@hapi/hapi');


const adapter=require('./controller-adapter').adaptHapi 
const {testController} = require("./controller")


const init = async () => {

    const server = Hapi.server({
        port: 4000,
        host: 'localhost'
    });

    const makeRequestHandler = (httpController) => {
        return (req,h) => {
        const res =h.response()
          try {
          const httpRequest=adapter(req);
          const response=httpController(httpRequest)

        
          res.code(response.code) 
          return response.result;
        } catch (err) {
          res.code(500)
          return err;
        }
      }
      }


    server.route({
        method: 'GET',
        path: '/',
        handler: makeRequestHandler(testController)
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();