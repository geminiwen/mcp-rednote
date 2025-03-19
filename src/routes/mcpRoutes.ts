import express from 'express';
import { getForecast, weatherSchema } from '../controllers/weatherController.js';
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

router.get("/sse", async (req, res) => {
    const transport = new SSEServerTransport("/sse/messages", res);
    await server.connect(transport);
});

router.post("/messages", async (req, res) => {
    // Note: to support multiple simultaneous connections, these messages will
    // need to be routed to a specific matching transport. (This logic isn't
    // implemented here, for simplicity.)
    console.dir("??")
    // await transport.handlePostMessage(req, res);
});

export default router;