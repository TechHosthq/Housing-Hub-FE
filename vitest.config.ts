import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

/**
 * The checks this app had none of.
 *
 * Two bugs shipped in a week that no server test could have caught, because the
 * server was right both times: a screen read `authorisationUrl` where the payload
 * carried the value under another name, and a screen read nothing at all. Both are
 * the same shape — a client's assumption about a response that nothing verified.
 *
 * So the suite is weighted at the seam rather than at the paintwork: money
 * conversion, error-shape handling, and the handful of components whose job is to
 * decide something from a server response.
 */
export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./vitest.setup.ts"],
        include: ["src/**/*.test.{ts,tsx}"],
    },
    resolve: {
        alias: { "@": path.resolve(__dirname, "./src") },
    },
});
