# Deployment & Security Guide for Set Game (TON)

This guide explains how to deploy your application securely and prepares it for future TON integration.

## 1. Security Concepts

### Source Code Security
*   **Frontend (Client)**: The code that runs in the browser (React) is **public by definition**. Anyone can inspect it ("View Source"). **Never store private keys or secrets in the frontend code.**
*   **Backend (Server)**: The code running on the server (Node.js) is **private**. This is where your game logic, validation, and future payment verification must live.

### TON Security
*   **Wallets**: Users connect their own non-custodial wallets (Tonkeeper, etc.). Your app never sees their private keys.
*   **Payments**: When a user pays (bets) TON:
    1.  Frontend requests a transaction via TON Connect.
    2.  User signs it in their wallet.
    3.  **CRITICAL**: Your **Backend** must verify the transaction on the blockchain using a public API (like toncenter.com) before crediting the user. **Never trust the frontend saying "I paid".**

## 2. Deployment Steps

We will deploy the Client and Server separately.

### Prerequisites
1.  Create a **GitHub** account and push your code there.
2.  Create accounts on **Vercel** (for Client) and **Railway** (for Server).

### Step A: Deploy Server (Railway)
1.  Go to [Railway.app](https://railway.app/).
2.  Click "New Project" -> "Deploy from GitHub repo".
3.  Select your repository.
4.  **Important**: Configure the "Root Directory" to `/server`.
5.  Railway will automatically detect Node.js and start the server.
6.  Go to "Variables" and add:
    *   `PORT`: `3000` (or let Railway assign one)
    *   `CLIENT_URL`: `https://your-vercel-app.vercel.app` (You will update this after Step B).
7.  Railway will give you a public URL (e.g., `https://set-game-server.railway.app`). Copy this.

### Step B: Deploy Client (Vercel)
1.  Go to [Vercel.com](https://vercel.com/).
2.  Click "Add New..." -> "Project".
3.  Select your repository.
4.  **Important**: Configure the "Root Directory" to `/client`.
5.  In "Environment Variables", add:
    *   `VITE_API_URL`: Paste your Railway Server URL (e.g., `https://set-game-server.railway.app`).
6.  Click "Deploy".
7.  Vercel will give you a public URL (e.g., `https://set-game-client.vercel.app`).

### Step C: Final Configuration
1.  Go back to **Railway** (Server).
2.  Update the `CLIENT_URL` variable to your actual Vercel URL (`https://set-game-client.vercel.app`).
3.  Redeploy the server.

## 3. Telegram Integration
1.  Open **@BotFather** in Telegram.
2.  Create a new bot or select existing.
3.  Use `/newapp` to create a Web App.
4.  When asked for the URL, paste your **Vercel Client URL**.
5.  Now your game works inside Telegram!

## 4. Future Security Checklist (for Money Games)
*   [ ] **Backend Validation**: Ensure `gameManager.js` validates every move (we already did this!).
*   [ ] **Transaction Verification**: When implementing betting, the server must query the TON blockchain to confirm payments.
*   [ ] **Rate Limiting**: Add `express-rate-limit` to the server to prevent spam.
*   [ ] **DDoS Protection**: Cloudflare (Vercel and Railway provide basic protection).
