import express from "express";
import cors from "cors";
import helmet from "helmet";

import routes from "./routes";
import { requestId } from "./shared/middleware/request-id.middleware";
import { requestLogger } from "./shared/middleware/request-logger.middleware";

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(requestId);

app.use(requestLogger);

app.use(routes);

export default app;