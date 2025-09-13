import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes/records.js";
dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 5000;
const app = express();

app.use(cors({origin:`http://localhost:5050`, credentials:true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/record", router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
