import { list, ListOpts } from './commands/list.ts';
import { show, ShowOpts } from './commands/show.ts';
import { transform, TransformOpts } from './commands/transform.ts';
import { update, UpdateOpts } from './commands/update.ts';
import { Command } from './deps.ts';

const program = new Command("UniPipe CLI");
program.version("0.2.0");
program.description("Supercharge your GitOps OSB service pipelines");

// transform
program
  .command(
    "transform <repo>",
  )
  .description(
    "Transform service instances stored in a UniPipe OSB git repo using the specified handlers.",
  )
  .option(
    "-h --handlers <handler.js/.ts file>",
    "A registry of handlers for processing service instance transformation. These can be defined in either javascript or typescript as a JSON object with service ids as keys and handler objects as values. Note: typescript registries are not supported in single-binary builds of unipipe-cli.",
  )
  .option(
    "-x --xport-repo [path]",
    "Path to the target git repository. If not specified the transform runs in place on the OSB git repo.",
  )
  .action(async (repo: string, options: any) => {
    const opts: TransformOpts = {
      osbRepoPath: repo,
      outRepoPath: options.xportRepo || repo,
      handlers: options.handlers,
    };

    await transform(opts);
  });

// list
program
  .command("list <repo>")
  .option(
    "-p --profile [profile]",
    "include columns of context information according to the specified OSB API profile. Supported values are 'meshmarketplace' and 'cloudfoundry'. Ignored when '-o json' is set.",
  )
  .option(
    "-o --output-format [output-format]",
    "Output format. Supported formats are json and text.",
    (x) => x,
    "text",
  )
  .description(
    "Lists service instances status stored in a UniPipe OSB git repo.",
  )
  .action(async (repo: string, options: any) => {
    const opts: ListOpts = {
      osbRepoPath: repo,
      profile: options.profile,
      format: options.outputFormat,
    };

    await list(opts);
  });

// show
program
  .command("show <repo>")
  .description(
    "Shows the state stored service instance stored in a UniPipe OSB git repo.",
  )
  .option(
    "-i --instance-id <instance-id>",
    "Service instance id.",
  )
  .option(
    "-o --output-format <output-format>",
    "Output format. Supported formats are yaml and json.",
  )
  .option(
    "--pretty",
    "Pretty print",
  )
  .action(async (repo: string, options: any) => {
    const opts: ShowOpts = {
      osbRepoPath: repo,
      instanceId: options.instanceId,
      outputFormat: options.outputFormat,
      pretty: options.pretty,
    };

    await show(opts);
  });

// update
program
  .command("update <repo>")
  .description(
    "update status of a service instance stored in a UniPipe OSB git repo.",
  )
  .option(
    "-i --instance-id <instance-id>",
    "Service instance id.",
  )
  .option(
    "--status <status>",
    "The status. Allowed values are 'in progress', 'succeeded' and 'failed'.",
  ) // todo use choices instead
  .option(
    "--description [description]",
    "Service Instance status description text.",
  )
  .action(async (repo: string, options: Record<string, any>) => {
    const opts: UpdateOpts = {
      osbRepoPath: repo,
      instanceId: options.instanceId,
      status: options.status,
      description: options.description || "",
    };

    await update(opts);
  });

await program.parseAsync(Deno.args);
