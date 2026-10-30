/* eslint-disable @typescript-eslint/no-require-imports -- Build-time TypeScript content loader. */
// Export the same content used by /resume and /cv for the PDF renderer.
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const resolveFilename = Module._resolveFilename;
const loadTypeScript = require.extensions[".ts"];

try {
  Module._resolveFilename = function resolveCareerImport(request, parent, ...rest) {
    const resolved = request.startsWith("@/") ? path.join(root, "src", request.slice(2)) : request;
    return resolveFilename.call(this, resolved, parent, ...rest);
  };
  require.extensions[".ts"] = (module, filename) => {
    const source = fs.readFileSync(filename, "utf8");
    const output = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
    });
    module._compile(output.outputText, filename);
  };
  const { getCareerContent } = require("../src/features/career/career-content.ts");
  const destination = path.join(root, "tmp/pdfs/career-content.json");
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, JSON.stringify({ resume: getCareerContent("resume"), cv: getCareerContent("cv") }, null, 2));
  console.log(destination);
} finally {
  Module._resolveFilename = resolveFilename;
  if (loadTypeScript) require.extensions[".ts"] = loadTypeScript;
  else delete require.extensions[".ts"];
}
