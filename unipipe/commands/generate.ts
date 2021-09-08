import { catalog } from '../blueprints/catalog.yml.js';
import { basicTransformHandler } from '../blueprints/basic-handler.js.js';
import { terraformTransformHandler } from '../blueprints/terraform-handler.js.js';
import { githubWorkflow } from '../blueprints/github-workflow.yml.js';
import { executionScript } from '../blueprints/execution-script.sh.js';
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
    .command("execution-script")
    .description(
      "Generate an execution shell script to apply your terraform templates.",
    )
    .action(() => generateExecutionScript())
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

async function generateCatalog() {
  console.log(catalog);
  outputFile("catalog.yml", catalog, "Pick a destination directory for the generated catalog file:")
}

async function generateExecutionScript() {
  console.log(executionScript);
  outputFile("execute-terraform-templates.sh", executionScript, "Pick a destination directory for the generated execution script file:")
}

async function generateGithubWorkflow() {
  console.log(githubWorkflow);
  outputFile("github-workflow.yml", githubWorkflow, "Pick a destination directory for the generated github-workflow file:")
}

type HandlerType = "handler_b" | "handler_tf";
async function generateTransformHandler() {
  const target: HandlerType = await Select.prompt({
    message: "Pick the target deployment environment:",
    options: [
      { name: "Basic Handler", value: "handler_b" },
      { name: "Terraform Handler", value: "handler_tf" },
    ],
  }) as HandlerType;

  const uuidInput = await Input.prompt({
    message: "Write the Service Id that will be controlled by the handler. Press enter to continue.",
    default: "Default: Auto-generated UUID",
  });

  var outputContent = ""
  switch (target) {
    case "handler_b": {
      if (uuidInput == "Default: Auto-generated UUID"){
        outputContent = basicTransformHandler.replaceAll('$SERVICEID', `${uuid.generate()}` )
      }
      else {
        outputContent = basicTransformHandler.replaceAll('$SERVICEID', uuidInput )
      }
      console.log(outputContent);
      outputFile("handler.js", outputContent, "Pick a destination directory for the generated transform file:")
      break;
    }
    case "handler_tf": {
      if (uuidInput == "Default: Auto-generated UUID"){
        outputContent = terraformTransformHandler.replaceAll('$SERVICEID', `${uuid.generate()}` )
      }
      else {
        outputContent = terraformTransformHandler.replaceAll('$SERVICEID', uuidInput )
      }
      console.log(outputContent);
      outputFile("handler.js", outputContent, "Pick a destination directory for the generated transform file:")
      break;
    }
    default:
      throw new Error(`Received unexpected target ${target} from prompt.`);
  }
}

type DeploymentType = "aci_tf" | "aci_az" | "gcp_cloudrun_tf";
async function generateUniPipeDeployment() {
  const target: DeploymentType = await Select.prompt({
    message: "Pick the target deployment environment:",
    options: [
      { name: "Azure ACI (terraform)", value: "aci_tf" },
      { name: "Azure ACI (azure-cli)", value: "aci_az" },
      { name: "GCP CloudRun (terraform)", value: "gcp_cloudrun_tf" },
    ],
  }) as DeploymentType;

  switch (target) {
    case "aci_az":
      console.log(
        "Please open instructions at: https://github.com/meshcloud/unipipe-service-broker/wiki/2.-Deploy-a-Azure-Container-Group-for-Universal-Pipeline-Service-Broker---Caddy-(SSL)",
      );
      break;
    case "aci_tf": {
      console.log(unipipeOsbAciTerraform);
      outputFile("unipipe-service-broker-deployment-azure.tf", unipipeOsbAciTerraform, "Pick a destination directory for the generated transform file:")
      writeTerraformInstructions(unipipeOsbAciTerraform);
      break;
    }
    case "gcp_cloudrun_tf": {
      console.log(unipipeOsbGCloudCloudRunTerraform);
      outputFile("unipipe-service-broker-deployment-gcp.tf", unipipeOsbGCloudCloudRunTerraform, "Pick a destination directory for the generated transform file:")
      writeTerraformInstructions(unipipeOsbGCloudCloudRunTerraform);
      break;
    }
    default:
      throw new Error(`Received unexpected target ${target} from prompt.`);
  }
}

async function outputFile(fileName: string, content: string, message: string) {
  const destinationDir = await Input.prompt({
    message: message,
    default: "./",
  });
  const dir: Dir = {
    name: destinationDir,
    entries: [
      { name: fileName, content: content },
    ],
  };
  writeDirectory(dir);
}

async function writeDirectory(dir: Dir){
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
