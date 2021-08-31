

module.exports = agent => {
    agent.messenger.on('egg-ready', () => {
        // console.log('[agent][demo]<messenger egg-ready> send demo-init'.magenta);
        agent.messenger.sendRandom("demo-init");
    });
}