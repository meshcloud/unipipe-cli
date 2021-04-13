import { table } from '../deps.ts';
import { mapInstances } from './helpers.ts';

export async function list(
  osbRepoPath: string,
) {
  const results = await mapInstances(osbRepoPath, async (instance) => {
    const i = instance.instance;
    return await {
      id: i.serviceInstanceId,
      type: i.serviceDefinitionId,
      service: i.serviceDefinition.name,
      status: instance.status?.status,
    };
  });

  console.log(table(results, ["id", "type", "service", "list"]));
}
