export default defineEventHandler(async (event) => {
  const body = await getBody(event);

  console.log("server hit", body);
  // show that the file is sent to the server fine
  // probably do additional processing here, convert to optimal format, optimize, etc.
});
