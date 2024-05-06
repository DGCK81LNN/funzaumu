import { spawn } from "child_process"
import { cp, rm, writeFile } from "fs/promises"
import { dirname, resolve } from "path"
import { fileURLToPath } from "url"

console.log("==== bin/postbuild.js ====")

const filename = fileURLToPath(import.meta.url)
const projectRoot = resolve(dirname(filename), "..")
console.log("+ chdir", projectRoot)
process.chdir(projectRoot)

// fix knex
console.log("+ repair knex")
await rm(".output/server/node_modules/knex", { recursive: true, force: true })
await cp("node_modules/knex", ".output/server/node_modules/knex", {
  recursive: true,
})
console.log("+ shortcut knex cli")
await writeFile(
  ".output/server/knex",
  '#!/usr/bin/env sh\nexec node node_modules/knex/bin/cli.js "$@"\n',
  { mode: 0o777 },
)
await writeFile(
  ".output/server/knex.cmd",
  "@echo off\r\nnode node_modules/knex/bin/cli.js %*\r\n",
)

// build db scripts
console.log("+ tsc db scripts")
await new Promise((resolve, reject) => {
  spawn(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["tsc", "--project", "tsconfig.db-scripts.json"],
    {
      stdio: "inherit",
    },
  )
    .on("close", (c, s) =>
      c || s ? reject(new Error("Failed to compile db scripts")) : resolve(),
    )
    .on("error", (e) => reject(e))
})
console.log("+ copy db script support files")
await cp("db/seeds/funzaumu.tsv", ".output/server/db/seeds/funzaumu.tsv")
