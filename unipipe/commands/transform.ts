import { path } from "../deps.ts";
import { write } from "../dir.ts";
import { InstanceHandler } from "../handler.ts";
import { readInstance } from "../osb.ts";

export interface TransformOpts {
  osbRepoPath: string;
  outRepoPath: string;
  handlers: string;
}

async function loadHandlers(
  handlerSrc: string,
): Promise<Record<string, InstanceHandler>> {
  if (handlerSrc.endsWith(".ts")) {
    console.log(
      `Loading handlers as default export from typescript module ${handlerSrc}.`,
    );

    const handlersModule = await import(handlerSrc);

    console.debug(`loaded handler modules`, handlersModule);

    return handlersModule.default;
  } else if (handlerSrc.endsWith(".js")) {
    console.log(
      `Loading handlers as javascript via eval() from ${handlerSrc}.`,
    );

    const js = await Deno.readTextFile(handlerSrc);
    const handlersModule = eval(js);

    console.debug(`loaded handler modules`, handlersModule);
    return handlersModule;
  } else {
    throw Error(
      "could not land handlers, unsupport handler type (needs to be a '.ts' or '.js' file).",
    );
  }
}
export async function transform(
  opts: TransformOpts,
) {
  const handlers = await loadHandlers(opts.handlers);

  const instancesPath = path.join(opts.osbRepoPath, "instances");

  // might be able to "parallelize" using Promise.all
  for await (const dir of Deno.readDir(instancesPath)) {
    if (!dir.isDirectory) {
      continue;
    }

    const ip = path.join(instancesPath, dir.name);
    const instance = await readInstance(ip);

    const handler = handlers[instance.instance.serviceDefinitionId];
    const handledBy = (handler && handler.name) || "(ho handler found)";
    console.log(
      `- instance id: ${instance.instance.serviceInstanceId} | definition id: ${instance.instance.serviceDefinitionId} -> ${handledBy}`,
    );

    if (!handler) {
      continue;
    }

    const tree = handler.handle(instance);
    if (tree) {
      await write(tree, opts.outRepoPath);
    }
  }
}
