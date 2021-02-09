const { App } = require('@slack/bolt');

// Initializes your app with your bot token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say({
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `Hey there <@${message.user}>!`
                },
                "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Click Me"
                    },
                    "action_id": "button_click"
                }
            }
        ],
        text: `Hey there <@${message.user}>!`
    });
});


app.message('invite', async ({ message, say, client }) => {
    user = message.text.substring(7);
    userId = user.substring(2, user.length - 1)
    await say({
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `Inviting ${user} to join this channel!`
                }
            }
        ]
    });

    const result = await client.conversations.invite({
        channel: message.channel,
        users: userId
    });
});

app.action('button_click', async ({ body, ack, say, client }) => {
    // Acknowledge the action
    await ack();
    await say(`<@${body.user.id}> clicked the button`);
    try {
        const result = await client.conversations.invite({
            channel: message.channel,
            post_at: whenSeptemberEnds,
            text: 'Summer has come and passed'
        });
    }
    catch (error) {
        console.error(error);
    }
});

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();