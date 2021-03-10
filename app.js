const { App, WorkflowStep } = require('@slack/bolt');

// Initializes your app with your bot token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say({
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "You have a new request:\nCreate accounts for new user: <user>"
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": "*Name:*\nFirst Last"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "*When:*\n<Date>"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "*Start Date:*\n<Date>"
                    }
                ]
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Approve"
                        },
                        "style": "primary",
                        "value": "button_approve",
                        "action_id": "button_approve"
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Deny"
                        },
                        "style": "danger",
                        "value": "button_deny",
                        "action_id": "button_deny"
                    }
                ]
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Click here to create new accounts individually instead of in a batch."
                },
                "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Create Manually",
                        "emoji": true
                    },
                    "value": "manual",
                    "action_id": "button-create-manually"
                }
            }
        ]
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

app.action('button_approve', async ({ body, ack, say, client }) => {
    // Acknowledge the action
    await ack();
    await say(`Creating all user accounts now.`);
});

app.action('button_deny', async ({ body, ack, say, client }) => {
    // Acknowledge the action
    await ack();
    await say(`User account creation process has been halted. To restart the process type createUserAccounts @<user>`);
});

const ws = new WorkflowStep('onboard_user', {
    edit: async ({ ack, step, configuration }) => { },
    save: async ({ ack, step, update }) => { },
    execute: async ({ step, complete, fail }) => { }
});

app.step(ws);

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();