import { ITypeInfo, path, Type } from '../deps.ts';
import { readInstance, ServiceInstance } from '../osb.ts';

// TODO it would be nice to generate help text for allowed enum values
export class EnumType extends Type<string> {
  
  constructor(private readonly allowed: readonly string[]){
    super();
}

  public parse({ label, name, value }: ITypeInfo): string {
    if (!this.allowed.includes(value)) {
      const legal = this.allowed.map(x => `"${x}"`).join(", ");

      console.error(
        `Illegal ${label.toLowerCase()} ${name}: must be one of [${legal}] but got "${value}".`,
      );
      Deno.exit(1)
    }

    return value;
  }

  public complete(): string[] {
    return this.allowed.slice();
  }
}

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
