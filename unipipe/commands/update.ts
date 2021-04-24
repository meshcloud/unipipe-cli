import { Command, path } from '../deps.ts';
import { stringify } from '../yaml.ts';
import { EnumType } from './helpers.ts';

const ALL_STATUSES = ["succeeded", "failed", "in progress"] as const;
type StatusesTuple = typeof ALL_STATUSES;
type Status = StatusesTuple[number];

const statusesType = new EnumType(ALL_STATUSES);

interface UpdateOpts {
  instanceId: string;
  status: Status;
  description: string;
}

export function registerUpdateCmd(program: Command) {
  program
    .command("update <repo>")
    .type("status", statusesType)
    .description(
      "update status of a service instance stored in a UniPipe OSB git repo.",
    )
    .option(
      "-i --instance-id <instance-id>",
      "Service instance id.",
    )
    .option(
      "--status <status:status>",
      "The status. Allowed values are 'in progress', 'succeeded' and 'failed'.",
    ) // todo use choices instead
    .option(
      "--description [description]",
      "Service Instance status description text.",
      {
        default: "",
      },
    )
    .action(async (options: UpdateOpts, repo: string) => {
      await update(repo, options);
    });
}

async function update(osbRepoPath: string, opts: UpdateOpts) {
  const statusYmlPath = path.join(
    osbRepoPath,
    "instances",
    opts.instanceId,
    "status.yml",
  );

  const yaml = stringify({
    status: opts.status,
    description: opts.description,
  });

  await Deno.writeTextFile(statusYmlPath, yaml);
}
