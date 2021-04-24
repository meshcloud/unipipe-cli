import { Command } from '../deps.ts';
import { write } from '../dir.ts';
import { InstanceHandler } from '../handler.ts';
import { ServiceInstance } from '../osb.ts';
import { mapInstances } from './helpers.ts';

interface TransformOpts {
  xportRepo: string;
  handlers: string;
}

export function registerTransformCmd(program: Command) {
  program
    .command(
      "transform <repo>",
    )
    .description(
      "Transform service instances stored in a UniPipe OSB git repo using the specified handlers.",
    )
    .option(
      "-h, --handlers <file>",
      "A registry of handlers for processing service instance transformation. These can be defined in either javascript or typescript as a JSON object with service ids as keys and handler objects as values. Note: typescript registries are not supported in single-binary builds of unipipe-cli.",
    )
    .option(
      "-x, --xport-repo [path:string]",
      "Path to the target git repository. If not specified the transform runs in place on the OSB git repo.",
    )
    .action(async (options: TransformOpts, repo: string) => {
      await transform(repo, options);
    });
}

async function transform(
  osbRepoPath: string,
  opts: TransformOpts,
) {
  const handlers = await loadHandlers(opts.handlers);
  const outRepoPath = opts.xportRepo || osbRepoPath;

  mapInstances(osbRepoPath, async (instance: ServiceInstance) => {
    const handler = handlers[instance.instance.serviceDefinitionId];
    const handledBy = (handler && handler.name) || "(ho handler found)";

    console.log(
      `- instance id: ${instance.instance.serviceInstanceId} | definition id: ${instance.instance.serviceDefinitionId} -> ${handledBy}`,
    );

    if (!handler) {
      return;
    }

    const tree = handler.handle(instance);
    if (tree) {
      await write(tree, outRepoPath);
    }
  });
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
