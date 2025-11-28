import { defineConfig } from "@prisma/config";

export default defineConfig({
  database: {
    provider: "mysql",
    url: process.env.DATABASE_URL,
  },
});
