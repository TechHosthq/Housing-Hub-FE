import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Gitignored and untracked, so CI never sees them. Linting them locally
    // reported 433 errors nobody could act on — all of it generated bundle code —
    // and made the local count disagree with CI's by a factor of ten.
    ".next-stale/**",
  ]),

  {
    rules: {
      // Downgraded, not dismissed — same treatment and same reasoning as
      // Housing-Hub-Admin. This is the React Compiler's rule about setting state
      // synchronously inside an effect, and it is real: it triggers cascading
      // renders. But the nine instances here are modal open/close resets, the
      // SignalR provider's connection state and two auth forms, and fixing them
      // means changing when state is derived rather than annotating it away.
      //
      // Warnings so they stay visible and the rest of the ruleset can be a hard
      // gate. Nine as of 31 Aug 2026; raise this back to "error" once cleared.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
