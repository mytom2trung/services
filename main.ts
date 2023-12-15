import "https://deno.land/x/xhr@0.1.0/mod.ts"

import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts"
import { oakCors } from "https://deno.land/x/cors/mod.ts"
import WorkerPolyfill from "https://cdn.jsdelivr.net/npm/pseudo-worker/+esm"

import pingUpdate from "./routes/v1/ping-update.ts"
import sendPlugin from "./routes/v1/send-plugin.ts"
import listPlugin from "./routes/v1/list-plugin.ts"
import contributors from "./routes/v1/contributors.ts"

Object.assign(self, {
  document: {
    documentElement: { dataset: {} }
  }
})
if (typeof Worker === "undefined") {
  Object.assign(self, { Worker: WorkerPolyfill })
}

const app = new Application()

const v1 = new Router()

v1.use("/v1", pingUpdate.routes())
v1.use(pingUpdate.allowedMethods())

v1.use("/v1", sendPlugin.routes())
v1.use(sendPlugin.allowedMethods())

v1.use("/v1", listPlugin.routes())
v1.use(listPlugin.allowedMethods())

v1.use("/v1", contributors.routes())
v1.use(contributors.allowedMethods())

app.use(
  oakCors({
    origin: ["https://mangaraiku.eu.org", "https://raiku.netlify.app", /\.gitpod\.io$/i, "http://localhost"]
  })
)
app.use(v1.routes())
app.use(v1.allowedMethods())

app.listen({ port: 8080 })
