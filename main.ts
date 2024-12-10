// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Hi, I'm the main module!");
  console.log("To run a specific day, please use 'DAY=X deno run start'");
}
