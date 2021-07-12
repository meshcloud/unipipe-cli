import { catalog } from '../blueprints/catalog.yml.js';
import { transformHandler } from '../blueprints/handler.js.js';
import { githubWorkflow } from '../blueprints/github-workflow.yml.js';
import { unipipeOsbAciTerraform } from '../blueprints/unipipe-osb-aci.tf.js';
import { unipipeOsbGCloudCloudRunTerraform } from '../blueprints/unipipe-osb-gcloud-cloudrun.js';
import { colors, Command, Input, Select, uuid } from '../deps.ts';
import { Dir, File, write } from '../dir.ts';

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
    .command("github-workflow")
    .description(
      "Generate a github workflow for `Github Actions`.",
    )
    .action(() => generateGithubWorkflow())
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

function generateGithubWorkflow() {
  console.log(githubWorkflow);
}

type DeploymentType = "aci_tf" | "aci_az" | "gc_cloudrun_tf";
async function generateUniPipeDeployment() {
  const target: DeploymentType = await Select.prompt({
    message: "Pick the target deployment environment:",
    options: [
      { name: "Azure ACI (terraform)", value: "aci_tf" },
      { name: "Azure ACI (azure-cli)", value: "aci_az" },
      { name: "GCloud CloudRun (terraform)", value: "gc_cloudrun_tf" },
    ],
  }) as DeploymentType;

  const destinationDir = await Input.prompt({
    message: "Pick a destination directory for the generated terraform files:",
    default: "./",
  });

  switch (target) {
    case "aci_az":
      console.log(
        "Please open instructions at: https://github.com/meshcloud/unipipe-service-broker/wiki/2.-Deploy-a-Azure-Container-Group-for-Universal-Pipeline-Service-Broker---Caddy-(SSL)",
      );
      break;
    case "aci_tf": {
      const dir: Dir = {
        name: destinationDir,
        entries: [
          { name: "main.tf", content: unipipeOsbAciTerraform },
        ],
      };

      writeTerraformDir(dir);
      writeTerraformInstructions(unipipeOsbAciTerraform);
      break;
    }
    case "gc_cloudrun_tf": {
      const dir: Dir = {
        name: destinationDir,
        entries: [
          { name: "main.tf", content: unipipeOsbGCloudCloudRunTerraform },
        ],
      };

      writeTerraformDir(dir);
      writeTerraformInstructions(unipipeOsbGCloudCloudRunTerraform);
      break;
    }
    default:
      throw new Error(`Received unexpected target ${target} from prompt.`);
  }
}

async function writeTerraformDir(dir: Dir){
  await write(
    dir,
    "./",
    (file) => console.log(colors.green(`writing ${file}`)),
  );
}

function writeTerraformInstructions(terraform: string, initialText: string='Instructions:') {
  // KISS, just find where the actual terraform code starts and log the file header above it
  const instructions = terraform.substring(
    0,
    terraform.indexOf("terraform {"),
  );
  console.log(initialText);
  console.log(instructions);
}
