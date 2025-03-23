import express from "express";
import mcpRoutes from "./src/routes/mcpRoutes.js";
import toolsRoutes from "./src/routes/toolsRoutes.js";
import { getRoutes as getClientRoutes } from "./src/routes/clientRoutes.js";
import expressWS from 'express-ws';
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const port = 3001;

const { applyTo: routerWrap} = expressWS(app);

// Register routes
app.use("/mcp", mcpRoutes);
app.use("/tools", toolsRoutes);
app.use("/client", getClientRoutes(routerWrap));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
