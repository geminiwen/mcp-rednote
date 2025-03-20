import type { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

export const transportStorage: { 
    [sessionId:string]: SSEServerTransport 
} = {};

export const transportTokenStorage: {
    [sessionId:string]: string
} = {};