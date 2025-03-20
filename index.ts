import express from "express";
import mcpRoutes from "./src/routes/mcpRoutes.js";
import cookieSession from "cookie-session";

const app = express();
const port = 3000;

// app.use(cookieSession({
//   name: 'session',
//   maxAge: 24 * 60 * 60 * 1000, // 24 hours
//   keys: ['key1', 'key2']
// }))

// Register routes
app.use("/mcp", mcpRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
