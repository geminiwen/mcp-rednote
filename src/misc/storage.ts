import type { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import type ws from 'ws'

export const transportStorage: { 
    [sessionId:string]: SSEServerTransport 
} = {};

export const transportTokenStorage: {
    [sessionId:string]: string
} = {};

export const registry: {
    [key: string]: ws.WebSocket; 
} = {};