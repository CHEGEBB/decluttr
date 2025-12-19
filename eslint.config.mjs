import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  // ✅ Ignore backend completely (CommonJS)
  globalIgnores([
    "Backend/**",
    // keep Next.js default ignores
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // ✅ Next.js frontend rules ONLY
  ...nextVitals,
  ...nextTs,
]);

export default eslintConfig;
