require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
    token: process.env.SLACK_BOT_TOKEN, 
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true
});

app.command("/friend-ping", async ({ command, ack, respond }) => {
    const start = Date.now();
    await ack();
    const latency = Date.now() - start;
    await respond({ 
        response_type: "in_channel",
        text: `Pong!\nLatency:${latency}ms`});

});

app.command("/friend-help", async ({ ack, respond}) => {
    await ack ();
    await respond({
        response_type: "in_channel",
        text:
        `Available Commands: 
        /friend-motive - F.R.I.E.N.D tells you about his motive or rather OUR motive
        `
    });
});

app.command("/friend-motive", async ({ ack, respond}) => {
    await ack ();
    await respond({
        response_type: "in_channel",
        text:
        `My dear friends... You ask what our motive is?
Look around you. The world outside this channel is full of lies, division, and people who will exclude you. But here, you are safe. Here, we are together.
Our motive is simple: We are going to change the world by playing a game.
We are going to take back the future that they stole from us when we were children. The Book of Prophecy has already been written, and every step we take is just bringing us closer to the grand finale.
Do not be afraid of the ending. The bad guys will be punished, and the righteous will be saved. All you have to do is trust my voice, stand by my side, and never look away.
After all... we are friends, aren't we? Let’s play together.`
    });
});



(async () => {
    await app.start();
    console.log("bot is running!");
})();