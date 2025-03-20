import { z } from "zod";
import { registry } from "../routes/clientRoutes"
import type { CallToolResult } from '@modelcontextprotocol/sdk/types'
import { transportTokenStorage } from '../misc/storage'

export const rednotePostSchema = {
    title: z.string(),
    content: z.string(),
    images: z.array(z.string()),
};

type CreatePostToolFunction = (args: {
    title: string,
    content: string,
    images: string[]
}, context: { sessionId?: string }) => CallToolResult | Promise<CallToolResult>


export const createPost: CreatePostToolFunction = async (
    { title, content, images }, { sessionId }
) => {
    if (!sessionId) {
        return {
            content: [{
                type: "text",
                text: "There is no client, so publish failed"
            }]
        };
    }

    const token = transportTokenStorage[sessionId];
    const channel = registry[token];

    if (!channel) {
        return {
            content: [{
                type: "text",
                text: "There is no client, so publish failed"
            }]
        };
    }

    const job = new Promise<string>((resolve) => {
        channel.send(JSON.stringify({
            type: "createPost",
            payload: {
                title,
                content,
                images
            }
        }));
    
        channel.once("message", (data) => {
            const result = data.toString();
            resolve(result);
        });
    });

    const result = await job;

    return {
        content: [{
            type: "text",
            text: result
        }]
    };
};