import { ITypeInfo, path, Type } from '../deps.ts';
import { readBinding, readInstance, ServiceBinding, ServiceInstance } from '../osb.ts';

// TODO it would be nice to generate help text for allowed enum values
// TODO replace with official onec available https://github.com/c4spar/deno-cliffy/tree/main/command#enum-option-type
export class EnumType extends Type<string> {
  constructor(private readonly allowed: readonly string[]) {
    super();
  }

  public parse({ label, name, value }: ITypeInfo): string {
    if (!this.allowed.includes(value)) {
      const legal = this.allowed.map((x) => `"${x}"`).join(", ");

      console.error(
        `Illegal ${label.toLowerCase()} ${name}: must be one of [${legal}] but got "${value}".`,
      );
      Deno.exit(1);
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
  filterFn: (serviceInstance: ServiceInstance) => boolean = (instance: ServiceInstance) => {
    return true
  }
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

        const instancePassesFilter = filterFn(instance);
        if (!instancePassesFilter) {
          continue;
        }

        try {
          const r = await mapFn(instance);
          results.push(r);
        } catch (error) {
          console.error(
            `Failed to process service instance "${ip}".\n`,
             error
          );
          Deno.exit(1);
        }

      } catch (error) {
        console.error(
          `Failed to apply filter to service instance "${ip}".\n`,
          error,
        );
        Deno.exit(1);
      }
    }
  } catch (error) {
    console.error(
      `Failed to read instances directory "${instancesPath}".\n`,
      error,
    );
    Deno.exit(1);
  }

  return results;
}

/**
 * A helper function to implement commands that need to perform a map operation on bindings.
 * If no bindings directory is found, an empty result is returned.
 * 
 * NOTE: includes error handling, and will exit the process with an appropriate error message if an error occurs (e.g. failed to process etc.)
 * @param instancePath path to the osb repository
 * @param mapFn 
 * @returns 
 */
export async function mapBindings<T>(
  instancePath: string,
  mapFn: (serviceBinding: ServiceBinding) => Promise<T>,
): Promise<T[]> {
  const bindingsPath = path.join(instancePath, "bindings");
  const results: T[] = [];

  try {
    for await (const dir of Deno.readDir(bindingsPath)) {
      if (!dir.isDirectory) {
        continue;
      }

      const bp = path.join(bindingsPath, dir.name);

      try {
        const binding = await readBinding(bp);

        const r = await mapFn(binding);

        results.push(r);
      } catch (error) {
        console.error(`Failed to process service binding "${bp}".\n`, error);
        Deno.exit(1);
      }
    }
  } catch (error) {
    // Do not error when bindings directory does not exist.
  }

  return results;
}
