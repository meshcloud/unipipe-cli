import { path } from '../deps.ts';
import { readInstance, ServiceInstance } from '../osb.ts';

/**
 * A helper function to implement commands that need to perform a map operation on instances.
 * 
 * NOTE: includes error handling, and will exit the process with an appropriate error message if an error occurs (e.g. directory not found, failed to process etc.)
 * @param osbRepoPath path to the osb repository
 * @param mapFn 
 * @returns 
 */
export async function mapInstances<T>(
  osbRepoPath: string,
  mapFn: (serviceInstance: ServiceInstance) => Promise<T>,
): Promise<T[]> {
  const instancesPath = path.join(osbRepoPath, "instances");
  const results: T[] = [];

  try {
    for await (const dir of Deno.readDir(instancesPath)) {
      if (!dir.isDirectory) {
        continue;
      }

      const ip = path.join(instancesPath, dir.name);

      try {
        const instance = await readInstance(ip);

        const r = await mapFn(instance);

        results.push(r);
      } catch (error) {
        console.error(`Failed to process service instance "${ip}".\n`, error);
        Deno.exit(1);
      }
    }
  } catch (error) {
    console.error(`Failed to read instances directory "${instancesPath}".\n`, error);
    Deno.exit(1);
  }

  return results;
}
