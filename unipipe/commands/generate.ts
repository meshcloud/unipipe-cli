import { catalog } from '../blueprints/catalog.yml.js';
import { Command, uuid } from '../deps.ts';

export function registerGenerateCmd(program: Command) {
  // the actual blueprint commands
  const blueprints = new Command()
    .command("catalog")
    .description("Generate a sample OSB catalog for use by unipipe-broker.")
    .action(() => generateCatalog())
    .command("uuid")
    .description(
      "Generate a UUID. This is useful for generating unique ids for OSB service definitions, plans etc.",
    )
    .action(() => generateUuid());

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
