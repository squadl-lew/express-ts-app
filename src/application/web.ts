import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { publicRouter } from "../route/public-api";
import { errorMiddleware } from "../middleware/error-middleware";
import { apiRouter } from "../route/api";

export const web = express();
web.use(cors());
web.use(express.json());
web.use(publicRouter);
web.use(apiRouter);

const openApiPath = path.join(__dirname, "..", "..", "doc", "openapi.yaml");
const openApiDocument = YAML.load(openApiPath);
web.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

web.use(errorMiddleware);
