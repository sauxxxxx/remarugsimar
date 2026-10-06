import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const compatibility = new FlatCompat({ baseDirectory: currentDirectory });

const eslintConfig = [
  ...compatibility.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [".next/**", ".next-dev/**", "node_modules/**", "out/**", "output/**", "build/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
