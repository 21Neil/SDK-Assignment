/**
*
*  The codes in 'run' is executed when no error occurred in Aggregator Logic.
*
*/
export async function run(ctx) {
  let result = await ctx.agents.sessionStorage.get(
    "result"
  );

  ctx.agents.result.finalize({
    result,
  })
}


/**
*
*  The codes in 'handleError' is executed when there is any error occurred
*  in Aggregator Logic or CURRENT running Logic just gets an error.
*
*/
export async function handleError(ctx, error) {
  ctx.agents.logging.error(error.message);
}