import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { serve, setup } from "swagger-ui-express";
import path from "path";
import { Response, NextFunction } from "express";
import YAML from "yamljs";

const router = express.Router();
const swaggerDocument = YAML.load(path.join(__dirname, "../docs/swagger.yaml"));

if (!swaggerDocument) {
  throw new Error("swagger document not found");
}

if (process.env.NODE_ENV !== "production") {
  router.use(
    "/",
    (req: any, res: Response, next: NextFunction) => {
      swaggerDocument.info.title = process.env.APP_NAME || "TailsMate App";
      swaggerDocument.info.version = "1.0";
      swaggerDocument.servers = [
        {
          url: `http://localhost:${process.env.PORT}`,
          description: "API base url",
        },
      ];
      req.swaggerDoc = swaggerDocument;
      next();
    },
    serve,
    setup(swaggerDocument, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );
}

export default router;
