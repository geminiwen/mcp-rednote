import express from 'express';
import { getForecast, weatherSchema } from '../mcps/weatherController.js';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

const router = express.Router();

// Initialize MCP server
const server = new McpServer({
    name: "mcp-rednote",
    version: "1.0.0"
});

server.tool(
    "get-forecast",
    "Get weather forecast for a location",
    weatherSchema,
    getForecast
);

const transportStorage: { 
    [key:string]: SSEServerTransport 
} = {};

router.get("/sse", async (req, res) => {
    const transport = new SSEServerTransport("/mcp/messages", res);
    await server.connect(transport);

    const { sessionId } = transport

    transportStorage[sessionId] = transport;
   
    res.once("close", () => {
        delete transportStorage[sessionId];
    });
    
    // like flush, see https://nodejs.org/api/http.html#responsewritechunk-encoding-callback
    res.write('');
});

router.post("/messages", async (req, res) => {
    const { sessionId = "" } = req.query
    const transport = transportStorage[sessionId as string];

    await transport.handlePostMessage(req, res);
});

export default router;