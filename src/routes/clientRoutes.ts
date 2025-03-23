import express from 'express';
import { registry } from "../misc/storage";

const router = express.Router();


export const getRoutes = function(cb: Function) {
    cb(router);

    router.ws('/', (ws, req) => {
        const { token } = req.query;
        console.log(`${token} 登录`)
    
        if (typeof token !== 'string') {
            return;
        }
    
        registry[token] = ws;
    
        ws.on('close', () => {
            delete registry[token];
        })
    
        ws.send(JSON.stringify({
            type: "message",
            payload: "Hello"
        }));
        
    });

    return router;
}

