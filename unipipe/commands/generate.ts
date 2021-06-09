import { catalog } from '../blueprints/catalog.yml.js';
import { transformHandler } from '../blueprints/handler.js.js';
import { unipipeOsbAciTerraform } from '../blueprints/unipipe-osb-aci.tf.js';
import { Command, Select, uuid } from '../deps.ts';

export function registerGenerateCmd(program: Command) {
  // the actual blueprint commands
  const blueprints = new Command()
    //
    .command("catalog")
    .description("Generate a sample OSB catalog for use by unipipe-broker.")
    .action(() => generateCatalog())
    //
    .command("uuid")
    .description(
      "Generate a UUID. This is useful for generating unique ids for OSB service definitions, plans etc.",
    )
    .action(() => generateUuid())
    //
    .command("transform-handler")
    .description(
      "Generate a javascript transform-handler for `unipipe transform`.",
    )
    .action(() => generateTransformHandler())
    //
    .command("unipipe-service-broker-deployment")
    .description(
      "Generate infrastructure-as-code deployments for the UniPipe Service broker.",
    )
    .action(async () => await generateUniPipeDeployment());

  program
    .command("generate", blueprints)
    .description(
      "Generate useful artifacts for working with UniPipe OSB such as catalogs, transform handlers, CI pipelines and more.",
    );
}

function generateUuid() {
  console.log(uuid.generate());
}

function generateCatalog() {
  console.log(catalog);
}

function generateTransformHandler() {
  console.log(transformHandler);
}

type DeploymentType = "aci_tf" | "aci_az";
async function generateUniPipeDeployment() {
  const target: DeploymentType = await Select.prompt({
    message: "Pick the target deployment environment:",
    options: [
      { name: "Azure ACI (terraform)", value: "aci_tf" },
      { name: "Azure ACI (azure-cli)", value: "aci_az" },
    ],
  }) as DeploymentType;

  switch (target) {
    case "aci_az":
      console.log(
        "Please open instructions at: https://github.com/meshcloud/unipipe-service-broker/wiki/2.-Deploy-a-Azure-Container-Group-for-Universal-Pipeline-Service-Broker---Caddy-(SSL)",
      );
      break;
    case "aci_tf":
      console.log(unipipeOsbAciTerraform);
      break;
    default:
      break;
  }
}
