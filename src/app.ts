import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { json, urlencoded } from "body-parser";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import cors from "cors";
import helmet from "helmet";
import path from "path";

const app = express();

const swaggerDocument = YAML.load(path.join(__dirname, "docs", "swagger.yaml"));

// console.log({ swaggerDocument });
//Middlewares
app.use(cors());
app.use(helmet());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

//swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("Hello world");
});

export default app;
