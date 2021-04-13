import { path, table } from "../deps.ts";
import { readInstance } from "../osb.ts";

export async function list(
  osbRepoPath: string,
) {
  const instancesPath = path.join(osbRepoPath, "instances");

  const results = [];
  for await (const dir of Deno.readDir(instancesPath)) {
    if (!dir.isDirectory) {
      continue;
    }

    const ip = path.join(instancesPath, dir.name);
    const instance = await readInstance(ip);

    const i = instance.instance;
    results.push({
      id: i.serviceInstanceId,
      type: i.serviceDefinitionId,
      service: i.serviceDefinition.name,
      status:instance.status?.status
    });    
  }

  console.log(table(results, ['id', 'type', 'service', 'list']));
}
