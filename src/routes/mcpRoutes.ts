import express from 'express';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { rednotePostSchema, createPost } from '../mcps/rednoteTools';
import { transportStorage, transportTokenStorage } from '../misc/storage';

const router = express.Router();

// Initialize MCP server
const server = new McpServer({
    name: "mcp-rednote",
    version: "1.0.0"
});

server.tool(
    "create-post",
    "Create an rednote app post",
    rednotePostSchema,
    createPost
)


router.get("/sse", async (req, res) => {
    const transport = new SSEServerTransport("/mcp/messages", res);
    const { token = "123" }  = req.query;

    await server.connect(transport);

    const { sessionId } = transport

    transportStorage[sessionId] = transport;
    transportTokenStorage[sessionId] = token as string;
   
    res.once("close", () => {
        delete transportStorage[sessionId];
    });
    
    // like flush, see https://nodejs.org/api/http.html#responsewritechunk-encoding-callback
    res.write('');
});

router.post("/messages", async (req, res) => {
    const { sessionId = "" } = req.query
    const transport = transportStorage[sessionId as string];

    if (!transport) {
        res.status(404).send("Transport Not found")
        return;
    }

    await transport.handlePostMessage(req, res);
});

export default router;