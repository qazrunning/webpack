module.exports = (app) => {
  app.messenger.on("demo-init", async (data) => {
    // console.log('[worker][demo]<messenger demo-init> start...');
  });

  app.ready(async () => {

  });
};
