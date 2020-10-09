const plaid = require('plaid');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

const plaidClient = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: process.env.PLAID_ENVIRONMENT,
  options: { version: '2019-05-29' },
});

app.post('/create_link_token', async function (request, response, next) {
  // 1. Grab the client_user_id by searching for the current user in your database
  // const user = await User.find(...);
  const clientUserId = 'Stripe User';

  // 2. Create a link_token for the given user
  plaidClient.createLinkToken(
    {
      user: {
        client_user_id: clientUserId,
      },
      client_name: 'My App',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
      webhook: 'https://sample.webhook.com',
    },
    (err, res) => {
      const link_token = res.link_token;

      // 3. Send the data to the client
      response.json({ link_token });
    }
  );
});

app.listen(3000, function () {
  console.log('server listening on port 3000');
});
