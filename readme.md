
# Pharmalite WhatsApp Bot

This is a WhatsApp bot built using **Baileys.js** and **Node.js** that provides various services for Pharmalite. It supports interactions like selecting services from a list, providing relevant information, and navigating through a menu.

## Features:
- Display services with a list-based interactive interface.
- Fetch detailed information for each service (like blogs, e-learning, jobs, etc.).
- Link to social media, YouTube, blog posts, and more.
- A simple fallback to the main menu when needed.

## Installation:

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/whatsapp-bot.git
   cd whatsapp-bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add your **WhatsApp API credentials** in the `.env` file:
   - `ACCESS_TOKEN=your_whatsapp_api_access_token_here`
   - `PHONE_NUMBER_ID=your_phone_number_id_here`

4. Run locally (use `npm run dev` for development mode with `nodemon`):
   ```bash
   npm start
   ```

## Environment Variables:

- **ACCESS_TOKEN**: Your WhatsApp API Access Token.
- **PHONE_NUMBER_ID**: Your WhatsApp Phone Number ID.
- **PORT**: Port to run the app (usually 3000 for local testing).

## Deployment:

You can deploy this bot on [Render](https://render.com/).

1. Push the code to GitHub.
2. Link your GitHub repository to Render.
3. Set the environment variables in Render dashboard (under **Environment Variables**).
4. Deploy the service.

## Endpoints:

- **/webhook**: Handles incoming messages and actions from WhatsApp.
- **/status**: Returns the current status of the bot (can be used for monitoring).

## Contributing:

Feel free to contribute by submitting issues or pull requests. Make sure to test locally before sending a PR.

---

**Disclaimer:** Please do not share your API access credentials publicly. Keep them safe.
