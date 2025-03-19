import express from "express";
import mcpRoutes from "./src/routes/mcpRoutes.js";

const app = express();
const port = 3000;

// Register routes
app.use("/mcp", mcpRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
