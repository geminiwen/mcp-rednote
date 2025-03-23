import { z } from "zod";
import { registry } from "../misc/storage"
import type { CallToolResult } from '@modelcontextprotocol/sdk/types'
import { transportTokenStorage } from '../misc/storage'

export const rednotePostSchema = {
    title: z.string(),
    content: z.string(),
    covers: z.array(z.string()),
    tags: z.array(z.string()).optional().describe("Tags of the post")
};

type CreatePostToolFunction = (args: {
    title: string,
    content: string,
    tags?: string[],
    covers: string[]
}, context: { sessionId?: string }) => CallToolResult | Promise<CallToolResult>


export const createPost: CreatePostToolFunction = async (
    { title, content, covers, tags = [] }, { sessionId }
) => {
    if (!sessionId) {
        return {
            content: [{
                type: "text",
                text: "There is no client connected, so publish failed"
            }]
        };
    }

    const token = transportTokenStorage[sessionId];
    const channel = registry[token];

    if (!channel) {
        return {
            content: [{
                type: "text",
                text: "There is no client connected, so publish failed"
            }]
        };
    }

    const job = new Promise<Record<string, any>>((resolve) => {
        channel.send(JSON.stringify({
            type: "task",
            payload: {
                action: "createPost",
                config: {
                    title,
                    tags,
                    content,
                    covers,
                    type: "image"
                }
            }
        }));
    
        channel.once("message", (data) => {
            const result = data.toString();
            resolve(JSON.parse(result));
        });
    });

    const result = await job;


    return {
        content: [{
            type: "text",
            text: JSON.stringify(result)
        }]
    };
};