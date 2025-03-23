

import express from 'express';
import { registry } from "../misc/storage"

const router = express.Router();

router.post("/create_rednote_post", async (req, res) => {
    const { title, content, tags, covers, token } = req.body;
    const channel = registry[token];

    if (!channel) {
        console.log(`No client for ${token}`)
        res.json({
            content: [{
                type: "text",
                text: "There is no client connected, so publish failed"
            }]
        });
        return;
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

    res.json({
        content: [{
            type: "text",
            text: JSON.stringify(result)
        }]
    });
});

export default router;