import express from "express";
import questionRouter from "./routes/question.mjs";

const app = express();
const port = 4001;

app.use(express.json());
app.use("/questions",questionRouter)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
