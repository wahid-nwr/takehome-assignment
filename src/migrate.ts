import { execSync } from "node:child_process";

execSync("npx prisma migrate deploy", {
  stdio: "inherit",
});

console.log("Database migrations completed successfully.");