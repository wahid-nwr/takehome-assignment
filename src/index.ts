import dotenv from 'dotenv';
import logger from "./logging/logger";

dotenv.config();

import app from './app';

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    logger.info(
      {
        port: PORT,
        environment: process.env.NODE_ENV,
      },
      "Server started"
    );
    console.log(`Server running on port ${PORT}`);
});