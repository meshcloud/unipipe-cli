import { path } from "../deps.ts";
import { readInstance } from "../osb.ts";
import { stringify } from "../yaml.ts";

export interface ShowOpts {
  osbRepoPath: string;
  instanceId: string;
  outputFormat: "json" | "yaml";
  pretty: boolean;
}

export async function show(opts: ShowOpts) {
  const instancesPath = path.join(
    opts.osbRepoPath,
    "instances",
    opts.instanceId,
  );
  const instance = await readInstance(instancesPath);

  if (opts.outputFormat === "json") {
    const p = opts.pretty ? 4 : undefined;
    console.log(JSON.stringify(instance, null, p));
  } else if (opts.outputFormat === "yaml") {
    const p = opts.pretty ? { indent: 4 } : {};
    console.log(stringify(instance as any, p));
  } else {
    throw Error("unknown format: " + opts.outputFormat);
  }
}
