export const transformHandler = `
/**
 Here's a full example for a handlers.js file that you can pass to unipipe transform --registry-of-handlers and that writes service instance parameters into a custom directory structure:

  /
  \`-- customers
      \`-- unipipe-osb-dev
          \`-- osb-dev
              \`-- params.json

  For more information about handlers please review the official unipipe-cli documentation
  at https://github.com/meshcloud/unipipe-cli
*/

class MyHandler {
  name = "My Handler";

  handle(service) {
    const params = service.instance.parameters;

    const context = service.instance.context;

    return {
      name: "customers",
      entries: [{
        name: context.customer_id,
        entries: [
          {
            name: context.project_id,
            entries: [
              { name: "params.json", content: JSON.stringify(params, null, 2) },
            ],
          },
        ],
      }],
    };
  }
}

const handlers = {
  "d90c2b20-1d24-4592-88e7-6ab5eb147925": new MyHandler(),
};

handlers;
`