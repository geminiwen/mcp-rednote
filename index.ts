import express from "express";
import mcpRoutes from "./src/routes/mcpRoutes.js";
import { getRoutes as getClientRoutes } from "./src/routes/clientRoutes.js";
import expressWS from 'express-ws';

const app = express();
const port = 3001;

const { applyTo: routerWrap} = expressWS(app);

// Register routes
app.use("/mcp", mcpRoutes);
app.use("/client", getClientRoutes(routerWrap));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
