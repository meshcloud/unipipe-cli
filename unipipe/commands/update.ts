import { path } from "../deps.ts";
import { stringify } from "../yaml.ts";

export interface UpdateOpts {
  osbRepoPath: string;
  instanceId: string;
  status: "succeeded" | "failed" | "in progress";
  description?: string;
}

export async function update(opts: UpdateOpts) {
  const statusYmlPath = path.join(
    opts.osbRepoPath,
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
