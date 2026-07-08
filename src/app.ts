import express from "express";
import cors from "cors";
import helmet from "helmet";

import routes from "./routes";
import { requestId } from "./shared/middleware/request-id.middleware";
import { requestLogger } from "./shared/middleware/request-logger.middleware";
import { metricsMiddleware } from "./metrics/metrics.middleware";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "./docs/openapi";

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(requestId);

app.use(requestLogger);

app.use(metricsMiddleware);

app.use(routes);

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec)
);

export default app;