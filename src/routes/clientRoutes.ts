import express from 'express';
import type ws from 'ws'

const router = express.Router();
export const registry: {
    [key: string]: ws.WebSocket; 
} = {};

export const getRoutes = function(cb: Function) {
    cb(router);

    router.ws('/', (ws, req) => {
        const { token } = req.query;
    
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

