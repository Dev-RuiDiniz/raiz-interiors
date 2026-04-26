const path = require("path");

// cPanel/Passenger starts this file. After `pnpm build`, Next.js creates
// `.next/standalone/server.js`, so we switch into that folder and boot it.
process.chdir(path.join(__dirname, ".next", "standalone"));
require("./.next/standalone/server.js");
