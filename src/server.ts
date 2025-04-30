import { error } from "console";
import app from "./app";
import AppDataSource from "./database/data-source";
import dotenv from "dotenv";
import { json } from "body-parser";
dotenv.config();

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, (res) => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) =>
    console.log("something went wrong while connecting database: ", error)
  );
