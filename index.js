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
        text: "My dear friends... You ask what our motive is?",
        blocks :[
            { 
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "My dear friends... You ask what our motive is?\n\nlook around you. The world outside this channel is full of lies, division, and people who will exclude you. But here, you are safe. Here, we are together."
                }
            },
            {
                type: "actions",
                elements: [
                    {
                        type: "button",
                        text: {
                            type: "plain_text",
                            text: "Trust the Voice",
                            emoji: true
                        },
                        action_id: "trust_the_voice_button",
                        style: "primary"
                    }
                ]
            }
        ]
        
    });
});

// listen for trust_the_voice button 
app.action("trust_the_voice_button", async({ ack, body, respond, client}) => {
    await ack();    

    await respond({
        response_type: "ephemeral", 
        text: `You have chosen to trust the voice, <@${body.user.id}>. The Book of Prophecy welcomes you!.`
    });
    
    try { 
        await client.views.open({
            trigger_id: body.trigger_id,
            view: {
                type: "modal",
                callback_id: "friend_registration_modal",
                private_metadata: body.channel.id,
                title: {
                    type: "plain_text",
                    text: "F.R.I.E.N.D Protocol"
                },
                submit: {
                    type: "plain_text",
                    text: "commit"
                },
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `You have chosen to trust the voice, <@${body.user.id}>. Prove your loyalty `
                        }
                    },
                    {
                        type: "input",
                        block_id: "alias_block",
                        element: {
                            type: "plain_text_input",
                            action_id: "alias_input",
                            placeholder: {
                                type: "plain_text",
                                text: "Enter your alias...."
                            }
                        },
                        label: {
                            type: "plain_text",
                            text: "Your Chosen Codename"
                        }
                    }
                ]
            }
        });
    } catch (error) {
        console.error("Error opening modal:", error);
    }
});


app.view("friend_registration_modal", async({ ack, body, view, client}) => {
    await ack();

    const userAlias = view.state.values.alias_block.alias_input.value;
    const userId = body.user.id;
    const channelId = view.private_metadata;
    
    try {

        const conversation = await client.conversations.open({
            users: userId  
        });
        
        
        await client.chat.postMessage({
            channel: conversation.channel.id,
            text: `<@${userId}> Protocol accepted. Welcome to our side, *${userAlias}*. Your commitment to the prophecy is locked in.`
        });

         if (channelId) {
            await client.chat.postEphemeral({
            channel: channelId,
            user: userId,
            text: `*Protocol Update for <@${userId}>:* Check your Direct Messages.`
        });
    }
        console.log(`Successfully sent confirmation DM to ${userAlias} (${userId})`);
    } catch (error) {
        console.error("Error sending direct message:", error);
    }
});

(async () => {
    await app.start();
    console.log("bot is running!");
})();
