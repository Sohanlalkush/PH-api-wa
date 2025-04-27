// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// ✅ Simple root route for testing
app.get("/", function (request, response) {
  console.log("GET / called - Simple WhatsApp Webhook tester");
  response.send('Simple WhatsApp Webhook tester</br>There is no front-end, see server.js for implementation!');
});

// ✅ Webhook verification route (GET /webhook)
app.get('/webhook', function(req, res) {
  const hubMode = req.query['hub.mode'];
  const hubVerifyToken = req.query['hub.verify_token'];
  const hubChallenge = req.query['hub.challenge'];

  // Log the incoming query parameters for debugging
  console.log(`GET /webhook called with params: mode=${hubMode}, verify_token=${hubVerifyToken}, challenge=${hubChallenge}`);

  // Verify the token and mode for webhook validation
  if (hubMode === 'subscribe' && hubVerifyToken === process.env.VERIFICATION_TOKEN) {
    console.log("Webhook verified successfully. Returning challenge.");
    res.send(hubChallenge);  // Return the challenge to verify subscription
  } else {
    console.log("Webhook verification failed. Invalid mode or token.");
    res.sendStatus(400);  // Respond with status 400 for failure
  }
});

// ✅ Webhook handler route (POST /webhook)
app.post('/webhook', function(req, res) {
    // Log the incoming message for debugging

  // Process the incoming WhatsApp message data here
  const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (entry) {
    const from = entry.from; // The sender's phone number
    let message = entry.text?.body; // The message content

    // Check if the message is from an interactive list reply
    if (entry.interactive) {
      message = entry.interactive.list_reply.id; // Use the list reply ID to determine the choice
    }

    console.log(`Received message from ${from}: ${message}`);

    // Here you can add your bot's response logic based on the message content
    if (message === 'Hello') {
      sendServiceList(from);
    } else if (serviceReplies[message]) {
      sendMessage(from, serviceReplies[message]);
    } else {
      sendMessage(from, 'I didn\'t understand that. Please type "Hello" to get started.');
    }
  }

  // Always respond with a status code of 200 after handling the webhook
  res.sendStatus(200);
});


// Function to send a message via WhatsApp
function sendMessage(to, message) {
  const accessToken = process.env.ACCESS_TOKEN;  // Use environment variable for access token
  const phoneNumberId = process.env.PHONE_NUMBER_ID;  // Use environment variable for phone number ID

  const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',  // Specifies that the recipient is an individual
    to: to,  // The phone number of the recipient
    type: 'text',  // Message type
    text: {
      preview_url: false,  // Disables URL preview (set to true if you want to enable preview)
      body: message,  // The message content
    },
  };

  // Sending the message via POST request
  axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,  // Include the access token in the authorization header
      'Content-Type': 'application/json',  // Content type as JSON
    },
  })
    .then(response => {
      console.log(`Message sent to ${to}: ${message}`);
    })
    .catch(error => {
      console.error(`Error sending message to ${to}: ${error.message}`);
    });
}

// Map service IDs to replies
const serviceReplies = {
  '1': `*Pharmalite E-learning:*\nExplore a range of resources tailored for B Pharma students:\n\n- *Books*: https://www.pharmalite.in/p/b-pharma-books.html\n- *Video Lectures*: https://www.pharmalite.in/p/select-sem.html?fn=video-lecture\n- *Syllabus*: https://www.pharmalite.in/p/select-sem.html?fn=syllabus\n\nType *0* to go back to the main menu.`,
  '2': `*Pharmalite Blog:*\nStay updated with the latest pharma industry news:\n- *Visit*: https://blog.pharmalite.in\n\nType *0* to go back to the main menu.`,
  '3': `*Pharma Jobs:*\nFind your next opportunity:\n- *Jobs*: https://jobs.pharmalite.in\n- *WhatsApp Channel*: https://whatsapp.com/channel/0029Vah34yY5kg6xfOg3Zd2Q\n\nType *0* to go back to the main menu.`,
  '4': `*Pharmalite AI:*\nExperience AI-driven solutions:\n- *Explore*: https://ai.pharmalite.in\n\nType *0* to go back to the main menu.`,
  '5': `*GPAT Help (Sponsored):*\nPreparing for GPAT? Get help:\n- *Join*: https://t.me/blackApps_bot\n\nType *0* to go back to the main menu.`,
  '6': `*Pharmalite YouTube:*\nWatch educational videos:\n- *Watch*: https://youtube.com/@pharmalite\n\nType *0* to go back to the main menu.`,
  '7': `*Pharmalite Social Media:*\nStay connected:\n- *Instagram*: https://instagram.com/pharmalite.in/\n- *LinkedIn*: https://www.linkedin.com/company/pharmalite-in\n- *Twitter*: https://twitter.com/pharmalite_in\n- *Facebook*: https://facebook.com/pharmalite.in/\n- *Telegram*: https://PharmaLite.t.me/\n\nType *0* to go back to the main menu.`
};

// 🔥 Send the initial list
async function sendServiceList(to) {
  const url = `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: to,
    type: 'interactive',
    interactive: {
      type: 'list',
      header: {
        type: 'text',
        text: '🚀 Welcome to Pharmalite!'
      },
      body: {
        text: 'Please choose a service or type the corresponding number.\n\nType *0* anytime to return to the main menu.'
      },
      footer: {
        text: 'Powered by Pharmalite'
      },
      action: {
        button: 'Choose Service',
        sections: [
          {
            title: 'Our Services',
            rows: [
              { id: '1', title: '1️⃣ E-learning', description: 'Learn Pharma easily' },
              { id: '2', title: '2️⃣ Blog', description: 'Latest pharma articles' },
              { id: '3', title: '3️⃣ Pharma Jobs', description: 'New job updates' },
              { id: '4', title: '4️⃣ Pharmalite AI', description: 'Explore AI tools' },
              { id: '5', title: '5️⃣ GPAT Help (Sponsored)', description: 'GPAT study support' },
              { id: '6', title: '6️⃣ YouTube', description: 'Pharma videos' },
              { id: '7', title: '7️⃣ Social Media', description: 'Connect with us' }
            ]
          }
        ]
      }
    }
  };

  axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    console.log(`Service list sent to ${to}`);
  })
  .catch(error => {
    console.error(`Error sending service list: ${error.message}`);
  });
}

// ➡️ Status Endpoint
app.get('/status', (req, res) => {
  res.status(200).send({
    status: 'success',
    message: 'Server is running 🚀'
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
