# 🔥 InfernoAuth

**InfernoAuth** by **Inferno Devs** is the ultimate power suite plugin for Discord Android (Revenge / Bunny / Vendetta client mods). Built with zero-lag architecture, native Android modals, and clean FluxDispatcher integration.

---

## 📥 How to Install

Copy any of the following URLs and paste it into **Discord Settings > Plugins > Install Plugin**:

### Primary (GitHub Pages):
```text
https://madannxd-jpg.github.io/InfernoAuth/
```

### Fast CDN (jsDelivr):
```text
https://cdn.jsdelivr.net/gh/madannxd-jpg/InfernoAuth@main/
```

### Self-Hosted Panel Endpoint:
```text
https://panel-02.infernodev.fun/plugins/InfernoAuth/
```

---

## ⚡ Features

### 1. 📱 Native Login Screen Suite
* **Log in with Token**: Centered modal with a dedicated **[ 📋 Paste ]** button and native screen lock.
* **Instant Type & Edit**: 100% native Android text input handling — type, backspace, and edit without input resets.
* **Select Saved Account**: Interactive dropdown directly on the login screen showing verified active accounts with avatar previews. Inactive/expired accounts are hidden automatically.

### 2. 👥 Multi-Account Manager
* `/token account action:save name:<nickname>` — One-click save your active account with a custom nickname (no token pasting needed).
* `/token account action:list` — View all your saved accounts with `#index` and active state badges.
* `/token account action:add token:<token> name:<nickname>` — Save a new alt account by pasting its token.
* `/token account action:remove target:<#1 / nickname>` — Remove an account from storage.
* `/token account action:clear` — Clear all saved accounts.

### 3. 🔄 Instant Alt Switcher
* `/token switch account:1` — Switch to saved account #1.
* `/token switch account:<name>` — Switch by Discord username or custom nickname.
* Applies session with automatic Gateway reconnect and clean reload.

### 4. 🔒 Safe Logout (Zero Token Invalidation)
* `/token logout` or `/logout`
* Safely copies your current token to the clipboard.
* Auto-saves the account to your multi-account list as a backup.
* Performs a pure client-side session logout **without** sending `POST /auth/logout` to Discord servers — meaning **the token is NEVER invalidated or reset**!

### 5. 🔑 Real Token Retriever
* `/gettoken` or `/token get`
* Extracts the genuine 3-part Discord user token from `AuthenticationStore` (filters out FCM/push tokens).
* Automatically copies the token to your clipboard.

### 6. 🌐 Batch Server Joiner
* `/token join invite:<code_or_link>` or `/joinserver invite:<link>`
* Joins the target server across your active account AND all saved alts.
* Active account uses Discord's native transition (safe). Alts join sequentially with built-in rate-limit protection.

### 7. 🤖 Batch Bot Authorizer
* `/appauthorize bot_id:<client_id>`
* Fast OAuth2 bot authorization across all your accounts with default `bot applications.commands guilds.join` scopes.

### 8. 🗑️ Real-Time Deleted Messages Logger
* `/deleted` or `/deletedmessages`
* High-priority `A.before` dispatcher interception captures deleted messages before Discord's store can wipe them.
* Shows real author, actual deleted text, attachments, sent timestamp, and deleted timestamp.
* Clean numeric pagination: `/deleted page:2`.

### 9. 📖 Interactive Guide
* `/help` or `/infernohelp`
* Command browser with parameters, usage guides, and shortcuts.

---

## 🛡️ Credits & License
Developed by **Inferno Devs**. Built for the Revenge & Bunny Discord client mod community.
