import { table } from '../deps.ts';
import { mapInstances } from './helpers.ts';

export interface ListOpts {
  osbRepoPath: string;
  profile?: string;
}

function profileCols(profile?: string): string[] {
  switch (profile) {
    case undefined:
      return [];
    case "meshmarketplace":
      return ["customer", "project"];
    case "cloudfoundry":
      return ["organization", "space"];
    default:
      console.error("Unrecognized profile: " + profile);
      Deno.exit(1);
  }
}

export async function list(opts: ListOpts) {
  const pcols = profileCols(opts.profile);

  const results = await mapInstances(opts.osbRepoPath, async (instance) => {
    const i = instance.instance;
    const plan = i.serviceDefinition.plans.filter((x) => x.id === i.planId)[0];

    return await {
      id: i.serviceInstanceId,

      // meshmarketplace context
      customer: i.context.customer_id,
      project: i.context.project_id,

      // cloudfoundry context object, https://github.com/openservicebrokerapi/servicebroker/blob/master/profile.md#cloud-foundry-context-object
      organization: i.context.organization_name,
      space: i.context.space_name,

      plan: plan?.name,
      service: i.serviceDefinition.name,
      status: instance.status?.status,
      deleted: i.deleted,
    };
  });

  console.log(
    table(results, [
      "id",
      ...pcols,
      "service",
      "plan",
      "status",
      "deleted"
    ]),
  );
}
