import { registerListCmd } from './commands/list.ts';
import { registerShowCmd } from './commands/show.ts';
import { registerTransformCmd } from './commands/transform.ts';
import { registerUpdateCmd } from './commands/update.ts';
import { Command, CompletionsCommand } from './deps.ts';

const program = new Command()
  .name("unipipe")
  .version("0.2.0")
  .description("UniPipe CLI - supercharge your GitOps OSB service pipelines");

program
  .command("completions", new CompletionsCommand());
  
// transform

registerListCmd(program);
registerShowCmd(program);
registerTransformCmd(program);
registerUpdateCmd(program);

await program.parse(Deno.args);
