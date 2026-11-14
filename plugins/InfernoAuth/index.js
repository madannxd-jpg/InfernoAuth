(function(h, T, S, c, M, B, A, C) {
  "use strict";

  // --- Helper: Command Wrapper ---
  function y(e, i, a) {
    if (!e.name || !e?.description) throw new Error("No name or description in command: " + e?.name);
    e.displayName ??= i?.names?.[a] ?? e.name;
    e.displayDescription ??= i?.names?.[a] ?? e.description;
    if (e.options) {
      if (!Array.isArray(e.options)) throw new Error("Options is not an array");
      for (var r = 0; r < e.options.length; r++) {
        const t = e.options[r];
        if (!t?.name || !t?.description) throw new Error("No name/description in option " + r);
        t.displayName ??= i?.options?.[r]?.names?.[a] ?? t.name;
        t.displayDescription ??= i?.options?.[r]?.descriptions?.[a] ?? t.description;
        if (t?.choices) {
          if (!Array.isArray(t.choices)) throw new Error("Choices is not an array");
          for (var o = 0; o < t.choices.length; o++) {
            const n = t.choices[o];
            if (!n?.name) throw new Error("No name of choice in option " + r);
            n.displayName ??= i?.options?.[r]?.choices?.[o]?.names?.[a] ?? n.name;
          }
        }
      }
    }
    return e;
  }

  // --- Helper: Message Sending ---
  function P(e) {
    const { metro: i } = e;
    const { receiveMessage: a } = i.findByProps("sendMessage", "receiveMessage");
    const { createBotMessage: r } = i.findByProps("createBotMessage");
    const o = i.findByProps("BOT_AVATARS");
    return function(t, n) {
      if (t.channelId ??= i.findByStoreName("SelectedChannelStore").getChannelId(), [null, void 0].includes(t.channelId)) {
        throw new Error("No channel id to receive the message into");
      }
      if (n !== void 0 && "author" in n && "avatar" in n.author && "avatarURL" in n.author) {
        if (o && o.BOT_AVATARS) {
          o.BOT_AVATARS[n.author.avatar] = n.author.avatarURL;
        }
        delete n.author.avatarURL;
      }
      let s = n === true ? t : r(t);
      if (typeof n == "object") {
        const mergeMod = e.metro.findByProps("merge");
        s = mergeMod?.merge ? mergeMod.merge(s, n) : Object.assign({}, s, n);
      }
      a(t.channelId, s);
      return s;
    };
  }

  const w = {
    loadingDiscordSpinner: "a:loading:1105495814073229393",
    aol: "a:aol:1108834296359301161",
    linuth: ":linuth:1110531631409811547",
    fuckyoy: ":fuckyoy:1108360628302782564",
    getLoading() { return Math.random() < 0.01 ? this.aol : this.loadingDiscordSpinner; },
    getFailure() { return Math.random() < 0.01 ? this.fuckyoy : this.linuth; },
    getSuccess() { return ""; }
  };

  const U = { command: "https://cdn.discordapp.com/attachments/1099116247364407337/1112129955053187203/command.png" };

  const { meta: { resolveSemanticColor: E } } = c.findByProps("colors", "meta") || { meta: { resolveSemanticColor: () => "#5865F2" } };
  const b = c.findByStoreName("ThemeStore");
  const u = function() {
    try {
      return parseInt(E(b.theme, T.semanticColors?.BACKGROUND_SECONDARY || T.semanticColors?.BACKGROUND_BASE_LOWER).slice(1), 16);
    } catch(err) {
      return 5793266;
    }
  };

  const p = { author: { username: "InfernoAuth", avatar: "command", avatarURL: U.command } };
  let g;
  function m() {
    return window.sendMessage ? window.sendMessage(...arguments) : ((g || (g = P(vendetta))), g(...arguments));
  }

  // --- Plugin Definition ---
  var I = {
    meta: vendetta.plugin,
    patches: [],
    onUnload() {
      this.patches.forEach(function(e) {
        try { if (typeof e === "function") e(); } catch(err) {}
      });
      this.patches = [];
    },
    onLoad() {
      var e = this;

      // ============================================================
      // --- Multi-Account Storage & Helpers ---
      // ============================================================
      function getStorage() {
        try {
          if (vendetta?.plugin?.storage) {
            if (!Array.isArray(vendetta.plugin.storage.savedAccounts)) {
              vendetta.plugin.storage.savedAccounts = [];
            }
            return vendetta.plugin.storage;
          }
        } catch(err) {}
        return { savedAccounts: [] };
      }

      function getBackgroundConfig() {
        try {
          const st = getStorage();
          if (st && st.backgroundConfig) {
            return st.backgroundConfig;
          }
        } catch(err) {}
        return { enabled: false, type: "none", url: null, blur: 0, opacity: 1 };
      }

      function updateRevengeThemeBackground(cfg) {
        try {
          const themeAPI = window.bunny?.themes || vendetta?.themes || window.vendetta?.themes;
          if (!themeAPI || !themeAPI.themes) return;

          const THEME_ID = "inferno-builtin-theme";

          if (cfg && cfg.enabled && cfg.url) {
            const opacityVal = (typeof cfg.opacity === "number") ? cfg.opacity : 0.85;
            const blurVal = (typeof cfg.blur === "number") ? cfg.blur : 10;
            const bgAlpha = "35"; // ~20% alpha for transparent glass
            const bgAlphaSec = "40"; // ~25% alpha for sidebars
            const floatAlpha = "99"; // popouts

            const fullTheme = {
              id: THEME_ID,
              selected: true,
              data: {
                name: "Inferno Full Theme",
                description: "Full-app translucent glass theme across all Discord pages",
                authors: [{ name: "Inferno Devs" }],
                spec: 2,
                background: {
                  url: cfg.url,
                  blur: blurVal,
                  alpha: opacityVal
                },
                semanticColors: {
                  "BACKGROUND_PRIMARY": ["#111214" + bgAlpha, "#ffffff" + bgAlpha],
                  "CHAT_BACKGROUND": ["#000000" + bgAlpha, "#ffffff" + bgAlpha],
                  "BACKGROUND_SECONDARY": ["#1e1f22" + bgAlphaSec, "#f2f3f5" + bgAlphaSec],
                  "BACKGROUND_SECONDARY_ALT": ["#15161a" + bgAlphaSec, "#ebedef" + bgAlphaSec],
                  "BACKGROUND_TERTIARY": ["#111214" + bgAlpha, "#e3e5e8" + bgAlpha],
                  "BACKGROUND_ACCENT": ["#2b2d31" + bgAlpha, "#d1d5db" + bgAlpha],
                  "BACKGROUND_FLOATING": ["#111214" + floatAlpha, "#ffffff" + floatAlpha],
                  "BACKGROUND_MOBILE_PRIMARY": ["#111214" + bgAlpha, "#ffffff" + bgAlpha],
                  "BACKGROUND_MOBILE_SECONDARY": ["#1e1f22" + bgAlphaSec, "#f2f3f5" + bgAlphaSec],
                  "CARD_PRIMARY_BG": ["#1e1f22" + bgAlphaSec, "#f2f3f5" + bgAlphaSec],
                  "CARD_SECONDARY_BG": ["#15161a" + bgAlphaSec, "#ebedef" + bgAlphaSec],
                  "BG_BACKDROP": ["#000000" + bgAlpha, "#000000" + bgAlpha],
                  "BG_BASE_PRIMARY": ["#111214" + bgAlpha, "#ffffff" + bgAlpha],
                  "BG_BASE_SECONDARY": ["#1e1f22" + bgAlphaSec, "#f2f3f5" + bgAlphaSec],
                  "BG_BASE_TERTIARY": ["#15161a" + bgAlphaSec, "#ebedef" + bgAlphaSec],
                  "BG_SURFACE_OVERLAY": ["#111214" + floatAlpha, "#ffffff" + floatAlpha],
                  "BG_SURFACE_RAISED": ["#111214" + bgAlpha, "#ffffff" + bgAlpha],
                  "BG_MOD_FAINT": ["#ffffff15", "#00000010"],
                  "BG_MOD_SUBTLE": ["#ffffff20", "#00000015"],
                  "BG_MOD_STRONG": ["#ffffff30", "#00000025"]
                },
                rawColors: {
                  "PRIMARY_DARK_600": "#111214" + bgAlpha,
                  "PRIMARY_DARK_630": "#111214" + bgAlpha,
                  "PRIMARY_DARK_660": "#111214" + bgAlpha,
                  "PRIMARY_DARK_700": "#1e1f22" + bgAlphaSec,
                  "PRIMARY_DARK_800": "#15161a" + bgAlphaSec,
                  "PRIMARY_DARK_900": "#0b0b0c" + floatAlpha,
                  "PRIMARY_DARK": "#111214" + bgAlpha,
                  "PL_WHITE": "#ffffff",
                  "BRAND_500": "#5865F2"
                }
              }
            };

            themeAPI.themes[THEME_ID] = fullTheme;
            if (typeof themeAPI.selectTheme === "function") {
              themeAPI.selectTheme(THEME_ID);
            }
          } else {
            if (themeAPI.themes[THEME_ID]) {
              delete themeAPI.themes[THEME_ID];
            }
            if (typeof themeAPI.selectTheme === "function") {
              themeAPI.selectTheme("default");
            }
          }
        } catch(e) {
          console.error("Error updating Revenge theme:", e);
        }
      }

      function setBackgroundConfig(cfg) {
        try {
          const st = getStorage();
          st.backgroundConfig = cfg;
          updateRevengeThemeBackground(cfg);
        } catch(err) {}
      }

      function getSavedAccounts() {
        const st = getStorage();
        return Array.isArray(st.savedAccounts) ? st.savedAccounts : [];
      }

      function saveAccount(acc) {
        const st = getStorage();
        let list = Array.isArray(st.savedAccounts) ? [...st.savedAccounts] : [];
        const idx = list.findIndex(function(a) {
          return a.id === acc.id || (a.token && a.token === acc.token);
        });
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...acc };
        } else {
          list.push(acc);
        }
        st.savedAccounts = list;
      }

      function removeAccountByQuery(query) {
        const st = getStorage();
        const list = Array.isArray(st.savedAccounts) ? [...st.savedAccounts] : [];
        const num = parseInt(query, 10);
        if (!isNaN(num) && num >= 1 && num <= list.length) {
          const removed = list.splice(num - 1, 1)[0];
          st.savedAccounts = list;
          return removed;
        }
        const qLower = String(query).toLowerCase().trim();
        const idx = list.findIndex(function(a) {
          return (a.username && a.username.toLowerCase() === qLower) ||
                 (a.name && a.name.toLowerCase() === qLower) ||
                 (a.id && a.id === qLower) ||
                 (a.globalName && a.globalName.toLowerCase() === qLower);
        });
        if (idx !== -1) {
          const removed = list.splice(idx, 1)[0];
          st.savedAccounts = list;
          return removed;
        }
        return null;
      }

      function findAccountByQuery(query) {
        const list = getSavedAccounts();
        const num = parseInt(query, 10);
        if (!isNaN(num) && num >= 1 && num <= list.length) {
          return list[num - 1];
        }
        const qLower = String(query).toLowerCase().trim();
        return list.find(function(a) {
          return (a.username && a.username.toLowerCase() === qLower) ||
                 (a.name && a.name.toLowerCase() === qLower) ||
                 (a.id && a.id === qLower) ||
                 (a.globalName && a.globalName.toLowerCase() === qLower);
        });
      }

      async function switchAccount(token) {
        if (!token) throw new Error("No token provided");

        // 1. Cleanly disconnect existing Gateway WebSocket to prevent live socket collision / flag
        try {
          const gw = c.findByProps("connect", "reconnect");
          if (gw?.close) gw.close();
          else if (gw?.disconnect) gw.disconnect();
        } catch(e) {}

        // 2. Clear old session tokens from multi-account switcher
        try {
          const switchMod = c.findByProps("switchAccountToken");
          if (switchMod?.switchAccountToken) switchMod.switchAccountToken(null);
        } catch(e) {}

        // 3. Dispatch LOGIN_SUCCESS so all Flux stores cleanly mount new token
        try {
          const dispatcher = c.findByProps("dispatch", "subscribe");
          if (dispatcher?.dispatch) {
            dispatcher.dispatch({ type: "LOGIN_SUCCESS", token: token });
          }
        } catch(e) {}

        // 4. Set token in native AuthenticationStore & loginToken
        try {
          const auth = c.findByProps("loginToken") || c.findByProps("login", "logout");
          if (auth?.loginToken) {
            auth.loginToken(token);
          }
        } catch(e) {}

        try {
          const tokenMod = c.findByProps("setToken") || c.findByProps("switchAccountToken");
          if (tokenMod?.setToken) tokenMod.setToken(token);
          if (tokenMod?.switchAccountToken) tokenMod.switchAccountToken(token);
        } catch(e) {}

        // 5. Clean bundle reload so Discord starts 100% fresh as that user (zero socket residue)
        const reloader = (window.nativeModuleProxy && window.nativeModuleProxy.BundleUpdaterManager) || c.findByProps("reload");
        if (reloader && typeof reloader.reload === "function") {
          setTimeout(function() {
            try {
              reloader.reload();
            } catch(e) {
              console.error("reload failed", e);
            }
          }, 450);
        }
      }

      // ============================================================
      // --- Deleted Messages Tracking (Pre-Cache & Dispatch Intercept) ---
      // ============================================================
      const recentMessagesCache = new Map();
      const channelDeletedMessages = new Map();
      const MessageStore = c.findByStoreName("MessageStore");

      function cacheRecentMessage(msg) {
        if (!msg || !msg.id) return;
        const author = msg.author || {};
        let ts = msg.timestamp;
        if (ts && typeof ts.toDate === "function") ts = ts.toDate();
        else if (ts && typeof ts.toISOString === "function") ts = ts.toISOString();

        recentMessagesCache.set(msg.id, {
          id: msg.id,
          channelId: msg.channel_id || msg.channelId,
          content: typeof msg.content === "string" ? msg.content : "",
          author: {
            id: author.id || null,
            username: author.username || "Unknown",
            globalName: author.global_name || author.globalName || author.username || "Unknown"
          },
          timestamp: ts || new Date().toISOString(),
          attachments: Array.isArray(msg.attachments)
            ? msg.attachments.map(function(a) { return a.url || a.proxy_url || a.filename || ""; }).filter(Boolean)
            : []
        });

        if (recentMessagesCache.size > 3000) {
          const firstKey = recentMessagesCache.keys().next().value;
          recentMessagesCache.delete(firstKey);
        }
      }

      function cacheChannelMessages(chId) {
        if (!chId || !MessageStore) return;
        try {
          const msgs = MessageStore.getMessages(chId);
          if (!msgs) return;
          const list = msgs._array || (typeof msgs.toArray === "function" ? msgs.toArray() : null) || (Array.isArray(msgs) ? msgs : null);
          if (list && Array.isArray(list)) {
            for (let i = 0; i < list.length; i++) {
              cacheRecentMessage(list[i]);
            }
          } else if (typeof msgs.forEach === "function") {
            msgs.forEach(function(m) { cacheRecentMessage(m); });
          }
        } catch(e) {}
      }

      function recordDeleted(channelId, cached, msgId) {
        if (!channelId) return;
        if (!channelDeletedMessages.has(channelId)) {
          channelDeletedMessages.set(channelId, []);
        }
        const list = channelDeletedMessages.get(channelId);
        if (list.some(function(m) { return m.id === msgId; })) return;

        const now = new Date();
        const deletedAt = now.toLocaleTimeString();
        const deletedTimestamp = now.getTime();

        let sentAt = "Unknown";
        if (cached?.timestamp) {
          try {
            let ts = cached.timestamp;
            if (ts && typeof ts.toDate === "function") ts = ts.toDate();
            else if (ts && typeof ts.toISOString === "function") ts = ts.toISOString();
            const d = new Date(ts);
            sentAt = isNaN(d.getTime()) ? String(ts) : d.toLocaleTimeString();
          } catch(e) {}
        }

        let text = cached?.content || "";
        const attachments = cached?.attachments || [];
        if (!text && attachments.length > 0) {
          text = "(Attachment only)";
        } else if (!text) {
          text = cached ? "(Empty message)" : "(Deleted message not captured in recent cache)";
        }

        const record = {
          id: msgId,
          channelId: channelId,
          author: cached?.author || { username: "Unknown User", globalName: "Unknown User", id: null },
          content: text,
          sentAt: sentAt,
          deletedAt: deletedAt,
          deletedTimestamp: deletedTimestamp,
          attachments: attachments
        };

        list.unshift(record);
        if (list.length > 100) {
          list.pop();
        }
      }

      // --- Persistent Edit History Storage (backed by MMKV) ---
      function recordMessageEdit(msgId, channelId, author, oldContent, newContent, editTimestamp) {
        if (!msgId || !oldContent || !newContent || oldContent === newContent) return;
        try {
          const st = getStorage();
          if (!st.editHistory || typeof st.editHistory !== "object") {
            st.editHistory = {};
          }
          const edits = st.editHistory;
          const now = new Date();
          const editTimeStr = now.toLocaleTimeString();

          if (!edits[msgId]) {
            edits[msgId] = {
              id: msgId,
              channelId: channelId,
              author: {
                id: author?.id || null,
                username: author?.username || "Unknown",
                globalName: author?.globalName || author?.global_name || author?.username || "Unknown"
              },
              versions: [
                {
                  version: 1,
                  type: "Original",
                  content: oldContent,
                  timestamp: Date.now() - 2000,
                  timeString: "Original"
                }
              ]
            };
          }

          const vList = edits[msgId].versions;
          if (vList[vList.length - 1].content !== newContent) {
            vList.push({
              version: vList.length + 1,
              type: "Edit #" + vList.length,
              content: newContent,
              timestamp: editTimestamp || Date.now(),
              timeString: editTimeStr
            });
          }

          // Capping: keep last 300 edited messages in MMKV
          const keys = Object.keys(edits);
          if (keys.length > 300) {
            delete edits[keys[0]];
          }
          st.editHistory = edits;
        } catch(e) {
          console.warn("Failed to record message edit", e);
        }
      }

      // High-Priority Dispatch Interception: captures deleted messages BEFORE MessageStore removes them!
      try {
        const dispatcher = vendetta?.metro?.common?.FluxDispatcher || c.findByProps("dispatch", "subscribe");
        if (dispatcher && typeof dispatcher.dispatch === "function") {
          const unpatchDispatch = A.before("dispatch", dispatcher, function(args) {
            try {
              const event = args?.[0];
              if (!event || !event.type) return args;

              // Track real-time message edits persistently across app restarts
              if (event.type === "MESSAGE_UPDATE") {
                const msg = event.message;
                if (msg && msg.id && typeof msg.content === "string") {
                  const msgId = msg.id;
                  const chId = msg.channel_id || msg.channelId;
                  const cached = recentMessagesCache.get(msgId);
                  const oldContent = cached?.content;
                  const newContent = msg.content;
                  if (oldContent && newContent && oldContent !== newContent) {
                    const author = cached.author || msg.author;
                    recordMessageEdit(msgId, chId, author, oldContent, newContent, msg.edited_timestamp || Date.now());
                  }
                  cacheRecentMessage(msg);
                }
              }

              // Pre-cache newly loaded, created, or updated messages
              if (event.type === "MESSAGE_CREATE") {
                if (event.message) cacheRecentMessage(event.message);
              } else if (event.type === "LOAD_MESSAGES_SUCCESS" && Array.isArray(event.messages)) {
                event.messages.forEach(cacheRecentMessage);
              } else if (event.type === "LOCAL_MESSAGES_LOADED" && Array.isArray(event.messages)) {
                event.messages.forEach(cacheRecentMessage);
              } else if (event.type === "CHANNEL_SELECT" && event.channelId) {
                cacheChannelMessages(event.channelId);
              }

              // Intercept MESSAGE_DELETE before any store purges the message!
              if (event.type === "MESSAGE_DELETE") {
                const chId = event.channelId;
                const msgId = event.id;
                if (chId && msgId) {
                  let cached = recentMessagesCache.get(msgId);
                  if (!cached) {
                    const raw = MessageStore?.getMessage?.(chId, msgId);
                    if (raw) {
                      cacheRecentMessage(raw);
                      cached = recentMessagesCache.get(msgId);
                    }
                  }
                  if (!cached) {
                    cacheChannelMessages(chId);
                    cached = recentMessagesCache.get(msgId);
                  }
                  recordDeleted(chId, cached, msgId);
                }
              } else if (event.type === "MESSAGE_DELETE_BULK") {
                const chId = event.channelId;
                if (chId && Array.isArray(event.ids)) {
                  event.ids.forEach(function(msgId) {
                    let cached = recentMessagesCache.get(msgId);
                    if (!cached) {
                      const raw = MessageStore?.getMessage?.(chId, msgId);
                      if (raw) {
                        cacheRecentMessage(raw);
                        cached = recentMessagesCache.get(msgId);
                      }
                    }
                    if (!cached) {
                      cacheChannelMessages(chId);
                      cached = recentMessagesCache.get(msgId);
                    }
                    recordDeleted(chId, cached, msgId);
                  });
                }
              }
            } catch(e) {}
            return args;
          });

          e.patches.push(unpatchDispatch);

          // Initial pre-caching for currently open channel
          try {
            const SelectedChannelStore = c.findByStoreName("SelectedChannelStore");
            const activeCh = SelectedChannelStore?.getChannelId?.();
            if (activeCh) cacheChannelMessages(activeCh);
          } catch(e) {}

          // Dual subscription fallback
          const onMsgCreate = function(ev) {
            try { if (ev?.message) cacheRecentMessage(ev.message); } catch(e) {}
          };
          const onMsgLoad = function(ev) {
            try { if (Array.isArray(ev?.messages)) ev.messages.forEach(cacheRecentMessage); } catch(e) {}
          };
          const onChanSelect = function(ev) {
            try { if (ev?.channelId) cacheChannelMessages(ev.channelId); } catch(e) {}
          };

          const u1 = dispatcher.subscribe("MESSAGE_CREATE", onMsgCreate);
          const u2 = dispatcher.subscribe("LOAD_MESSAGES_SUCCESS", onMsgLoad);
          const u3 = dispatcher.subscribe("CHANNEL_SELECT", onChanSelect);

          e.patches.push(function() {
            try {
              if (typeof u1 === "function") u1();
              else if (dispatcher.unsubscribe) dispatcher.unsubscribe("MESSAGE_CREATE", onMsgCreate);
              if (typeof u2 === "function") u2();
              else if (dispatcher.unsubscribe) dispatcher.unsubscribe("LOAD_MESSAGES_SUCCESS", onMsgLoad);
              if (typeof u3 === "function") u3();
              else if (dispatcher.unsubscribe) dispatcher.unsubscribe("CHANNEL_SELECT", onChanSelect);
            } catch(e) {}
          });

          // --- Universal Auto-Onboarding Event Listeners ---
          try {
            const onOnbStart = function(ev) {
              const gid = ev?.guildId || ev?.guild?.id;
              if (gid) {
                const curTok = getActualCurrentToken();
                if (curTok) {
                  autoSolveOnboarding(gid, curTok);
                  autoAcceptRules(gid, curTok);
                }
              }
            };
            const uOnb1 = dispatcher.subscribe("GUILD_ONBOARDING_START", onOnbStart);
            const uOnb2 = dispatcher.subscribe("GUILD_ONBOARDING_PROMPTS_FETCH_SUCCESS", onOnbStart);
            const uInv = dispatcher.subscribe("INVITE_ACCEPT_SUCCESS", function(ev) {
              const gid = ev?.invite?.guild?.id || ev?.guild?.id;
              if (gid) {
                const curTok = getActualCurrentToken();
                if (curTok) {
                  setTimeout(function() {
                    autoSolveOnboarding(gid, curTok);
                    autoAcceptRules(gid, curTok);
                  }, 400);
                }
              }
            });
            e.patches.push(function() {
              try {
                if (typeof uOnb1 === "function") uOnb1();
                if (typeof uOnb2 === "function") uOnb2();
                if (typeof uInv === "function") uInv();
              } catch(e) {}
            });
          } catch(e) {}

          // --- Universal GuildOnboardingStore Patch: Never Show Modal to User ---
          try {
            const OnbStore = c.findByStoreName("GuildOnboardingStore");
            if (OnbStore && typeof OnbStore.shouldShowOnboarding === "function") {
              const unpatchOnb = A.instead("shouldShowOnboarding", OnbStore, function(args, orig) {
                try {
                  const guildId = args?.[0];
                  if (guildId) {
                    const curTok = getActualCurrentToken();
                    if (curTok) {
                      autoSolveOnboarding(guildId, curTok).then(function(res) {
                        if (res && res.count > 0) {
                          C?.showToast?.("⚡ AutoOnboard: " + res.count + " questions solved (last choices)");
                        }
                      }).catch(function() {});
                      autoAcceptRules(guildId, curTok).catch(function() {});
                    }
                  }
                } catch(x) {}
                // Completely suppress onboarding modal/screen popup
                return false;
              });
              e.patches.push(unpatchOnb);
            }
          } catch(err) {
            console.warn("Could not patch GuildOnboardingStore:", err);
          }
        }
      } catch(err) {
        console.warn("Failed to subscribe FluxDispatcher", err);
      }

      // ============================================================
      // --- Universal All-Pages Wallpaper & Theme Injector ---
      // ============================================================
      function patchFullAppBackground() {
        try {
          const RN = c.common?.ReactNative || c.findByProps("ImageBackground") || window.ReactNative;
          const ImageBackground = RN?.ImageBackground;
          const StyleSheet = RN?.StyleSheet;
          const React = c.common?.React || c.findByProps("createElement") || window.React;

          if (!ImageBackground || !React) return;

          function makeViewTranslucent(tree, bgConfig) {
            if (!tree || !M || typeof M.findInReactTree !== "function" || !StyleSheet) return;
            const alphaVal = (typeof bgConfig.opacity === "number") ? bgConfig.opacity : 0.85;
            const overlayAlpha = Math.max(0, Math.min(1, 1 - alphaVal)).toFixed(2);
            const translucentBg = "rgba(0, 0, 0, " + overlayAlpha + ")";

            if (tree.props && tree.props.style) {
              tree.props.style = StyleSheet.flatten([
                tree.props.style,
                { backgroundColor: translucentBg }
              ]);
            }

            // 1. Chat messages container
            const chatComp = M.findInReactTree(
              tree,
              function(x) { return x && x.props && "HACK_fixModalInteraction" in x.props && x?.props?.style; }
            );
            if (chatComp) {
              chatComp.props.style = StyleSheet.flatten([
                chatComp.props.style,
                { backgroundColor: translucentBg }
              ]);
            }

            // 2. ScrollView / FastList / FlashList / FlatList (DMs list in Screenshot 3!)
            const listComp = M.findInReactTree(
              tree,
              function(x) {
                return x && x.props && (x.props.contentContainerStyle || x.props.data || x.props.sections || x.props.getItem);
              }
            );
            if (listComp && listComp.props) {
              if (listComp.props.style) {
                listComp.props.style = StyleSheet.flatten([
                  listComp.props.style,
                  { backgroundColor: "transparent" }
                ]);
              }
              if (listComp.props.contentContainerStyle) {
                listComp.props.contentContainerStyle = StyleSheet.flatten([
                  listComp.props.contentContainerStyle,
                  { backgroundColor: "transparent" }
                ]);
              }
            }

            // 3. User profile body / cards (Profile screen in Screenshot 2!)
            const profileComp = M.findInReactTree(
              tree,
              function(x) {
                return x && x.props && x.props.style && (x.props.displayProfile || x.props.user || x.props.currentUser);
              }
            );
            if (profileComp && profileComp.props && profileComp.props.style) {
              profileComp.props.style = StyleSheet.flatten([
                profileComp.props.style,
                { backgroundColor: translucentBg }
              ]);
            }
          }

          function wrapScreen(ret, bgConfig) {
            if (!ret || !bgConfig || !bgConfig.enabled || !bgConfig.url) return ret;
            if (ret?.type === ImageBackground || ret?.props?.["data-inferno-bg"]) {
              return ret;
            }

            makeViewTranslucent(ret, bgConfig);

            return React.createElement(
              ImageBackground,
              {
                "data-inferno-bg": true,
                style: { flex: 1, width: "100%", height: "100%" },
                source: { uri: bgConfig.url },
                blurRadius: typeof bgConfig.blur === "number" ? bgConfig.blur : 0
              },
              ret
            );
          }

          function hookComponent(comp, name) {
            if (!comp) return;
            try {
              const patcher = function(args, ret) {
                try {
                  const bg = getBackgroundConfig();
                  if (!bg || !bg.enabled || !bg.url) return ret;
                  return wrapScreen(ret, bg);
                } catch(err) {
                  return ret;
                }
              };

              if (typeof comp === "function") {
                e.patches.push(A.after("render", comp, patcher));
              } else if (comp.default && typeof comp.default === "function") {
                e.patches.push(A.after("default", comp, patcher));
              } else if (comp.default?.render) {
                e.patches.push(A.after("render", comp.default, patcher));
              } else if (comp.render) {
                e.patches.push(A.after("render", comp, patcher));
              }
            } catch(err) {
              console.warn("Failed to hook screen " + name, err);
            }
          }

          // Hook 1: Chat Screen (MessagesConnected)
          hookComponent(c.findByDisplayName("MessagesConnected", false) || c.find(function(m) {
            return m?.default?.displayName === "MessagesConnected" || m?.displayName === "MessagesConnected";
          }), "MessagesConnected");

          // Hook 2: DMs / Messages tab screen (ConnectedPrivateChannels - Screenshot 3!)
          hookComponent(c.findByName("ConnectedPrivateChannels", false) || c.findByName("PrivateChannels", false) || c.findByDisplayName("PrivateChannels", false), "PrivateChannels");

          // Hook 3: User Profile & Account screens (Screenshot 2!)
          hookComponent(c.findByName("UserProfileOverview", false) || c.findByName("UserProfile", false) || c.findByName("UserProfileCard", false) || c.findByName("UserProfileAboutMeCard", false), "UserProfile");
          hookComponent(c.findByName("SimplifiedUserProfileCard", false) || c.findByName("UserProfileSection", false), "UserProfileSection");

          // Hook 4: Settings / You Tab Screen
          hookComponent(c.findByName("SettingsOverviewScreen", false) || c.findByName("Settings", false), "SettingsOverviewScreen");

          // Hook 5: Channels List / Guild Drawer
          hookComponent(c.findByName("ConnectedChannelList", false) || c.findByName("ChannelList", false) || c.findByDisplayName("ChannelList", false), "ChannelList");

          // Hook 6: Redesign NavigatorScreen (Wraps every navigator page!)
          try {
            const redesignMod = c.findByProps("NavigatorScreen");
            if (redesignMod?.NavigatorScreen) {
              hookComponent(redesignMod.NavigatorScreen, "NavigatorScreen");
            }
          } catch(err) {}

          // Hook 7: NavigationContainer Root
          try {
            const Nav = c.common?.NavigationNative || c.findByProps("NavigationContainer");
            if (Nav?.NavigationContainer) {
              hookComponent(Nav.NavigationContainer, "NavigationContainer");
            }
          } catch(err) {}

        } catch(err) {
          console.error("Failed to patch full app background:", err);
        }
      }

      patchFullAppBackground();
      try {
        const initBg = getBackgroundConfig();
        if (initBg && initBg.enabled) {
          updateRevengeThemeBackground(initBg);
        }
      } catch(e) {}

      // ============================================================
      // --- Alert & Notification Helpers (Safe - No LegacyAlert) ---
      // ============================================================
      function showAlert(title, content) {
        C?.showToast?.(title + ": " + content);
      }

      // ============================================================
      // --- Login Screen UI (Persistent State & Focus Lock) ---
      // ============================================================
      try {
        const React = vendetta?.metro?.common?.React || c.findByProps("createElement");
        const RN = vendetta?.metro?.common?.ReactNative || c.findByProps("AppRegistry");
        const AuthStore = c.findByStoreName("AuthenticationStore");

        if (React && RN) {
          // --- Direct Session Application with Bundle Reload ---
          function executeDirectSwitch(token, userData) {
            C?.showToast?.("Applying session...");

            try {
              const dispatcher = c.findByProps("dispatch", "subscribe");
              if (dispatcher?.dispatch) {
                dispatcher.dispatch({ type: "LOGIN_SUCCESS", token: token });
              }
            } catch(e) {
              console.warn("LOGIN_SUCCESS dispatch failed", e);
            }

            try {
              const auth = c.findByProps("loginToken") || c.findByProps("login", "logout");
              if (auth?.loginToken) {
                auth.loginToken(token);
              }
            } catch(e) {
              console.warn("loginToken call failed", e);
            }

            try {
              const tokenMod = c.findByProps("switchAccountToken");
              if (tokenMod?.switchAccountToken) {
                tokenMod.switchAccountToken(token);
              }
            } catch(e) {}

            try {
              const gateway = c.findByProps("connect", "reconnect");
              if (gateway?.reconnect) {
                gateway.reconnect();
              }
            } catch(e) {
              console.warn("gateway reconnect failed", e);
            }

            const reloader = (window.nativeModuleProxy && window.nativeModuleProxy.BundleUpdaterManager) || c.findByProps("reload");
            if (reloader && typeof reloader.reload === "function") {
              setTimeout(function() {
                try {
                  reloader.reload();
                } catch(e) {
                  console.error("reload failed", e);
                  C?.showToast?.("Please restart Discord manually to complete login.");
                }
              }, 500);
            } else {
              C?.showToast?.("Session applied! Please restart Discord if needed.");
            }
            return true;
          }

          // Persistent module-level state prevents collapsing when keyboard opens!
          let isModalOpenGlobal = false;
          let tokenTextGlobal = "";
          let errorTextGlobal = "";
          let isLoginLoadingGlobal = false;

          // --- Centered Modal Token Login Component with Backdrop & Close Button ---
          function TokenLoginSection() {
            const [isModalOpen, setIsModalOpen] = React.useState(isModalOpenGlobal);
            const [tokenText, setTokenText] = React.useState(tokenTextGlobal);
            const [errorText, setErrorText] = React.useState(errorTextGlobal);
            const [isLoading, setIsLoading] = React.useState(isLoginLoadingGlobal);

            async function handlePasteClipboard() {
              try {
                const clipboard = vendetta?.metro?.common?.clipboard || B;
                if (clipboard?.getString) {
                  const val = await clipboard.getString();
                  if (val) {
                    const trimmed = val.trim();
                    tokenTextGlobal = trimmed;
                    setTokenText(trimmed);
                    errorTextGlobal = "";
                    setErrorText("");
                  }
                }
              } catch(e) {}
            }

            async function handleLoginSubmit() {
              const s = (tokenText || tokenTextGlobal || "").trim().replace(/^["'\s]+|["'\s]+$/g, "");
              if (!s || s.split(".").length < 3 || s.length < 40) {
                errorTextGlobal = "Invalid format. Token must be 3 dot-separated strings.";
                setErrorText(errorTextGlobal);
                return;
              }

              isLoginLoadingGlobal = true;
              setIsLoading(true);
              errorTextGlobal = "";
              setErrorText("");
              C?.showToast?.("Verifying token with Discord...");

              try {
                const res = await fetch("https://discord.com/api/v9/users/@me", {
                  headers: { "Authorization": s }
                });

                if (res.status === 401) {
                  isLoginLoadingGlobal = false;
                  setIsLoading(false);
                  errorTextGlobal = "Invalid token (401). Token expired or revoked.";
                  setErrorText(errorTextGlobal);
                  return;
                }
                if (res.status === 403) {
                  isLoginLoadingGlobal = false;
                  setIsLoading(false);
                  errorTextGlobal = "Account restricted (403). Locked or verification required.";
                  setErrorText(errorTextGlobal);
                  return;
                }
                if (!res.ok) {
                  isLoginLoadingGlobal = false;
                  setIsLoading(false);
                  errorTextGlobal = "Discord API returned error HTTP " + res.status;
                  setErrorText(errorTextGlobal);
                  return;
                }

                const userData = await res.json().catch(function() { return {}; });
                C?.showToast?.("Logging into @" + (userData.username || "user") + "...");

                saveAccount({
                  id: userData.id,
                  username: userData.username,
                  globalName: userData.global_name || userData.username,
                  token: s,
                  avatar: userData.avatar,
                  addedAt: Date.now()
                });

                isModalOpenGlobal = false;
                setIsModalOpen(false);
                setIsLoading(false);
                executeDirectSwitch(s, userData);
              } catch(err) {
                isLoginLoadingGlobal = false;
                setIsLoading(false);
                errorTextGlobal = "Network error: " + (err.message || "Failed to reach Discord");
                setErrorText(errorTextGlobal);
              }
            }

            return React.createElement(
              React.Fragment,
              null,
              // The main button on the login screen
              React.createElement(
                RN.Pressable,
                {
                  _isTokenBtn: true,
                  onPress: function() {
                    isModalOpenGlobal = true;
                    setIsModalOpen(true);
                    errorTextGlobal = "";
                    setErrorText("");
                  },
                  style: {
                    backgroundColor: "#5865F2",
                    height: 44,
                    borderRadius: 4,
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: 4,
                    width: "100%"
                  }
                },
                React.createElement(
                  RN.Text,
                  {
                    style: {
                      color: "#FFFFFF",
                      fontSize: 15,
                      fontWeight: "600",
                      letterSpacing: 0.2,
                      textAlign: "center"
                    }
                  },
                  "Log in with Token"
                )
              ),
              // Centered Modal Window with Screen-Locking Backdrop
              React.createElement(
                RN.Modal,
                {
                  visible: isModalOpen,
                  transparent: true,
                  animationType: "fade",
                  statusBarTranslucent: true,
                  onRequestClose: function() {
                    // Empty: never close on Android IME / keyboard events!
                  }
                },
                React.createElement(
                  RN.View,
                  {
                    style: {
                      flex: 1,
                      backgroundColor: "rgba(0, 0, 0, 0.75)",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 20
                    }
                  },
                  React.createElement(
                    RN.View,
                    {
                      style: {
                        width: "100%",
                        maxWidth: 360,
                        backgroundColor: "#2b2d31",
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "#35373c",
                        padding: 18,
                        elevation: 12
                      }
                    },
                    // Header Row: Title & Cross Button (✕)
                    React.createElement(
                      RN.View,
                      {
                        style: {
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8
                        }
                      },
                      React.createElement(
                        RN.Text,
                        {
                          style: {
                            color: "#FFFFFF",
                            fontSize: 16,
                            fontWeight: "700"
                          }
                        },
                        "Log in with Token"
                      ),
                      React.createElement(
                        RN.Pressable,
                        {
                          onPress: function() {
                            isModalOpenGlobal = false;
                            setIsModalOpen(false);
                            errorTextGlobal = "";
                            setErrorText("");
                          },
                          hitSlop: 10,
                          style: {
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            backgroundColor: "#1e1f22",
                            alignItems: "center",
                            justifyContent: "center"
                          }
                        },
                        React.createElement(
                          RN.Text,
                          {
                            style: {
                              color: "#b5bac1",
                              fontSize: 16,
                              fontWeight: "bold",
                              lineHeight: 18
                            }
                          },
                          "✕"
                        )
                      )
                    ),
                    // Subtitle
                    React.createElement(
                      RN.Text,
                      {
                        style: {
                          color: "#949ba4",
                          fontSize: 13,
                          marginBottom: 12,
                          lineHeight: 18
                        }
                      },
                      "Paste or enter your Discord account token below to log in directly."
                    ),
                    // TextInput Area
                    React.createElement(RN.TextInput, {
                      placeholder: "Paste Discord token here...",
                      placeholderTextColor: "#80848e",
                      value: tokenText,
                      onChangeText: function(txt) {
                        tokenTextGlobal = txt;
                        setTokenText(txt);
                        if (errorText || errorTextGlobal) {
                          errorTextGlobal = "";
                          setErrorText("");
                        }
                      },
                      autoCapitalize: "none",
                      autoCorrect: false,
                      secureTextEntry: false,
                      multiline: true,
                      style: {
                        backgroundColor: "#1e1f22",
                        color: "#FFFFFF",
                        borderWidth: 1,
                        borderColor: errorText ? "#fa777c" : "#35373c",
                        borderRadius: 6,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        minHeight: 64,
                        maxHeight: 110,
                        fontSize: 13,
                        textAlignVertical: "top"
                      }
                    }),
                    // Error Text (if any)
                    errorText
                      ? React.createElement(
                          RN.Text,
                          {
                            style: {
                              color: "#fa777c",
                              fontSize: 12,
                              marginTop: 6
                            }
                          },
                          errorText
                        )
                      : null,
                    // Bottom Buttons Row: [📋 Paste] and [Log In]
                    React.createElement(
                      RN.View,
                      {
                        style: {
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: 16
                        }
                      },
                      React.createElement(
                        RN.Pressable,
                        {
                          onPress: handlePasteClipboard,
                          style: {
                            backgroundColor: "#35373c",
                            paddingHorizontal: 12,
                            height: 40,
                            borderRadius: 4,
                            alignItems: "center",
                            justifyContent: "center"
                          }
                        },
                        React.createElement(
                          RN.Text,
                          { style: { color: "#FFFFFF", fontSize: 13, fontWeight: "600" } },
                          "📋 Paste"
                        )
                      ),
                      React.createElement(
                        RN.Pressable,
                        {
                          onPress: handleLoginSubmit,
                          disabled: isLoading,
                          style: {
                            backgroundColor: isLoading ? "#4752c4" : "#5865F2",
                            paddingHorizontal: 20,
                            height: 40,
                            borderRadius: 4,
                            alignItems: "center",
                            justifyContent: "center",
                            flex: 1,
                            marginLeft: 10
                          }
                        },
                        React.createElement(
                          RN.Text,
                          { style: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" } },
                          isLoading ? "Verifying..." : "Log In"
                        )
                      )
                    )
                  )
                )
              )
            );
          }

          // --- Dropdown: Verified Active Accounts Only ---
          function SavedAccountsDropdown() {
            const [isOpen, setIsOpen] = React.useState(false);
            const [verifiedList, setVerifiedList] = React.useState([]);

            React.useEffect(function() {
              let isMounted = true;
              async function filterActiveAccounts() {
                const all = getSavedAccounts();
                if (!all || all.length === 0) {
                  if (isMounted) setVerifiedList([]);
                  return;
                }

                const active = [];
                for (const acc of all) {
                  if (!acc.token || acc.token.length < 40) continue;
                  try {
                    const res = await fetch("https://discord.com/api/v9/users/@me", {
                      headers: { "Authorization": acc.token }
                    });
                    if (res.status === 200) {
                      const data = await res.json().catch(function() { return {}; });
                      active.push({
                        ...acc,
                        username: data.username || acc.username,
                        globalName: data.global_name || acc.globalName || acc.username,
                        avatar: data.avatar || acc.avatar
                      });
                    }
                  } catch(e) {}
                }

                if (isMounted) {
                  setVerifiedList(active);
                }
              }

              filterActiveAccounts();
              return function() { isMounted = false; };
            }, []);

            if (!verifiedList || verifiedList.length === 0) {
              return null;
            }

            return React.createElement(
              RN.View,
              {
                style: { width: "100%", marginVertical: 4 }
              },
              React.createElement(
                RN.Pressable,
                {
                  onPress: function() { setIsOpen(!isOpen); },
                  style: {
                    backgroundColor: "#2b2d31",
                    borderWidth: 1,
                    borderColor: "#35373c",
                    height: 44,
                    borderRadius: 4,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 14
                  }
                },
                React.createElement(
                  RN.Text,
                  { style: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" } },
                  "Select Saved Account (" + verifiedList.length + ")"
                ),
                React.createElement(
                  RN.Text,
                  { style: { color: "#b5bac1", fontSize: 14, fontWeight: "bold" } },
                  isOpen ? "\u25b2" : "\u25bc"
                )
              ),
              isOpen
                ? React.createElement(
                    RN.View,
                    {
                      style: {
                        backgroundColor: "#1e1f22",
                        borderWidth: 1,
                        borderColor: "#35373c",
                        borderRadius: 4,
                        marginTop: 4,
                        maxHeight: 220,
                        overflow: "hidden"
                      }
                    },
                    React.createElement(
                      RN.ScrollView,
                      { nestedScrollEnabled: true },
                      verifiedList.map(function(acc, idx) {
                        const avatarUrl = acc.avatar
                          ? ("https://cdn.discordapp.com/avatars/" + acc.id + "/" + acc.avatar + ".png")
                          : "https://cdn.discordapp.com/embed/avatars/0.png";

                        return React.createElement(
                          RN.Pressable,
                          {
                            key: acc.id || idx,
                            onPress: function() {
                              setIsOpen(false);
                              executeDirectSwitch(acc.token, acc);
                            },
                            style: {
                              flexDirection: "row",
                              alignItems: "center",
                              paddingVertical: 10,
                              paddingHorizontal: 12,
                              borderBottomWidth: idx < verifiedList.length - 1 ? 1 : 0,
                              borderBottomColor: "#2b2d31"
                            }
                          },
                          React.createElement(RN.Image, {
                            source: { uri: avatarUrl },
                            style: { width: 32, height: 32, borderRadius: 16, marginRight: 10 }
                          }),
                          React.createElement(
                            RN.View,
                            { style: { flex: 1 } },
                            React.createElement(
                              RN.Text,
                              { style: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" } },
                              "#" + (idx + 1) + " " + (acc.name || acc.globalName || acc.username)
                            ),
                            React.createElement(
                              RN.Text,
                              { style: { color: "#949ba4", fontSize: 12 } },
                              "@" + acc.username
                            )
                          ),
                          React.createElement(
                            RN.View,
                            {
                              style: {
                                backgroundColor: "#5865F2",
                                paddingHorizontal: 10,
                                paddingVertical: 4,
                                borderRadius: 4
                              }
                            },
                            React.createElement(
                              RN.Text,
                              { style: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" } },
                              "Log In"
                            )
                          )
                        );
                      })
                    )
                  )
                : null
            );
          }

          function LoginScreenContainer() {
            if (!React || !RN) return null;
            return React.createElement(
              RN.View,
              {
                _isTokenBtn: true,
                key: "infernoauth-login-screen-container",
                style: { width: "100%", marginVertical: 6 }
              },
              React.createElement(SavedAccountsDropdown, { key: "infernoauth-dropdown" }),
              React.createElement(TokenLoginSection, { key: "infernoauth-token-section" })
            );
          }

          // --- Single Hook Lifecycle with Debounce Guard ---
          let loginJsxUnpatches = [];
          let loginHookActive = false;

          function detachLoginHook() {
            if (!loginHookActive) return;
            loginHookActive = false;
            while (loginJsxUnpatches.length > 0) {
              const fn = loginJsxUnpatches.pop();
              try { if (typeof fn === "function") fn(); } catch(x) {}
            }
          }

          function attachLoginHook() {
            if (AuthStore?.isAuthenticated?.()) return;
            if (loginHookActive) return;

            const jsxMod = c.findByProps("jsx", "jsxs");
            if (!jsxMod || typeof jsxMod.jsx !== "function") return;

            loginHookActive = true;
            let isRendering = false;
            let lastInjectedTimestamp = 0;

            const patchFn = function(args, res) {
              try {
                if (isRendering) return res;
                if (AuthStore?.isAuthenticated?.()) {
                  detachLoginHook();
                  return res;
                }

                const props = args?.[1];
                if (!props || props._isTokenBtn || typeof props !== "object") return res;

                // Match ONLY the outer Discord Button (has props.text).
                // Inner Pressables only have accessibilityLabel and will NEVER match!
                if (typeof props.onPress !== "function") return res;
                const str = props.text;
                if (typeof str !== "string" || str.length < 5 || str.length > 40) return res;
                if (!/passkey/i.test(str)) return res;

                // No debounce needed! props.text matches exactly once per render.
                // Keeping it mounted on all re-renders guarantees zero keyboard-flicker loops!
                isRendering = true;
                try {
                  return React.createElement(
                    React.Fragment,
                    null,
                    res,
                    React.createElement(LoginScreenContainer, { key: "infernoauth-container-root" })
                  );
                } finally {
                  isRendering = false;
                }
              } catch(x) {}
              return res;
            };

            try {
              loginJsxUnpatches.push(A.after("jsx", jsxMod, patchFn));
            } catch(err) {
              loginHookActive = false;
            }
          }

          if (!AuthStore?.isAuthenticated?.()) {
            attachLoginHook();
          }

          try {
            const disp = vendetta?.metro?.common?.FluxDispatcher || c.findByProps("dispatch", "subscribe");
            if (disp) {
              const uL = disp.subscribe("LOGOUT", function() {
                setTimeout(attachLoginHook, 300);
              });
              const uC = disp.subscribe("CONNECTION_OPEN", detachLoginHook);
              e.patches.push(function() {
                detachLoginHook();
                try { if (typeof uL === "function") uL(); else disp.unsubscribe("LOGOUT", attachLoginHook); } catch(x) {}
                try { if (typeof uC === "function") uC(); else disp.unsubscribe("CONNECTION_OPEN", detachLoginHook); } catch(x) {}
              });
            }
          } catch(x) {}
        }
      } catch(loginErr) {
        console.warn("InfernoAuth login screen patch error", loginErr);
      }

      // ============================================================
      // --- Slash Commands Definitions ---
      // ============================================================
      try {
        function isValidDiscordToken(t) {
          if (!t || typeof t !== "string") return false;
          const s = t.trim().replace(/^["'\s]+|["'\s]+$/g, "");
          const parts = s.split(".");
          return parts.length === 3 && s.length >= 45 && s.length <= 130;
        }

        function copyToClipboard(text) {
          try {
            const clip = vendetta?.metro?.common?.clipboard || B || c.findByProps("setString", "getString");
            if (clip?.setString) {
              clip.setString(text);
              return true;
            }
          } catch(e) {}
          return false;
        }

        function getActualCurrentToken() {
          // 1. AuthenticationStore directly (Discord's true user session store)
          try {
            const authStore = c.findByStoreName("AuthenticationStore");
            if (authStore?.getToken) {
              const t = authStore.getToken();
              if (isValidDiscordToken(t)) return t.trim();
            }
          } catch(e) {}

          // 2. Specific auth module with hideToken/loginToken (avoids FCM push notification token)
          try {
            const authMod = c.findByProps("getToken", "hideToken") || c.findByProps("getToken", "loginToken");
            if (authMod?.getToken) {
              const t = authMod.getToken();
              if (isValidDiscordToken(t)) return t.trim();
            }
          } catch(e) {}

          // 3. AuthenticationStore getTokens map
          try {
            const authStore = c.findByStoreName("AuthenticationStore");
            if (authStore?.getTokens) {
              const tokens = authStore.getTokens();
              if (tokens && typeof tokens === "object") {
                for (const k of Object.keys(tokens)) {
                  if (isValidDiscordToken(tokens[k])) return tokens[k].trim();
                }
              }
            }
          } catch(e) {}

          // 4. Saved accounts matching active user
          try {
            const curUser = c.findByStoreName("UserStore")?.getCurrentUser?.();
            if (curUser?.id) {
              const saved = getSavedAccounts();
              const match = saved.find(function(a) { return a.id === curUser.id; });
              if (match?.token && isValidDiscordToken(match.token)) {
                return match.token.trim();
              }
            }
          } catch(e) {}

          // 5. Generic findByProps("getToken") but validated
          try {
            const gen = c.findByProps("getToken");
            if (gen?.getToken) {
              const t = gen.getToken();
              if (isValidDiscordToken(t)) return t.trim();
            }
          } catch(e) {}

          // 6. Last fallback: any string token from AuthenticationStore
          try {
            const t = c.findByStoreName("AuthenticationStore")?.getToken?.();
            if (t && typeof t === "string" && t.length > 20) return t.trim();
          } catch(e) {}

          return null;
        }

        // ============================================================
        // --- Auto-Onboarding & Member Screening Solvers ---
        // ============================================================
        async function autoSolveOnboarding(guildId, token, superProps) {
          if (!guildId) return null;
          const curUserToken = getActualCurrentToken();
          const targetToken = token || curUserToken;
          if (!targetToken) return null;

          try {
            const isCurUser = (targetToken === curUserToken);
            const HTTP = c.findByProps("get", "post", "put") || c.findByProps("get", "post");

            // 1. Fetch onboarding configuration
            let data = null;
            if (isCurUser && HTTP?.get) {
              try {
                const res = await HTTP.get({ url: "/guilds/" + guildId + "/onboarding" });
                data = res?.body || res;
              } catch(e) {}
            }

            if (!data || !data.prompts) {
              const headers = {
                "Authorization": targetToken,
                "Content-Type": "application/json",
                "Accept": "*/*"
              };
              if (superProps) headers["X-Super-Properties"] = superProps;

              const fetchRes = await fetch("https://discord.com/api/v9/guilds/" + guildId + "/onboarding", {
                headers: headers
              }).catch(function() { return null; });

              if (fetchRes && fetchRes.ok) {
                data = await fetchRes.json().catch(function() { return null; });
              }
            }

            if (!data) return null;

            const prompts = data.prompts || [];
            if (!Array.isArray(prompts) || prompts.length === 0) {
              if (isCurUser) {
                try {
                  const dispatcher = c.findByProps("dispatch", "subscribe");
                  dispatcher?.dispatch?.({ type: "GUILD_ONBOARDING_COMPLETE", guildId: guildId });
                } catch(e) {}
              }
              return { success: true, count: 0 };
            }

            const now = Date.now(); // Milliseconds
            const promptsSeen = {};
            const responsesSeen = {};
            const selectedResponses = [];

            for (const p of prompts) {
              promptsSeen[p.id] = now;
              const options = p.options || [];
              if (!options || options.length === 0) continue;

              for (const opt of options) {
                responsesSeen[opt.id] = now;
              }

              // Pick the LAST option in each prompt
              const lastOption = options[options.length - 1];
              if (lastOption && lastOption.id) {
                selectedResponses.push(lastOption.id);
              }
            }

            if (selectedResponses.length === 0) return null;

            const postPayload = {
              onboarding_responses: selectedResponses,
              onboarding_prompts_seen: promptsSeen,
              onboarding_responses_seen: responsesSeen
            };

            let submitted = false;

            // Try HTTP.post
            if (isCurUser && HTTP?.post) {
              try {
                const postRes = await HTTP.post({
                  url: "/guilds/" + guildId + "/onboarding-responses",
                  body: postPayload
                });
                if (postRes?.status === 200 || postRes?.status === 204 || postRes?.body) {
                  submitted = true;
                }
              } catch(httpErr) {
                if (HTTP?.put) {
                  try {
                    await HTTP.put({
                      url: "/guilds/" + guildId + "/onboarding-responses",
                      body: postPayload
                    });
                    submitted = true;
                  } catch(e) {}
                }
              }
            }

            // Fallback to fetch
            if (!submitted) {
              const headers = {
                "Authorization": targetToken,
                "Content-Type": "application/json",
                "Accept": "*/*"
              };
              if (superProps) headers["X-Super-Properties"] = superProps;

              let postRes = await fetch("https://discord.com/api/v9/guilds/" + guildId + "/onboarding-responses", {
                method: "POST",
                headers: headers,
                body: JSON.stringify(postPayload)
              }).catch(function() { return null; });

              if (postRes && (postRes.status === 200 || postRes.status === 204)) {
                submitted = true;
              } else {
                const putRes = await fetch("https://discord.com/api/v9/guilds/" + guildId + "/onboarding-responses", {
                  method: "PUT",
                  headers: headers,
                  body: JSON.stringify(postPayload)
                }).catch(function() { return null; });
                if (putRes && (putRes.status === 200 || putRes.status === 204)) {
                  submitted = true;
                }
              }
            }

            // Sync client state and close modal
            if (isCurUser) {
              try {
                const dispatcher = c.findByProps("dispatch", "subscribe");
                dispatcher?.dispatch?.({
                  type: "GUILD_ONBOARDING_COMPLETE",
                  guildId: guildId
                });
              } catch(e) {}

              try {
                const modal = c.findByProps("popModal", "closeModal");
                if (modal?.popModal) modal.popModal();
                if (modal?.closeModal) modal.closeModal();
              } catch(e) {}
              try {
                const nav = c.findByProps("goBack", "pop");
                if (nav?.goBack) nav.goBack();
              } catch(e) {}
            }

            return { success: true, count: selectedResponses.length };
          } catch(err) {
            console.warn("Auto-onboarding error for guild " + guildId, err);
          }
          return null;
        }

        async function autoAcceptRules(guildId, token, superProps) {
          if (!guildId) return;
          const curUserToken = getActualCurrentToken();
          const targetToken = token || curUserToken;
          if (!targetToken) return;

          try {
            const isCurUser = (targetToken === curUserToken);
            const HTTP = c.findByProps("get", "post", "put") || c.findByProps("get", "post");

            let ruleData = null;
            if (isCurUser && HTTP?.get) {
              try {
                const res = await HTTP.get({ url: "/guilds/" + guildId + "/member-verification?with_guild=false" });
                ruleData = res?.body || res;
              } catch(e) {}
            }

            if (!ruleData) {
              const headers = {
                "Authorization": targetToken,
                "Content-Type": "application/json",
                "Accept": "*/*"
              };
              if (superProps) headers["X-Super-Properties"] = superProps;

              const ruleRes = await fetch("https://discord.com/api/v9/guilds/" + guildId + "/member-verification?with_guild=false", {
                headers: headers
              }).catch(function() { return null; });

              if (ruleRes && ruleRes.status === 200) {
                ruleData = await ruleRes.json().catch(function() { return null; });
              }
            }

            if (ruleData?.form_fields && Array.isArray(ruleData.form_fields) && ruleData.form_fields.length > 0) {
              const payload = {
                form_fields: ruleData.form_fields.map(function(f) {
                  return { ...f, response: true };
                }),
                version: ruleData.version
              };

              if (isCurUser && HTTP?.put) {
                try {
                  await HTTP.put({ url: "/guilds/" + guildId + "/requests/@me", body: payload });
                  return;
                } catch(e) {}
              }

              const headers = {
                "Authorization": targetToken,
                "Content-Type": "application/json",
                "Accept": "*/*"
              };
              if (superProps) headers["X-Super-Properties"] = superProps;

              await fetch("https://discord.com/api/v9/guilds/" + guildId + "/requests/@me", {
                method: "PUT",
                headers: headers,
                body: JSON.stringify(payload)
              }).catch(function() {});
            }
          } catch(e) {}
        }

        const r = {
          // --- /token get and /gettoken ---
          get(o, t) {
            try {
              const curUser = c.findByStoreName("UserStore")?.getCurrentUser?.();
              const n = {
                ...p,
                interaction: {
                  name: "/gettoken",
                  user: curUser
                }
              };
              const tokenVal = getActualCurrentToken();
              let copied = false;
              if (tokenVal) {
                copied = copyToClipboard(tokenVal);
                if (copied) {
                  C?.showToast?.("Token copied to clipboard!");
                }
              }

              m({
                loggingName: "Token get output message",
                channelId: t.channel.id,
                embeds: [{
                  color: u(),
                  type: "rich",
                  title: "Token of Current Account (" + (curUser?.username ? "@" + curUser.username : "Active Session") + ")",
                  description: tokenVal
                    ? "```\n" + tokenVal + "\n```\n" + (copied ? "📋 **Copied to your clipboard automatically!**\n\n" : "") + "*Keep your token private and never share it with untrusted parties.*"
                    : "⚠️ **Could not retrieve an active token from memory.**",
                  footer: { text: "InfernoAuth Suite • Real Active Account Token" }
                }]
              }, n);
            } catch(n) {
              console.error(n);
              console.error("Error in /gettoken:", n);
            }
          },

          // --- /token login ---
          async login(o, t) {
            const n = {
              ...p,
              interaction: {
                name: "/token login",
                user: c.findByStoreName("UserStore").getCurrentUser()
              }
            };

            try {
              let s = (new Map(o.map(function(l) { return [l.name, l]; }))).get("token")?.value;
              if (!s || typeof s !== "string" || s.trim().length < 40) {
                return m({
                  loggingName: "Token login error",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 15158332,
                    type: "rich",
                    title: "Invalid Token Format",
                    description: "Please provide a valid, complete Discord token."
                  }]
                }, n);
              }

              s = s.trim().replace(/^["'\s]+|["'\s]+$/g, "");

              let superProps = null;
              try {
                const spMod = c.findByProps("getSuperPropertiesBase64");
                if (spMod?.getSuperPropertiesBase64) superProps = spMod.getSuperPropertiesBase64();
              } catch(e) {}

              const verifyHeaders = {
                "Authorization": s,
                "Content-Type": "application/json",
                "Accept": "*/*"
              };
              if (superProps) verifyHeaders["X-Super-Properties"] = superProps;

              let res = null;
              try {
                res = await fetch("https://discord.com/api/v9/users/@me", {
                  headers: verifyHeaders
                });
              } catch(netErr) {
                return m({
                  loggingName: "Token login network error",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 15158332,
                    type: "rich",
                    title: "❌ Network Connection Error",
                    description: "Could not reach Discord servers to verify token."
                  }]
                }, n);
              }

              if (res.status === 401) {
                return m({
                  loggingName: "Token login unauthorized",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 15158332,
                    type: "rich",
                    title: "❌ Invalid Token (401 Unauthorized)",
                    description: "Discord rejected this token. It may have expired or the password was changed."
                  }]
                }, n);
              }

              if (res.status === 403) {
                const errJson = await res.json().catch(function() { return {}; });
                return m({
                  loggingName: "Token login forbidden",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 15158332,
                    type: "rich",
                    title: "⚠️ Account Restricted / Flagged (403)",
                    description: "Discord reported that this account is restricted or locked: **" + (errJson.message || "Forbidden") + "**\n\n" +
                                 "Login was safely aborted to protect your device session."
                  }]
                }, n);
              }

              const targetUser = await res.json();
              m({
                loggingName: "Token login progress",
                channelId: t.channel.id,
                embeds: [{
                  color: u(),
                  type: "rich",
                  title: "<" + w.getLoading() + "> Switching Accounts Safely...",
                  description: "Authenticated as **" + (targetUser.global_name || targetUser.username) + "** (`" + targetUser.username + "`)\n" +
                               "⚡ Disconnecting old socket & rebooting session cleanly..."
                }]
              }, n);

              // Auto-save to Multi-Account Manager
              saveAccount({
                id: targetUser.id,
                username: targetUser.username,
                globalName: targetUser.global_name || targetUser.username,
                token: s,
                avatar: targetUser.avatar,
                addedAt: Date.now()
              });

              setTimeout(function() {
                try {
                  switchAccount(s);
                } catch(err) {
                  m({
                    loggingName: "Switch failure",
                    channelId: t.channel.id,
                    embeds: [{
                      color: 15158332,
                      type: "rich",
                      title: "Failed to Apply Session",
                      description: err.message
                    }]
                  }, n);
                }
              }, 400);

            } catch(err) {
              console.error(err);
              m({
                loggingName: "Token login exception",
                channelId: t.channel.id,
                embeds: [{
                  color: 15158332,
                  type: "rich",
                  title: "Error executing login",
                  description: err.message
                }]
              }, n);
            }
          },

          // --- /token switch ---
          async switch(o, t) {
            const n = {
              ...p,
              interaction: {
                name: "/token switch",
                user: c.findByStoreName("UserStore").getCurrentUser()
              }
            };

            try {
              const query = (new Map(o.map(function(l) { return [l.name, l]; }))).get("account")?.value;
              if (!query) {
                return m({
                  loggingName: "Switch missing param",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 15158332,
                    type: "rich",
                    title: "Missing Account Parameter",
                    description: "Please specify the account number (e.g. `1`, `2`) or username. Use `/token account list` to see your accounts."
                  }]
                }, n);
              }

              const target = findAccountByQuery(query);
              if (!target || !target.token) {
                return m({
                  loggingName: "Switch not found",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 15158332,
                    type: "rich",
                    title: "Account Not Found",
                    description: "Could not find account matching `" + query + "`.\nUse `/token account list` to check your saved alts."
                  }]
                }, n);
              }

              m({
                loggingName: "Switch in progress",
                channelId: t.channel.id,
                embeds: [{
                  color: u(),
                  type: "rich",
                  title: "<" + w.getLoading() + "> Switching to " + (target.globalName || target.username) + "...",
                  description: "Account: **" + (target.name ? target.name + " (" + target.username + ")" : target.username) + "**\nSwitching session..."
                }]
              }, n);

              setTimeout(function() {
                try {
                  switchAccount(target.token);
                } catch(err) {
                  m({
                    loggingName: "Switch execution error",
                    channelId: t.channel.id,
                    embeds: [{
                      color: 15158332,
                      type: "rich",
                      title: "Failed to Switch",
                      description: err.message
                    }]
                  }, n);
                }
              }, 400);

            } catch(err) {
              console.error(err);
              m({
                loggingName: "Switch exception",
                channelId: t.channel.id,
                embeds: [{
                  color: 15158332,
                  type: "rich",
                  title: "Error in /token switch",
                  description: err.message
                }]
              }, n);
            }
          },

          // --- /token account (add, list, remove, clear) ---
          async account(o, t) {
            const n = {
              ...p,
              interaction: {
                name: "/token account",
                user: c.findByStoreName("UserStore").getCurrentUser()
              }
            };

            try {
              const optMap = new Map(o.map(function(l) { return [l.name, l]; }));
              const action = optMap.get("action")?.value || "list";

              if (action === "list") {
                const accounts = getSavedAccounts();
                const curUser = c.findByStoreName("UserStore").getCurrentUser();

                if (accounts.length === 0) {
                  return m({
                    loggingName: "Account list empty",
                    channelId: t.channel.id,
                    embeds: [{
                      color: u(),
                      type: "rich",
                      title: "Saved Accounts (0)",
                      description: "No saved accounts found in storage.\nAdd accounts using `/token account action:add token:<token> name:<optional_nickname>`."
                    }]
                  }, n);
                }

                let desc = "**Saved Multi-Accounts (" + accounts.length + ")**\n\n";
                accounts.forEach(function(acc, idx) {
                  const num = idx + 1;
                  const isCurrent = curUser && (curUser.id === acc.id || curUser.username === acc.username);
                  const activeBadge = isCurrent ? "  *(Active)*" : "";
                  const displayName = acc.name ? "**" + acc.name + "** (`@" + acc.username + "`)" : "**@" + acc.username + "**";
                  desc += "`[#" + num + "]` " + displayName + activeBadge + "\n";
                  desc += "• User ID: `" + (acc.id || "Unknown") + "`\n";
                  desc += "• Switch command: `/token switch account:" + num + "`\n\n";
                });

                return m({
                  loggingName: "Account list",
                  channelId: t.channel.id,
                  embeds: [{
                    color: u(),
                    type: "rich",
                    title: "Multi-Account Manager",
                    description: desc.trim(),
                    footer: { text: "Use /token switch to jump between alts instantly" }
                  }]
                }, n);
              }

              if (action === "save") {
                const nickname = optMap.get("name")?.value;
                const curUser = c.findByStoreName("UserStore")?.getCurrentUser?.();
                const curToken = getActualCurrentToken();

                if (!curToken) {
                  return m({
                    loggingName: "Account save missing token",
                    channelId: t.channel.id,
                    embeds: [{
                      color: 15158332,
                      type: "rich",
                      title: "Current Token Not Found",
                      description: "Could not retrieve the active account token from memory. Please try logging in again or use `/token account action:add`."
                    }]
                  }, n);
                }

                if (!curUser || !curUser.id) {
                  return m({
                    loggingName: "Account save missing user",
                    channelId: t.channel.id,
                    embeds: [{
                      color: 15158332,
                      type: "rich",
                      title: "User Not Identified",
                      description: "Could not identify the active Discord user session."
                    }]
                  }, n);
                }

                const finalName = nickname && nickname.trim() ? nickname.trim() : (curUser.global_name || curUser.username);

                saveAccount({
                  id: curUser.id,
                  username: curUser.username,
                  globalName: curUser.global_name || curUser.username,
                  name: finalName,
                  token: curToken,
                  avatar: curUser.avatar,
                  addedAt: Date.now()
                });

                const accounts = getSavedAccounts();
                const accountIndex = accounts.findIndex(function(a) { return a.id === curUser.id || a.token === curToken; }) + 1;
                const total = accounts.length;

                C?.showToast?.("Current account saved as " + finalName);

                return m({
                  loggingName: "Account save success",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 3066993,
                    type: "rich",
                    title: "Active Account Saved!",
                    description: "Saved current active account **" + (curUser.global_name || curUser.username) + "** (`@" + curUser.username + "`)\n\n" +
                                 "• Custom Nickname: **" + finalName + "**\n" +
                                 "• Account Index: `#" + (accountIndex > 0 ? accountIndex : total) + "`\n" +
                                 "• Total Saved Accounts: **" + total + "**\n\n" +
                                 "You can switch back to this account anytime with:\n" +
                                 "`/token switch account:" + (accountIndex > 0 ? accountIndex : total) + "` or `/token switch account:" + finalName + "`"
                  }]
                }, n);
              }

              if (action === "add") {
                let tokenInput = optMap.get("token")?.value;
                const nickname = optMap.get("name")?.value;

                if (!tokenInput || typeof tokenInput !== "string" || tokenInput.trim().length < 40) {
                  return m({
                    loggingName: "Account add missing token",
                    channelId: t.channel.id,
                    embeds: [{
                      color: 15158332,
                      type: "rich",
                      title: "Missing or Invalid Token",
                      description: "Please provide a valid Discord token in the `token` parameter to save."
                    }]
                  }, n);
                }

                tokenInput = tokenInput.trim().replace(/^["'\s]+|["'\s]+$/g, "");
                let res = null;
                try {
                  res = await fetch("https://discord.com/api/v9/users/@me", {
                    headers: { "Authorization": tokenInput }
                  });
                } catch(netErr) {
                  return m({
                    loggingName: "Account add network error",
                    channelId: t.channel.id,
                    embeds: [{
                      color: 15158332,
                      type: "rich",
                      title: "Network Connection Error",
                      description: "Could not reach Discord servers to verify account details."
                    }]
                  }, n);
                }

                if (res.status === 401) {
                  return m({
                    loggingName: "Account add invalid",
                    channelId: t.channel.id,
                    embeds: [{
                      color: 15158332,
                      type: "rich",
                      title: "Invalid Token (401)",
                      description: "Discord rejected this token. Please double check that it is valid and active."
                    }]
                  }, n);
                }

                const userData = await res.json();
                saveAccount({
                  id: userData.id,
                  username: userData.username,
                  globalName: userData.global_name || userData.username,
                  name: nickname ? nickname.trim() : null,
                  token: tokenInput,
                  avatar: userData.avatar,
                  addedAt: Date.now()
                });

                const total = getSavedAccounts().length;
                return m({
                  loggingName: "Account add success",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 3066993,
                    type: "rich",
                    title: "Account Added Successfully!",
                    description: "Added **" + (userData.global_name || userData.username) + "** (`@" + userData.username + "`)\n" +
                                 (nickname ? "Nickname: **" + nickname + "**\n" : "") +
                                 "Total Saved Accounts: **" + total + "**\n\n" +
                                 "Jump to this account anytime using `/token switch account:" + total + "`!"
                  }]
                }, n);
              }

              if (action === "remove") {
                const targetQuery = optMap.get("target")?.value || optMap.get("name")?.value;
                if (!targetQuery) {
                  return m({
                    loggingName: "Account remove missing target",
                    channelId: t.channel.id,
                    embeds: [{
                      color: 15158332,
                      type: "rich",
                      title: "Missing Target Account",
                      description: "Please specify the account number (e.g. `1`, `2`), nickname, or username in `target` to remove."
                    }]
                  }, n);
                }

                const removed = removeAccountByQuery(targetQuery);
                if (!removed) {
                  return m({
                    loggingName: "Account remove not found",
                    channelId: t.channel.id,
                    embeds: [{
                      color: 15158332,
                      type: "rich",
                      title: "Account Not Found",
                      description: "Could not find any saved account matching `" + targetQuery + "`."
                    }]
                  }, n);
                }

                return m({
                  loggingName: "Account remove success",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 3066993,
                    type: "rich",
                    title: "Account Removed",
                    description: "Successfully removed **" + (removed.globalName || removed.username) + "** (`@" + removed.username + "`) from saved accounts."
                  }]
                }, n);
              }

              if (action === "clear") {
                const st = getStorage();
                const count = Array.isArray(st.savedAccounts) ? st.savedAccounts.length : 0;
                st.savedAccounts = [];
                return m({
                  loggingName: "Account clear success",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 3066993,
                    type: "rich",
                    title: "Saved Accounts Cleared",
                    description: "Removed all **" + count + "** saved account(s) from local storage."
                  }]
                }, n);
              }

            } catch(err) {
              console.error(err);
              m({
                loggingName: "Account exception",
                channelId: t.channel.id,
                embeds: [{
                  color: 15158332,
                  type: "rich",
                  title: "Error in /token account",
                  description: err.message
                }]
              }, n);
            }
          },

          // --- /onboard (Auto-Solve Community Onboarding on Current Guild) ---
          async onboard(o, t) {
            const curUser = c.findByStoreName("UserStore")?.getCurrentUser?.();
            const n = {
              ...p,
              interaction: {
                name: "/onboard",
                user: curUser
              }
            };

            try {
              const guildId = t.channel?.guild_id || t.guild?.id || c.findByStoreName("SelectedGuildStore")?.getGuildId?.();
              if (!guildId) {
                return m({
                  loggingName: "Onboard no guild",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 0xed4245,
                    type: "rich",
                    title: "❌ No Server Detected",
                    description: "Please run `/onboard` inside a server channel."
                  }]
                }, n);
              }

              const curToken = getActualCurrentToken();
              if (!curToken) {
                return m({
                  loggingName: "Onboard no token",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 0xed4245,
                    type: "rich",
                    title: "❌ Active Token Unavailable",
                    description: "Could not retrieve the active session token."
                  }]
                }, n);
              }

              let superProps = null;
              try {
                const spMod = c.findByProps("getSuperPropertiesBase64");
                if (spMod?.getSuperPropertiesBase64) superProps = spMod.getSuperPropertiesBase64();
              } catch(x) {}

              C?.showToast?.("⚡ AutoOnboard: Solving questions (last options)...");

              const onb = await autoSolveOnboarding(guildId, curToken, superProps);
              await autoAcceptRules(guildId, curToken, superProps);

              if (onb && onb.success) {
                return m({
                  loggingName: "Onboard success",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 0x57f287,
                    type: "rich",
                    title: "⚡ Onboarding Completed Automatically!",
                    description: "Successfully answered **" + onb.count + " onboarding question(s)** on this server!\n\n" +
                                 "• **Selected Choices:** Last option for each question\n" +
                                 "• **Rules / Member Screening:** Accepted\n" +
                                 "• **Roles & Channels:** Unlocked",
                    footer: { text: "InfernoAuth AutoOnboard Engine" }
                  }]
                }, n);
              } else {
                return m({
                  loggingName: "Onboard no prompts",
                  channelId: t.channel.id,
                  embeds: [{
                    color: u(),
                    type: "rich",
                    title: "ℹ️ No Pending Onboarding Questions",
                    description: "This server either has no community onboarding enabled or all questions are already completed.",
                    footer: { text: "InfernoAuth AutoOnboard Engine" }
                  }]
                }, n);
              }
            } catch(err) {
              console.error("Error in /onboard:", err);
              return m({
                loggingName: "Onboard error",
                channelId: t.channel.id,
                embeds: [{
                  color: 0xed4245,
                  type: "rich",
                  title: "❌ Onboarding Error",
                  description: "An unexpected error occurred: `" + String(err?.message || err) + "`"
                }]
              }, n);
            }
          },

          // --- /token join / /joinserver (Batch Server Joiner) ---
          async join(o, t) {
            const n = {
              ...p,
              interaction: {
                name: "/token join",
                user: c.findByStoreName("UserStore").getCurrentUser()
              }
            };

            try {
              const optMap = new Map(o.map(function(l) { return [l.name, l]; }));
              let inviteInput = optMap.get("invite")?.value || "";
              if (!inviteInput || typeof inviteInput !== "string") {
                return m({
                  loggingName: "Join missing invite",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 15158332,
                    type: "rich",
                    title: "Missing Invite",
                    description: "Please provide a valid server invite link or code (e.g. `discord.gg/code` or `code`)."
                  }]
                }, n);
              }

              const match = inviteInput.match(/(?:discord\.gg\/|discord\.com\/invite\/)?([a-zA-Z0-9-]+)/);
              const inviteCode = match ? match[1] : inviteInput.trim();

              // Resolve invite details
              let inviteInfo = null;
              try {
                const invRes = await fetch("https://discord.com/api/v9/invites/" + inviteCode);
                if (invRes.status === 200) {
                  inviteInfo = await invRes.json();
                }
              } catch(e) {}

              const serverName = inviteInfo?.guild?.name || "Server (" + inviteCode + ")";

              const scopeAll = Boolean(optMap.get("scopeall")?.value || optMap.get("all")?.value);
              const curToken = getActualCurrentToken();
              const curUser = c.findByStoreName("UserStore").getCurrentUser();

              let targetList = [];
              if (scopeAll) {
                // Gather active account + all saved accounts (deduplicated by token)
                const saved = getSavedAccounts();
                const tokenMap = new Map();
                if (curToken) {
                  tokenMap.set(curToken, {
                    name: curUser ? "@" + curUser.username + " (Active)" : "Active User",
                    token: curToken
                  });
                }
                saved.forEach(function(acc) {
                  if (acc.token && !tokenMap.has(acc.token)) {
                    tokenMap.set(acc.token, {
                      name: "@" + acc.username + (acc.name ? " (" + acc.name + ")" : ""),
                      token: acc.token
                    });
                  }
                });
                targetList = Array.from(tokenMap.values());
              } else {
                // Default: ONLY active account
                if (curToken) {
                  targetList = [{
                    name: curUser ? "@" + curUser.username + " (Active)" : "Active User",
                    token: curToken
                  }];
                }
              }

              if (targetList.length === 0) {
                return m({
                  loggingName: "Join no tokens",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 15158332,
                    type: "rich",
                    title: "No Accounts Found",
                    description: "Could not retrieve current token or saved accounts."
                  }]
                }, n);
              }

              m({
                loggingName: "Join progress",
                channelId: t.channel.id,
                embeds: [{
                  color: u(),
                  type: "rich",
                  title: "<" + w.getLoading() + "> Joining " + serverName + "...",
                  description: "Processing **" + targetList.length + "** account(s) in parallel with instant auto-onboarding..."
                }]
              }, n);

              const joinResultsMap = new Map();

              if (targetList.length > 1) {
                C?.showToast?.("⚡ Joining " + serverName + " across " + targetList.length + " accounts in parallel...");
              }

              let superProps = "";
              try {
                const spMod = c.findByProps("getSuperPropertiesBase64");
                if (spMod?.getSuperPropertiesBase64) superProps = spMod.getSuperPropertiesBase64();
              } catch(x) {}

              // Parallel execution across all target accounts
              await Promise.all(targetList.map(async function(item) {
                const isActiveAccount = (item.token === curToken);

                // For the ACTIVE account: use native Discord client join + auto-onboard
                if (isActiveAccount) {
                  try {
                    const targetGuildId = inviteInfo?.guild?.id;
                    if (targetGuildId) {
                      try {
                        const dispatcher = c.findByProps("dispatch", "subscribe");
                        dispatcher?.dispatch?.({ type: "GUILD_ONBOARDING_COMPLETE", guildId: targetGuildId });
                      } catch(e) {}
                    }

                    const nativeMod = c.findByProps("acceptInviteAndTransitionToInviteChannel");
                    if (nativeMod?.acceptInviteAndTransitionToInviteChannel) {
                      await nativeMod.acceptInviteAndTransitionToInviteChannel({
                        inviteKey: inviteCode,
                        context: { location: "Invite Button Embed" }
                      });
                      let onbNote = "";
                      if (targetGuildId) {
                        const onb = await autoSolveOnboarding(targetGuildId, item.token, superProps);
                        if (onb && onb.success) {
                          onbNote = " ⚡ *(Auto-completed " + onb.count + " onboarding questions - last options)*";
                        }
                        await autoAcceptRules(targetGuildId, item.token, superProps);
                      }
                      joinResultsMap.set(item.token, "• " + item.name + ": **Joined successfully! (Native)**" + onbNote);
                      return;
                    }
                  } catch(nativeErr) {
                    console.warn("Native invite join failed, trying REST for active account", nativeErr);
                  }
                }

                // For ALT accounts (or REST fallback): REST API join + auto-onboard in parallel
                try {
                  const joinHeaders = {
                    "Authorization": item.token,
                    "Content-Type": "application/json",
                    "Accept": "*/*"
                  };
                  if (superProps) joinHeaders["X-Super-Properties"] = superProps;

                  const joinRes = await fetch("https://discord.com/api/v9/invites/" + inviteCode, {
                    method: "POST",
                    headers: joinHeaders,
                    body: JSON.stringify({})
                  });

                  const joinJson = await joinRes.json().catch(function() { return {}; });
                  const targetGuildId = inviteInfo?.guild?.id || joinJson?.guild?.id;

                  if (joinRes.status === 200) {
                    let onbNote = "";
                    if (targetGuildId) {
                      const onb = await autoSolveOnboarding(targetGuildId, item.token, superProps);
                      if (onb && onb.success) {
                        onbNote = " ⚡ *(Auto-completed " + onb.count + " onboarding questions - last options)*";
                      }
                      await autoAcceptRules(targetGuildId, item.token, superProps);
                    }
                    joinResultsMap.set(item.token, "• " + item.name + ": **Joined successfully!**" + onbNote);
                  } else if (joinRes.status === 400) {
                    const errJson = joinJson;
                    if (errJson.captcha_key || errJson.captcha_sitekey) {
                      joinResultsMap.set(item.token, "• " + item.name + ": \u26a0\ufe0f *Requires CAPTCHA (verify manually)*");
                    } else if (errJson.message && /already/i.test(errJson.message)) {
                      let onbNote = "";
                      if (targetGuildId) {
                        const onb = await autoSolveOnboarding(targetGuildId, item.token, superProps);
                        if (onb && onb.success) {
                          onbNote = " ⚡ *(Auto-completed " + onb.count + " onboarding questions - last options)*";
                        }
                        await autoAcceptRules(targetGuildId, item.token, superProps);
                      }
                      joinResultsMap.set(item.token, "• " + item.name + ": *Already a member*" + onbNote);
                    } else {
                      joinResultsMap.set(item.token, "• " + item.name + ": *Failed — " + (errJson.message || "Bad Request") + "*");
                    }
                  } else if (joinRes.status === 401) {
                    joinResultsMap.set(item.token, "• " + item.name + ": *Token invalid or expired (401)*");
                  } else if (joinRes.status === 403) {
                    joinResultsMap.set(item.token, "• " + item.name + ": *Access denied (403)*");
                  } else if (joinRes.status === 429) {
                    joinResultsMap.set(item.token, "• " + item.name + ": *Rate limited (429)*");
                  } else {
                    joinResultsMap.set(item.token, "• " + item.name + ": *HTTP " + joinRes.status + "*");
                  }
                } catch(netErr) {
                  joinResultsMap.set(item.token, "• " + item.name + ": *Network error: " + netErr.message + "*");
                }
              }));

              const results = targetList.map(function(item) {
                return joinResultsMap.get(item.token) || ("• " + item.name + ": *Failed to join*");
              });

              return m({
                loggingName: "Join completed",
                channelId: t.channel.id,
                embeds: [{
                  color: 3066993,
                  type: "rich",
                  title: "⚡ Join Results: " + serverName,
                  description: results.join("\n"),
                  footer: { text: "Scope: " + (scopeAll ? "All Accounts (Active + Alts) • Parallel Join & Onboard" : "Active Account Only") }
                }]
              }, n);

            } catch(err) {
              console.error(err);
              m({
                loggingName: "Join exception",
                channelId: t.channel.id,
                embeds: [{
                  color: 15158332,
                  type: "rich",
                  title: "Error in /token join",
                  description: err.message
                }]
              }, n);
            }
          },

          // --- /token logout and /logout (Safe Logout without Token Reset) ---
          async logout(o, t) {
            const curUser = c.findByStoreName("UserStore")?.getCurrentUser?.();
            const n = {
              ...p,
              interaction: {
                name: "/token logout",
                user: curUser
              }
            };

            try {
              const curToken = getActualCurrentToken();
              let copied = false;
              if (curToken) {
                copied = copyToClipboard(curToken);
                if (curUser?.id) {
                  saveAccount({
                    id: curUser.id,
                    username: curUser.username,
                    globalName: curUser.global_name || curUser.username,
                    token: curToken,
                    avatar: curUser.avatar,
                    addedAt: Date.now()
                  });
                }
              }

              m({
                loggingName: "Logout progress",
                channelId: t.channel.id,
                embeds: [{
                  color: 15158332,
                  type: "rich",
                  title: "Safe Logout Initiated",
                  description: (curToken && copied
                    ? "📋 **Your active token has been copied to your clipboard!**\n\n"
                    : "") +
                    "🔒 **Logging out safely without token reset.**\n" +
                    "Your token was NOT invalidated or revoked on Discord servers. You can reuse this token anytime to log back in.",
                  footer: { text: "InfernoAuth Suite • Safe Client Logout (Zero Token Invalidation)" }
                }]
              }, n);

              if (copied) {
                C?.showToast?.("Token copied to clipboard! Logging out safely...");
              } else {
                C?.showToast?.("Logging out safely without token reset...");
              }

              setTimeout(function() {
                // 1. Dispatch client-side LOGOUT action (pure client-side transition, ZERO API calls to Discord backend!)
                try {
                  const disp = vendetta?.metro?.common?.FluxDispatcher || c.findByProps("dispatch", "subscribe");
                  if (disp?.dispatch) {
                    disp.dispatch({ type: "LOGOUT" });
                  }
                } catch(e) {
                  console.warn("LOGOUT dispatch error", e);
                }

                // 2. Clear token from client auth caches so Discord doesn't auto-reconnect
                try {
                  const setTokenMod = c.findByProps("setToken");
                  if (setTokenMod?.setToken) setTokenMod.setToken(null);
                } catch(e) {}

                try {
                  const loginMod = c.findByProps("loginToken");
                  if (loginMod?.setToken) loginMod.setToken(null);
                } catch(e) {}

                try {
                  const switchMod = c.findByProps("switchAccountToken");
                  if (switchMod?.switchAccountToken) switchMod.switchAccountToken(null);
                } catch(e) {}

                // 3. Disconnect Gateway WebSocket
                try {
                  const gw = c.findByProps("connect", "reconnect");
                  if (gw?.close) gw.close();
                  else if (gw?.disconnect) gw.disconnect();
                } catch(e) {}

                // 4. Attach Login Hook so our login UI is ready
                try {
                  attachLoginHook();
                } catch(e) {}

                // 5. Clean bundle reload after 500ms to land cleanly on the login screen
                setTimeout(function() {
                  const reloader = (window.nativeModuleProxy && window.nativeModuleProxy.BundleUpdaterManager) || c.findByProps("reload");
                  if (reloader && typeof reloader.reload === "function") {
                    reloader.reload();
                  } else {
                    C?.showToast?.("Logged out! Token copied safely to clipboard.");
                  }
                }, 500);
              }, 400);

            } catch(err) {
              console.error(err);
              m({
                loggingName: "Logout exception",
                channelId: t.channel.id,
                embeds: [{
                  color: 15158332,
                  type: "rich",
                  title: "Failed to Log Out",
                  description: err.message
                }]
              }, n);
            }
          },

          // --- /background command ---
          background(o, t) {
            try {
              const curUser = c.findByStoreName("UserStore")?.getCurrentUser?.();
              const n = {
                ...p,
                interaction: {
                  name: "/background",
                  user: curUser
                }
              };

              const typeOpt = o.find(function(x) { return x.name === "type"; })?.value;
              const linkOpt = o.find(function(x) { return x.name === "link"; })?.value;
              const blurOpt = o.find(function(x) { return x.name === "blur"; })?.value;
              const opacityOpt = o.find(function(x) { return x.name === "opacity"; })?.value;

              if (typeOpt === "reset") {
                return r.backgroundreset(o, t);
              }

              let blur = (blurOpt !== undefined && blurOpt !== null) ? parseInt(blurOpt, 10) : null;
              if (blur !== null && isNaN(blur)) blur = null;

              let opacity = (opacityOpt !== undefined && opacityOpt !== null) ? parseFloat(opacityOpt) : null;
              if (opacity !== null) {
                if (isNaN(opacity)) opacity = null;
                else if (opacity > 1) opacity = opacity / 100;
                if (opacity !== null) opacity = Math.max(0.05, Math.min(1.0, opacity));
              }

              let finalUrl = "";
              let finalBlur = 0;
              let finalOpacity = 0.85;
              let typeLabel = "";

              const DEFAULT_FROSTED_URL = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

              if (typeOpt === "frosted_glass") {
                typeLabel = "Frosted Glass Acrylic";
                finalUrl = (linkOpt && (linkOpt.startsWith("http://") || linkOpt.startsWith("https://"))) ? linkOpt : DEFAULT_FROSTED_URL;
                finalBlur = (blur !== null) ? blur : 15;
                finalOpacity = (opacity !== null) ? opacity : 0.75;
              } else if (typeOpt === "custom_url") {
                typeLabel = "Custom Image URL";
                if (!linkOpt || (!linkOpt.startsWith("http://") && !linkOpt.startsWith("https://"))) {
                  return m({
                    loggingName: "Background error",
                    channelId: t.channel.id,
                    embeds: [{
                      color: 0xed4245,
                      type: "rich",
                      title: "❌ Missing or Invalid Image Link",
                      description: "Please provide a valid image URL in the `link` parameter.\n\n" +
                                   "**Example:**\n" +
                                   "`/background type:Custom URL link:https://i.imgur.com/example.png blur:5 opacity:0.85`",
                      footer: { text: "InfernoAuth Theme Engine" }
                    }]
                  }, n);
                }
                finalUrl = linkOpt;
                finalBlur = (blur !== null) ? blur : 0;
                finalOpacity = (opacity !== null) ? opacity : 0.85;
              } else {
                return m({
                  loggingName: "Background error",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 0xed4245,
                    type: "rich",
                    title: "❌ Invalid Background Type",
                    description: "Please select either `frosted_glass` or `custom_url`.",
                    footer: { text: "InfernoAuth Theme Engine" }
                  }]
                }, n);
              }

              const newCfg = {
                enabled: true,
                type: typeOpt,
                url: finalUrl,
                blur: finalBlur,
                opacity: finalOpacity,
                updatedAt: Date.now()
              };

              setBackgroundConfig(newCfg);
              C?.showToast?.("Background applied!");

              return m({
                loggingName: "Background success",
                channelId: t.channel.id,
                embeds: [{
                  color: 0x57f287,
                  type: "rich",
                  title: "🎨 InfernoAuth Background Applied!",
                  description: "Custom chat wallpaper has been successfully configured and activated.\n\n" +
                               "• **Mode:** `" + typeLabel + "`\n" +
                               "• **Blur Radius:** `" + finalBlur + "px`\n" +
                               "• **Opacity:** `" + finalOpacity + "`\n" +
                               "• **Wallpaper Source:** [View Image](" + finalUrl + ")\n\n" +
                               "💡 *Tip: If the new wallpaper does not appear immediately, switch channels once to refresh the chat view.*",
                  image: { url: finalUrl },
                  footer: { text: "InfernoAuth Suite • Use /backgroundreset to restore default" }
                }]
              }, n);
            } catch(err) {
              console.error("Error in /background:", err);
              return m({
                loggingName: "Background error",
                channelId: t.channel.id,
                embeds: [{
                  color: 0xed4245,
                  type: "rich",
                  title: "❌ Error Applying Background",
                  description: "An unexpected error occurred: `" + String(err?.message || err) + "`",
                  footer: { text: "InfernoAuth Error Handler" }
                }]
              }, n);
            }
          },

          // --- /backgroundreset command ---
          backgroundreset(o, t) {
            try {
              const curUser = c.findByStoreName("UserStore")?.getCurrentUser?.();
              const n = {
                ...p,
                interaction: {
                  name: "/backgroundreset",
                  user: curUser
                }
              };

              const resetCfg = {
                enabled: false,
                type: "none",
                url: null,
                blur: 0,
                opacity: 1,
                updatedAt: Date.now()
              };

              setBackgroundConfig(resetCfg);
              C?.showToast?.("Background reset to default!");

              return m({
                loggingName: "Background reset",
                channelId: t.channel.id,
                embeds: [{
                  color: u(),
                  type: "rich",
                  title: "🔄 InfernoAuth Background Reset",
                  description: "Custom chat background has been removed.\n\n" +
                               "• Default Discord theme appearance has been restored.\n" +
                               "• Any active wallpaper overlay was cleared.\n\n" +
                               "💡 *Tip: Switch channels once to refresh the chat view.*",
                  footer: { text: "InfernoAuth Theme Engine" }
                }]
              }, n);
            } catch(err) {
              console.error("Error in /backgroundreset:", err);
              return m({
                loggingName: "Background error",
                channelId: t.channel.id,
                embeds: [{
                  color: 0xed4245,
                  type: "rich",
                  title: "❌ Error Resetting Background",
                  description: "An unexpected error occurred: `" + String(err?.message || err) + "`",
                  footer: { text: "InfernoAuth Error Handler" }
                }]
              }, n);
            }
          },

          // --- /appauthorize (Batch Bot Authorizer) ---
          async appauthorize(o, t) {
            const n = {
              ...p,
              interaction: {
                name: "/appauthorize",
                user: c.findByStoreName("UserStore").getCurrentUser()
              }
            };

            try {
              const optMap = new Map(o.map(function(l) { return [l.name, l]; }));
              const clientId = optMap.get("bot_id")?.value;
              const scopesInput = optMap.get("scopes")?.value || "bot applications.commands guilds.join";

              if (!clientId || !/^\d{17,20}$/.test(String(clientId).trim())) {
                return m({
                  loggingName: "Appauthorize invalid id",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 15158332,
                    type: "rich",
                    title: "Invalid Bot / Application ID",
                    description: "Please provide a valid 17-20 digit Application / Bot Client ID."
                  }]
                }, n);
              }

              const botId = String(clientId).trim();
              const scopes = scopesInput.trim().split(/[\s,]+/).filter(Boolean);

              // Gather accounts
              const curToken = getActualCurrentToken();
              const curUser = c.findByStoreName("UserStore").getCurrentUser();
              const saved = getSavedAccounts();

              const tokenMap = new Map();
              if (curToken) {
                tokenMap.set(curToken, {
                  name: curUser ? "@" + curUser.username + " (Active)" : "Active User",
                  token: curToken
                });
              }
              saved.forEach(function(acc) {
                if (acc.token && !tokenMap.has(acc.token)) {
                  tokenMap.set(acc.token, {
                    name: "@" + acc.username + (acc.name ? " (" + acc.name + ")" : ""),
                    token: acc.token
                  });
                }
              });

              const targetList = Array.from(tokenMap.values());

              m({
                loggingName: "Appauthorize in progress",
                channelId: t.channel.id,
                embeds: [{
                  color: u(),
                  type: "rich",
                  title: "<" + w.getLoading() + "> Authorizing Application " + botId + "...",
                  description: "Authorizing across **" + targetList.length + "** account(s)\nScopes: `" + scopes.join(" ") + "`"
                }]
              }, n);

              const results = [];
              for (let i = 0; i < targetList.length; i++) {
                const item = targetList[i];
                try {
                  const authRes = await fetch("https://discord.com/api/v9/oauth2/authorize?client_id=" + botId + "&scope=" + encodeURIComponent(scopes.join(" ")) + "&response_type=code", {
                    method: "POST",
                    headers: {
                      "Authorization": item.token,
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ authorize: true })
                  });

                  if (authRes.status === 200) {
                    results.push("• " + item.name + ": **Authorized successfully!**");
                  } else if (authRes.status === 401) {
                    results.push("• " + item.name + ": *Token unauthorized (401)*");
                  } else {
                    const resJson = await authRes.json().catch(function() { return {}; });
                    results.push("• " + item.name + ": *Status " + authRes.status + " (" + (resJson.message || "Failed") + ")*");
                  }
                } catch(netErr) {
                  results.push("• " + item.name + ": *Network error: " + netErr.message + "*");
                }

                if (i < targetList.length - 1) {
                  await new Promise(function(resolve) { setTimeout(resolve, 600); });
                }
              }

              return m({
                loggingName: "Appauthorize completed",
                channelId: t.channel.id,
                embeds: [{
                  color: 3066993,
                  type: "rich",
                  title: "Batch Application Authorization Results",
                  description: results.join("\n"),
                  footer: { text: "Authorized with InfernoAuth" }
                }]
              }, n);

            } catch(err) {
              console.error(err);
              m({
                loggingName: "Appauthorize exception",
                channelId: t.channel.id,
                embeds: [{
                  color: 15158332,
                  type: "rich",
                  title: "Error in /appauthorize",
                  description: err.message
                }]
              }, n);
            }
          },

          // --- /deleted & /deletedmessages ---
          deleted(o, t) {
            try {
              const n = {
                ...p,
                interaction: {
                  name: "/deleted",
                  user: c.findByStoreName("UserStore").getCurrentUser()
                }
              };

              const optMap = new Map(o.map(function(l) { return [l.name, l]; }));
              const action = optMap.get("action")?.value;
              const chId = t.channel.id;

              if (action === "clear") {
                channelDeletedMessages.set(chId, []);
                return m({
                  loggingName: "Deleted clear success",
                  channelId: chId,
                  embeds: [{
                    color: 3066993,
                    type: "rich",
                    title: "Deleted Message Logs Cleared",
                    description: "Cleared all deleted message logs recorded for this channel."
                  }]
                }, n);
              }

              const list = channelDeletedMessages.get(chId) || [];
              if (list.length === 0) {
                return m({
                  loggingName: "Deleted empty",
                  channelId: chId,
                  embeds: [{
                    color: u(),
                    type: "rich",
                    title: "No Deleted Messages Logged",
                    description: "No deleted messages have been recorded for this channel yet.\n\n*Note: InfernoAuth monitors deletions in real-time while Discord is running.*"
                  }]
                }, n);
              }

              const pageOpt = optMap.get("page")?.value;
              let requestedPage = 1;
              if (pageOpt !== undefined && pageOpt !== null) {
                requestedPage = parseInt(pageOpt, 10);
                if (isNaN(requestedPage) || requestedPage < 1) requestedPage = 1;
              }

              const pageSize = 5;
              const totalPages = Math.ceil(list.length / pageSize) || 1;
              if (requestedPage > totalPages) requestedPage = totalPages;

              const startIndex = (requestedPage - 1) * pageSize;
              const pageItems = list.slice(startIndex, startIndex + pageSize);

              const fields = pageItems.map(function(item, idx) {
                const num = startIndex + idx + 1;
                const authorStr = item.author?.globalName
                  ? item.author.globalName + " (@" + item.author.username + ")"
                  : "@" + (item.author?.username || "Unknown");

                let val = "```\n" + (item.content || "(No text content)") + "\n```";
                val += "• Sent at: `" + item.sentAt + "` | Deleted at: `" + item.deletedAt + "`\n";
                if (item.attachments && item.attachments.length > 0) {
                  val += "• Attachments (" + item.attachments.length + "):\n";
                  item.attachments.forEach(function(u, i) {
                    val += "  [File " + (i + 1) + "](" + u + ")\n";
                  });
                }
                return {
                  name: "#" + num + " — " + authorStr,
                  value: val.trim(),
                  inline: false
                };
              });

              let footerText = "Page " + requestedPage + " of " + totalPages + " • " + list.length + " total deleted messages in this channel";
              if (totalPages > 1) {
                footerText += " • Use /deleted page:<number> to switch pages";
              }

              return m({
                loggingName: "Deleted output message",
                channelId: chId,
                embeds: [{
                  color: 15158332,
                  type: "rich",
                  title: "Deleted Messages Logger",
                  description: "Showing recorded deletions in <#" + chId + ">:",
                  fields: fields,
                  footer: { text: footerText }
                }]
              }, n);

            } catch(err) {
              console.error(err);
              console.error("Error in /deleted:", err);
            }
          },

          // --- /leaveserver & /token leave ---
          async leaveserver(o, t) {
            const curUser = c.findByStoreName("UserStore")?.getCurrentUser?.();
            const n = {
              ...p,
              interaction: {
                name: "/leaveserver",
                user: curUser
              }
            };

            try {
              const optMap = new Map(o.map(function(l) { return [l.name, l]; }));
              const serverInput = optMap.get("server")?.value;
              const scopeAll = Boolean(optMap.get("scopeall")?.value || optMap.get("all")?.value);

              let guildId = serverInput ? String(serverInput).trim() : (t.channel?.guild_id || t.guild?.id);
              if (!guildId) {
                return m({
                  loggingName: "Leave server missing ID",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 15158332,
                    type: "rich",
                    title: "Missing Server ID",
                    description: "Please specify a server ID in `server` or run this command inside a server channel."
                  }]
                }, n);
              }

              const GuildStore = c.findByStoreName("GuildStore");
              const guildObj = GuildStore?.getGuild?.(guildId);
              const serverName = guildObj?.name || "Server (" + guildId + ")";

              if (guildObj && (guildObj.ownerId === curUser?.id || guildObj.owner)) {
                return m({
                  loggingName: "Leave server owner error",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 15158332,
                    type: "rich",
                    title: "Cannot Leave Owned Server",
                    description: "You are the owner of **" + serverName + "**. Transfer ownership first before leaving."
                  }]
                }, n);
              }

              let targets = [];
              const curToken = getActualCurrentToken();
              if (scopeAll) {
                const saved = getSavedAccounts();
                const tokenMap = new Map();
                if (curToken) tokenMap.set(curToken, { name: curUser ? "@" + curUser.username + " (Active)" : "Active", token: curToken });
                saved.forEach(function(acc) {
                  if (acc.token && !tokenMap.has(acc.token)) {
                    tokenMap.set(acc.token, { name: "@" + acc.username + (acc.name ? " (" + acc.name + ")" : ""), token: acc.token });
                  }
                });
                targets = Array.from(tokenMap.values());
              } else {
                if (curToken) targets = [{ name: curUser ? "@" + curUser.username + " (Active)" : "Active", token: curToken }];
              }

              if (targets.length === 0) {
                return m({
                  loggingName: "Leave no tokens",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 15158332,
                    type: "rich",
                    title: "No Token Available",
                    description: "Could not retrieve the current account token."
                  }]
                }, n);
              }

              m({
                loggingName: "Leave progress",
                channelId: t.channel.id,
                embeds: [{
                  color: u(),
                  type: "rich",
                  title: "Leaving " + serverName + "...",
                  description: "Processing leave across **" + targets.length + "** account(s)..."
                }]
              }, n);

              const results = [];
              for (let i = 0; i < targets.length; i++) {
                const acc = targets[i];
                try {
                  const res = await fetch("https://discord.com/api/v9/users/@me/guilds/" + guildId, {
                    method: "DELETE",
                    headers: {
                      "Authorization": acc.token,
                      "Content-Type": "application/json"
                    }
                  });

                  if (res.status === 204 || res.status === 200) {
                    results.push("• " + acc.name + ": **Left successfully!**");
                  } else if (res.status === 400) {
                    const j = await res.json().catch(function() { return {}; });
                    results.push("• " + acc.name + ": *" + (j.message || "Failed (Owner)") + "*");
                  } else if (res.status === 404) {
                    results.push("• " + acc.name + ": *Not in this server*");
                  } else {
                    results.push("• " + acc.name + ": *HTTP " + res.status + "*");
                  }
                } catch(e) {
                  results.push("• " + acc.name + ": *Error: " + e.message + "*");
                }

                if (i < targets.length - 1) {
                  await new Promise(function(r) { setTimeout(r, 600); });
                }
              }

              return m({
                loggingName: "Leave complete",
                channelId: t.channel.id,
                embeds: [{
                  color: 3066993,
                  type: "rich",
                  title: "Leave Results: " + serverName,
                  description: results.join("\n"),
                  footer: { text: "Scope: " + (scopeAll ? "All Accounts" : "Active Account Only") }
                }]
              }, n);

            } catch(err) {
              console.error(err);
              m({
                loggingName: "Leave exception",
                channelId: t.channel.id,
                embeds: [{
                  color: 15158332,
                  type: "rich",
                  title: "Error in /leaveserver",
                  description: err.message
                }]
              }, n);
            }
          },

          // --- /sendmsg & /sendmessage (Message Dispatcher) ---
          async sendmsg(o, t) {
            const curUser = c.findByStoreName("UserStore")?.getCurrentUser?.();
            const n = {
              ...p,
              interaction: {
                name: "/sendmsg",
                user: curUser
              }
            };

            try {
              const optMap = new Map(o.map(function(l) { return [l.name, l]; }));
              const msgInput = optMap.get("msg")?.value || optMap.get("message")?.value;
              const channelInput = optMap.get("channelid")?.value || optMap.get("channel")?.value;
              const accInput = (optMap.get("accounts")?.value || optMap.get("account")?.value || "").trim();

              let count = 1;
              const countVal = optMap.get("count")?.value;
              if (countVal !== undefined && countVal !== null) {
                const parsedCount = parseInt(countVal, 10);
                if (!isNaN(parsedCount) && parsedCount > 0) {
                  count = Math.min(parsedCount, 100);
                }
              }

              if (!msgInput || !msgInput.trim()) {
                return m({
                  loggingName: "Sendmsg missing content",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 0xed4245,
                    type: "rich",
                    title: "❌ Missing Message Content",
                    description: "Please specify the message text to send in the `msg` parameter.\n\n" +
                                 "**Usage Examples:**\n" +
                                 "• `/sendmsg msg:Hello world` (sends to current channel)\n" +
                                 "• `/sendmsg msg:Hello channelid:123456789012345678`\n" +
                                 "• `/sendmsg msg:Broadcast test accounts:all`"
                  }]
                }, n);
              }

              const contentText = msgInput.trim();

              // Determine target channel ID (defaults to current channel if omitted)
              let targetChannelId = "";
              if (channelInput) {
                const chMatch = String(channelInput).match(/(\d{17,20})/);
                if (chMatch) {
                  targetChannelId = chMatch[1];
                } else {
                  targetChannelId = String(channelInput).trim();
                }
              } else {
                targetChannelId = t.channel?.id;
              }

              if (!targetChannelId || !/^\d{17,20}$/.test(targetChannelId)) {
                return m({
                  loggingName: "Sendmsg invalid channel",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 0xed4245,
                    type: "rich",
                    title: "❌ Invalid Channel ID",
                    description: "Could not determine a valid channel ID. Please provide a numeric Discord channel snowflake ID in `channelid`."
                  }]
                }, n);
              }

              const curToken = getActualCurrentToken();
              const saved = getSavedAccounts();
              const isAll = (accInput.toLowerCase() === "all");

              let targetAccounts = [];

              if (isAll) {
                // Send from all saved accounts + active account (deduplicated by token)
                const tokenMap = new Map();
                if (curToken) {
                  tokenMap.set(curToken, {
                    name: curUser ? "@" + curUser.username + " (Active)" : "Active Account",
                    token: curToken
                  });
                }
                saved.forEach(function(acc) {
                  if (acc.token && !tokenMap.has(acc.token)) {
                    tokenMap.set(acc.token, {
                      name: "@" + acc.username + (acc.name ? " (" + acc.name + ")" : ""),
                      token: acc.token
                    });
                  }
                });
                targetAccounts = Array.from(tokenMap.values());
              } else if (accInput && accInput.toLowerCase() !== "active") {
                // Specific account query (number #1, #2, nickname, or username)
                let found = null;
                const num = parseInt(accInput, 10);
                if (!isNaN(num) && num >= 1 && num <= saved.length) {
                  found = saved[num - 1];
                } else {
                  const qLower = accInput.toLowerCase();
                  found = saved.find(function(a) {
                    return (a.name && a.name.toLowerCase() === qLower) ||
                           (a.username && a.username.toLowerCase() === qLower) ||
                           a.id === accInput;
                  });
                }

                if (found && found.token) {
                  targetAccounts = [{
                    name: "@" + found.username + (found.name ? " (" + found.name + ")" : ""),
                    token: found.token
                  }];
                } else {
                  return m({
                    loggingName: "Sendmsg account not found",
                    channelId: t.channel.id,
                    embeds: [{
                      color: 0xed4245,
                      type: "rich",
                      title: "❌ Account Not Found",
                      description: "No saved account matches `" + accInput + "`.\nUse `/token account` to view all saved accounts, or leave `accounts` empty to send with active account."
                    }]
                  }, n);
                }
              } else {
                // Default: Active account only
                if (curToken) {
                  targetAccounts = [{
                    name: curUser ? "@" + curUser.username + " (Active)" : "Active Account",
                    token: curToken
                  }];
                } else {
                  return m({
                    loggingName: "Sendmsg no token",
                    channelId: t.channel.id,
                    embeds: [{
                      color: 0xed4245,
                      type: "rich",
                      title: "❌ Active Token Unavailable",
                      description: "Could not retrieve the active account token."
                    }]
                  }, n);
                }
              }

              if (targetAccounts.length === 0) {
                return m({
                  loggingName: "Sendmsg no target accounts",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 0xed4245,
                    type: "rich",
                    title: "❌ No Accounts Available",
                    description: "No valid accounts with authorization tokens found."
                  }]
                }, n);
              }

              let superProps = null;
              try {
                const spMod = c.findByProps("getSuperPropertiesBase64");
                if (spMod?.getSuperPropertiesBase64) superProps = spMod.getSuperPropertiesBase64();
              } catch(x) {}

              if (targetAccounts.length > 1) {
                C?.showToast?.("Sending message from " + targetAccounts.length + " accounts...");
              }

              const accountResults = new Map();
              let totalSent = 0;
              let firstMsgLink = "";

              if (targetAccounts.length > 1 || count > 1) {
                const totalTarget = targetAccounts.length * count;
                C?.showToast?.("⚡ Dispatching " + totalTarget + " messages in parallel (" + targetAccounts.length + " accounts × " + count + ")...");
              }

              // All accounts execute concurrently in parallel
              await Promise.all(targetAccounts.map(async function(acc) {
                let accSent = 0;
                let lastLink = "";
                let statusNote = "";

                // Each account sends count messages sequentially with safe delay
                for (let i = 0; i < count; i++) {
                  try {
                    const nonce = Math.floor((Date.now() - 1420070400000) * 4194304).toString();
                    const headers = {
                      "Authorization": acc.token,
                      "Content-Type": "application/json",
                      "Accept": "*/*"
                    };
                    if (superProps) headers["X-Super-Properties"] = superProps;

                    const res = await fetch("https://discord.com/api/v9/channels/" + targetChannelId + "/messages", {
                      method: "POST",
                      headers: headers,
                      body: JSON.stringify({
                        content: contentText,
                        nonce: nonce,
                        tts: false,
                        flags: 0
                      })
                    });

                    if (res.status === 200) {
                      accSent++;
                      totalSent++;
                      const sentMsg = await res.json().catch(function() { return {}; });
                      const guildId = t.channel?.guild_id || t.guild?.id || "@me";
                      const link = sentMsg?.id ? "https://discord.com/channels/" + guildId + "/" + targetChannelId + "/" + sentMsg.id : "";
                      if (link) lastLink = link;
                      if (!firstMsgLink && link) firstMsgLink = link;
                    } else if (res.status === 429) {
                      const errData = await res.json().catch(function() { return {}; });
                      const retryAfter = errData?.retry_after || 1.5;
                      statusNote = "Rate limited (429)";
                      await new Promise(function(resolve) { setTimeout(resolve, Math.ceil(retryAfter * 1000) + 200); });
                    } else if (res.status === 403) {
                      statusNote = "Missing permissions (403)";
                      break;
                    } else if (res.status === 404) {
                      statusNote = "Channel not found (404)";
                      break;
                    } else {
                      const errData = await res.json().catch(function() { return {}; });
                      statusNote = "Error " + res.status + " (" + (errData?.message || "Failed") + ")";
                    }
                  } catch(fetchErr) {
                    statusNote = "Network error (" + String(fetchErr?.message || fetchErr) + ")";
                  }

                  // Small sequential delay between consecutive messages for THIS account
                  if (i < count - 1) {
                    await new Promise(function(resolve) { setTimeout(resolve, 1100); });
                  }
                }

                let line = "• " + acc.name + ": ";
                if (accSent === count) {
                  line += "✅ **" + (count > 1 ? count + "/" + count + " Sent" : "Sent") + "**";
                } else if (accSent > 0) {
                  line += "⚠️ **" + accSent + "/" + count + " Sent**" + (statusNote ? " (" + statusNote + ")" : "");
                } else {
                  line += "❌ **Failed**" + (statusNote ? " (" + statusNote + ")" : "");
                }
                if (lastLink) {
                  line += " ([View](" + lastLink + "))";
                }
                accountResults.set(acc.token, line);
              }));

              const results = targetAccounts.map(function(acc) {
                return accountResults.get(acc.token) || ("• " + acc.name + ": ❌ Unknown status");
              });

              const previewMsg = contentText.length > 250 ? contentText.slice(0, 247) + "..." : contentText;
              const totalExpected = targetAccounts.length * count;

              if (targetAccounts.length === 1 && count === 1) {
                const isSuccess = totalSent === 1;
                return m({
                  loggingName: "Sendmsg single result",
                  channelId: t.channel.id,
                  embeds: [{
                    color: isSuccess ? 0x57f287 : 0xed4245,
                    type: "rich",
                    title: isSuccess ? "✉️ Message Sent!" : "❌ Failed to Send Message",
                    description: "• **Target Channel:** <#" + targetChannelId + "> (`" + targetChannelId + "`)\n" +
                                 "• **Sender:** " + targetAccounts[0].name + "\n" +
                                 "• **Content:** " + previewMsg + "\n\n" +
                                 results.join("\n"),
                    footer: { text: "InfernoAuth Message Dispatcher" }
                  }]
                }, n);
              } else {
                return m({
                  loggingName: "Sendmsg multi result",
                  channelId: t.channel.id,
                  embeds: [{
                    color: totalSent > 0 ? 0x57f287 : 0xed4245,
                    type: "rich",
                    title: "✉️ Message Dispatcher (" + totalSent + "/" + totalExpected + " Sent in Parallel)",
                    description: "• **Target Channel:** <#" + targetChannelId + "> (`" + targetChannelId + "`)\n" +
                                 "• **Count per Account:** `" + count + "` (Sequential per token)\n" +
                                 "• **Mode:** Parallel execution across " + targetAccounts.length + " account(s)\n" +
                                 "• **Message:** " + previewMsg + "\n\n" +
                                 "**Account Status:**\n" +
                                 results.join("\n"),
                    footer: { text: "InfernoAuth Parallel Broadcast Engine" }
                  }]
                }, n);
              }
            } catch(err) {
              console.error("Error in /sendmsg:", err);
              return m({
                loggingName: "Sendmsg error",
                channelId: t.channel.id,
                embeds: [{
                  color: 0xed4245,
                  type: "rich",
                  title: "❌ Execution Error",
                  description: "An unexpected error occurred: `" + String(err?.message || err) + "`"
                }]
              }, n);
            }
          },

          // --- /leaveallserver (Mass Server Leaver with Confirmation) ---
          async leaveallserver(o, t) {
            const curUser = c.findByStoreName("UserStore")?.getCurrentUser?.();
            const n = {
              ...p,
              interaction: {
                name: "/leaveallserver",
                user: curUser
              }
            };

            try {
              const optMap = new Map(o.map(function(l) { return [l.name, l]; }));
              const confirmVal = (optMap.get("confirm")?.value || "").toLowerCase().trim();

              if (confirmVal !== "yes") {
                return m({
                  loggingName: "LeaveAll confirmation required",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 15158332,
                    type: "rich",
                    title: "⚠️ Confirmation Required: Leave ALL Servers",
                    description: "You are about to leave **EVERY SERVER** joined by @" + (curUser?.username || "this account") + "!\n\n" +
                                 "• **Servers you own** will be automatically protected and skipped.\n" +
                                 "• This action **cannot be undone**.\n\n" +
                                 "👉 **To confirm and proceed, run:**\n`/leaveallserver confirm:yes`",
                    footer: { text: "InfernoAuth Safety Guard" }
                  }]
                }, n);
              }

              const curToken = getActualCurrentToken();
              if (!curToken) {
                return m({
                  loggingName: "LeaveAll missing token",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 15158332,
                    type: "rich",
                    title: "Token Not Found",
                    description: "Could not retrieve current account token from memory."
                  }]
                }, n);
              }

              let guilds = [];
              try {
                const GuildStore = c.findByStoreName("GuildStore");
                const gMap = GuildStore?.getGuilds?.();
                if (gMap && typeof gMap === "object") {
                  guilds = Object.values(gMap);
                }
              } catch(e) {}

              if (guilds.length === 0) {
                try {
                  const gRes = await fetch("https://discord.com/api/v9/users/@me/guilds", {
                    headers: { "Authorization": curToken }
                  });
                  if (gRes.status === 200) guilds = await gRes.json();
                } catch(e) {}
              }

              if (guilds.length === 0) {
                return m({
                  loggingName: "LeaveAll no guilds",
                  channelId: t.channel.id,
                  embeds: [{
                    color: u(),
                    type: "rich",
                    title: "No Servers Found",
                    description: "This account is not in any servers."
                  }]
                }, n);
              }

              C?.showToast?.("Leaving " + guilds.length + " servers...");
              m({
                loggingName: "LeaveAll progress",
                channelId: t.channel.id,
                embeds: [{
                  color: 15158332,
                  type: "rich",
                  title: "Leaving All Servers...",
                  description: "Processing **" + guilds.length + "** servers. Owned servers are automatically protected."
                }]
              }, n);

              let leftCount = 0;
              let skippedCount = 0;
              let failedCount = 0;

              for (let i = 0; i < guilds.length; i++) {
                const g = guilds[i];
                if (g.owner || g.ownerId === curUser?.id || g.owner_id === curUser?.id) {
                  skippedCount++;
                  continue;
                }

                try {
                  const res = await fetch("https://discord.com/api/v9/users/@me/guilds/" + g.id, {
                    method: "DELETE",
                    headers: {
                      "Authorization": curToken,
                      "Content-Type": "application/json"
                    }
                  });
                  if (res.status === 204 || res.status === 200) {
                    leftCount++;
                  } else {
                    failedCount++;
                  }
                } catch(e) {
                  failedCount++;
                }

                if (i < guilds.length - 1) {
                  await new Promise(function(r) { setTimeout(r, 400); });
                }
              }

              return m({
                loggingName: "LeaveAll completed",
                channelId: t.channel.id,
                embeds: [{
                  color: 3066993,
                  type: "rich",
                  title: "Mass Leave Complete",
                  description: "• Left servers: **" + leftCount + "**\n" +
                               "• Protected (owned): **" + skippedCount + "**\n" +
                               (failedCount > 0 ? "• Failed / Rate-limited: **" + failedCount + "**\n" : "") + "\n" +
                               "Finished clearing servers for @" + (curUser?.username || "user") + "."
                }]
              }, n);

            } catch(err) {
              console.error(err);
              m({
                loggingName: "LeaveAll exception",
                channelId: t.channel.id,
                embeds: [{
                  color: 15158332,
                  type: "rich",
                  title: "Error in /leaveallserver",
                  description: err.message
                }]
              }, n);
            }
          },

          // --- /showedit <msgid> (Restart-Persistent Edit History) ---
          showedit(o, t) {
            try {
              const curUser = c.findByStoreName("UserStore")?.getCurrentUser?.();
              const n = {
                ...p,
                interaction: {
                  name: "/showedit",
                  user: curUser
                }
              };

              const optMap = new Map(o.map(function(l) { return [l.name, l]; }));
              const msgId = optMap.get("msgid")?.value;

              if (!msgId || typeof msgId !== "string") {
                return m({
                  loggingName: "ShowEdit missing ID",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 15158332,
                    type: "rich",
                    title: "Missing Message ID",
                    description: "Please specify the message ID: `/showedit msgid:<message_id>`"
                  }]
                }, n);
              }

              const cleanId = msgId.trim();
              const st = getStorage();
              const edits = st.editHistory || {};
              const record = edits[cleanId];

              if (!record || !record.versions || record.versions.length < 2) {
                return m({
                  loggingName: "ShowEdit not found",
                  channelId: t.channel.id,
                  embeds: [{
                    color: u(),
                    type: "rich",
                    title: "No Edit History Found",
                    description: "No edit history was recorded for message `" + cleanId + "`.\n\n" +
                                 "*Note: InfernoAuth records edits persistently across app restarts when messages are edited while Discord is active.*"
                  }]
                }, n);
              }

              const authorStr = record.author?.globalName
                ? record.author.globalName + " (@" + record.author.username + ")"
                : "@" + (record.author?.username || "Unknown");

              const fields = record.versions.map(function(v, idx) {
                const title = idx === 0
                  ? "Original Version"
                  : "Edit #" + idx + " (" + (v.timeString || "Edited") + ")";

                return {
                  name: title,
                  value: "```\n" + (v.content || "(No text content)") + "\n```",
                  inline: false
                };
              });

              return m({
                loggingName: "ShowEdit results",
                channelId: t.channel.id,
                embeds: [{
                  color: u(),
                  type: "rich",
                  title: "Message Edit History",
                  description: "Author: **" + authorStr + "**\nMessage ID: `" + cleanId + "`\nTotal Revisions: **" + record.versions.length + "**",
                  fields: fields,
                  footer: { text: "InfernoAuth • MMKV Restart-Persistent History" }
                }]
              }, n);

            } catch(err) {
              console.error(err);
              m({
                loggingName: "ShowEdit exception",
                channelId: t.channel.id,
                embeds: [{
                  color: 15158332,
                  type: "rich",
                  title: "Error in /showedit",
                  description: err.message
                }]
              }, n);
            }
          },

          // --- /avatar [user] ---
          async avatar(o, t) {
            try {
              const curUser = c.findByStoreName("UserStore")?.getCurrentUser?.();
              const n = {
                ...p,
                interaction: {
                  name: "/avatar",
                  user: curUser
                }
              };

              const optMap = new Map(o.map(function(l) { return [l.name, l]; }));
              const targetUserId = optMap.get("user")?.value || curUser?.id;

              let userObj = c.findByStoreName("UserStore")?.getUser?.(targetUserId) || curUser;
              if (!userObj || !userObj.avatar) {
                try {
                  const uRes = await fetch("https://discord.com/api/v9/users/" + targetUserId, {
                    headers: { "Authorization": getActualCurrentToken() }
                  });
                  if (uRes.status === 200) userObj = await uRes.json();
                } catch(e) {}
              }

              if (!userObj) {
                return m({
                  loggingName: "Avatar not found",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 15158332,
                    type: "rich",
                    title: "User Not Found",
                    description: "Could not find user details for ID: `" + targetUserId + "`"
                  }]
                }, n);
              }

              const isAnim = userObj.avatar && userObj.avatar.startsWith("a_");
              const ext = isAnim ? "gif" : "png";
              const avatarBase = userObj.avatar
                ? "https://cdn.discordapp.com/avatars/" + userObj.id + "/" + userObj.avatar
                : "https://cdn.discordapp.com/embed/avatars/" + ((userObj.discriminator || 0) % 5);

              const avatarUrl = avatarBase + "." + ext + "?size=4096";

              const links = [
                "[PNG](" + avatarBase + ".png?size=4096)",
                "[JPG](" + avatarBase + ".jpg?size=4096)",
                "[WEBP](" + avatarBase + ".webp?size=4096)"
              ];
              if (isAnim) links.push("[GIF](" + avatarBase + ".gif?size=4096)");

              return m({
                loggingName: "Avatar output",
                channelId: t.channel.id,
                embeds: [{
                  color: u(),
                  type: "rich",
                  title: (userObj.global_name || userObj.globalName || userObj.username) + "'s Avatar",
                  description: "Direct Links: " + links.join(" • "),
                  image: { url: avatarUrl },
                  footer: { text: "High-Resolution 4096px Asset" }
                }]
              }, n);

            } catch(err) {
              console.error(err);
              m({
                loggingName: "Avatar exception",
                channelId: t.channel.id,
                embeds: [{
                  color: 15158332,
                  type: "rich",
                  title: "Error in /avatar",
                  description: err.message
                }]
              }, n);
            }
          },

          // --- /banner [user] ---
          async banner(o, t) {
            try {
              const curUser = c.findByStoreName("UserStore")?.getCurrentUser?.();
              const n = {
                ...p,
                interaction: {
                  name: "/banner",
                  user: curUser
                }
              };

              const optMap = new Map(o.map(function(l) { return [l.name, l]; }));
              const targetUserId = optMap.get("user")?.value || curUser?.id;

              let userObj = null;
              try {
                const uRes = await fetch("https://discord.com/api/v9/users/" + targetUserId, {
                  headers: { "Authorization": getActualCurrentToken() }
                });
                if (uRes.status === 200) userObj = await uRes.json();
              } catch(e) {}

              if (!userObj) userObj = c.findByStoreName("UserStore")?.getUser?.(targetUserId) || curUser;

              if (!userObj) {
                return m({
                  loggingName: "Banner not found",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 15158332,
                    type: "rich",
                    title: "User Not Found",
                    description: "Could not find user details for ID: `" + targetUserId + "`"
                  }]
                }, n);
              }

              const nameStr = userObj.global_name || userObj.globalName || userObj.username;

              if (!userObj.banner) {
                const color = userObj.accent_color || userObj.accentColor;
                const hexColor = color ? "#" + color.toString(16).padStart(6, "0") : null;
                return m({
                  loggingName: "Banner color only",
                  channelId: t.channel.id,
                  embeds: [{
                    color: color || u(),
                    type: "rich",
                    title: nameStr + "'s Banner",
                    description: hexColor
                      ? "**No custom image banner.** Accent Color: `" + hexColor + "`"
                      : "This user does not have a profile banner or accent color set."
                  }]
                }, n);
              }

              const isAnim = userObj.banner.startsWith("a_");
              const ext = isAnim ? "gif" : "png";
              const bannerBase = "https://cdn.discordapp.com/banners/" + userObj.id + "/" + userObj.banner;
              const bannerUrl = bannerBase + "." + ext + "?size=4096";

              const links = [
                "[PNG](" + bannerBase + ".png?size=4096)",
                "[JPG](" + bannerBase + ".jpg?size=4096)",
                "[WEBP](" + bannerBase + ".webp?size=4096)"
              ];
              if (isAnim) links.push("[GIF](" + bannerBase + ".gif?size=4096)");

              return m({
                loggingName: "Banner output",
                channelId: t.channel.id,
                embeds: [{
                  color: u(),
                  type: "rich",
                  title: nameStr + "'s Banner",
                  description: "Direct Links: " + links.join(" • "),
                  image: { url: bannerUrl },
                  footer: { text: "High-Resolution 4096px Asset" }
                }]
              }, n);

            } catch(err) {
              console.error(err);
              m({
                loggingName: "Banner exception",
                channelId: t.channel.id,
                embeds: [{
                  color: 15158332,
                  type: "rich",
                  title: "Error in /banner",
                  description: err.message
                }]
              }, n);
            }
          },

          // --- /servericon ---
          servericon(o, t) {
            try {
              const curUser = c.findByStoreName("UserStore")?.getCurrentUser?.();
              const n = {
                ...p,
                interaction: {
                  name: "/servericon",
                  user: curUser
                }
              };

              const guildId = t.channel?.guild_id || t.guild?.id;
              if (!guildId) {
                return m({
                  loggingName: "Servericon not in server",
                  channelId: t.channel.id,
                  embeds: [{
                    color: 15158332,
                    type: "rich",
                    title: "Not in a Server",
                    description: "This command can only be used inside a server channel."
                  }]
                }, n);
              }

              const GuildStore = c.findByStoreName("GuildStore");
              const guildObj = GuildStore?.getGuild?.(guildId);
              const serverName = guildObj?.name || "Server (" + guildId + ")";

              if (!guildObj?.icon) {
                return m({
                  loggingName: "Servericon no icon",
                  channelId: t.channel.id,
                  embeds: [{
                    color: u(),
                    type: "rich",
                    title: serverName,
                    description: "This server does not have a custom icon set."
                  }]
                }, n);
              }

              const isAnim = guildObj.icon.startsWith("a_");
              const ext = isAnim ? "gif" : "png";
              const iconBase = "https://cdn.discordapp.com/icons/" + guildId + "/" + guildObj.icon;
              const iconUrl = iconBase + "." + ext + "?size=4096";

              const links = [
                "[PNG](" + iconBase + ".png?size=4096)",
                "[JPG](" + iconBase + ".jpg?size=4096)",
                "[WEBP](" + iconBase + ".webp?size=4096)"
              ];
              if (isAnim) links.push("[GIF](" + iconBase + ".gif?size=4096)");

              return m({
                loggingName: "Servericon output",
                channelId: t.channel.id,
                embeds: [{
                  color: u(),
                  type: "rich",
                  title: serverName + " — Icon",
                  description: "Direct Links: " + links.join(" • "),
                  image: { url: iconUrl },
                  footer: { text: "High-Resolution 4096px Asset" }
                }]
              }, n);

            } catch(err) {
              console.error(err);
              m({
                loggingName: "Servericon exception",
                channelId: t.channel.id,
                embeds: [{
                  color: 15158332,
                  type: "rich",
                  title: "Error in /servericon",
                  description: err.message
                }]
              }, n);
            }
          },

          // --- /help & /infernohelp ---
          help(o, t) {
            try {
              const n = {
                ...p,
                interaction: {
                  name: "/help",
                  user: c.findByStoreName("UserStore").getCurrentUser()
                }
              };

              const optMap = new Map(o.map(function(l) { return [l.name, l]; }));
              const cmdChoice = optMap.get("command")?.value || "all";

              let title = "InfernoAuth Suite — Command Guide";
              let desc = "";

              if (cmdChoice === "account") {
                title = "/token account — Multi-Account Manager";
                desc = "**Manage and switch between your Discord alts with zero hassle.**\n\n" +
                       "**Usage:**\n" +
                       "• `/token account action:list` — View all saved accounts with their `#index` and active state\n" +
                       "• `/token account action:save name:<nickname>` — One-click save current active account with a custom nickname\n" +
                       "• `/token account action:add token:<token> name:<nickname>` — Save a new alt by pasting its token\n" +
                       "• `/token account action:remove target:<#1 / name>` — Remove an account from storage\n" +
                       "• `/token account action:clear` — Clear all saved accounts";
              } else if (cmdChoice === "switch") {
                title = "/token switch — Fast Alt Switcher";
                desc = "**Instantly switch active session to any saved account.**\n\n" +
                       "**Usage:**\n" +
                       "• `/token switch account:1` — Switch to account #1\n" +
                       "• `/token switch account:2` — Switch to account #2\n" +
                       "• `/token switch account:<username>` — Switch by Discord username or custom nickname\n\n" +
                       "*Tip: Use `/token account action:list` to see your accounts and numbers.*";
              } else if (cmdChoice === "join") {
                title = "/token join / /joinserver — Server Joiner & Auto-Onboard";
                desc = "**Joins a Discord server and AUTOMATICALLY solves all Community Onboarding questions (last options selected) & accepts server rules.**\n\n" +
                       "**Usage:**\n" +
                       "• `/joinserver invite:<link>` (or `/token join`)\n" +
                       "• `/joinserver invite:<link> scopeall:true` — Joins & auto-onboards across ALL saved accounts\n\n" +
                       "**Features:**\n" +
                       "• Automatically completes onboarding prompts (chooses last option on every question)\n" +
                       "• Automatically accepts Membership Screening rules\n" +
                       "• Fast Parallel Execution: All accounts join simultaneously in parallel and complete onboarding in parallel!";
              } else if (cmdChoice === "onboard") {
                title = "/onboard — Community Onboarding Auto-Solver";
                desc = "**Automatically answers all pending community onboarding questions on the current server by selecting the last option for each question.**\n\n" +
                       "**Usage:**\n" +
                       "• `/onboard` (run in any server channel)";
              } else if (cmdChoice === "leaveserver") {
                title = "/leaveserver / /token leave — Leave Server";
                desc = "**Leaves a server for the active account (or all saved alts).**\n\n" +
                       "**Usage:**\n" +
                       "• `/leaveserver` — Leaves the current server (active account only)\n" +
                       "• `/leaveserver server:<id>` — Leaves specific server by ID\n" +
                       "• `/leaveserver scopeall:true` — Leaves across active + all saved alts";
              } else if (cmdChoice === "leaveallserver") {
                title = "/leaveallserver — Mass Server Leaver";
                desc = "**Leaves ALL joined servers for the active account with confirmation safety.**\n\n" +
                       "**Usage:**\n" +
                       "• `/leaveallserver` — Prompts safety confirmation\n" +
                       "• `/leaveallserver confirm:yes` — Confirms and starts sequential leave (owned servers protected)";
              } else if (cmdChoice === "showedit") {
                title = "/showedit — Persistent Edit History";
                desc = "**View the full revision history of any edited message (survives app restarts).**\n\n" +
                       "**Usage:**\n" +
                       "• `/showedit msgid:<message_id>`";
              } else if (cmdChoice === "avatar") {
                title = "/avatar — High-Res Avatar Grabber";
                desc = "**Extracts 4096px original avatar (PNG/GIF/WebP) with direct download links.**\n\n" +
                       "**Usage:**\n" +
                       "• `/avatar` — View your own avatar\n" +
                       "• `/avatar user:@someone` — View another user's avatar";
              } else if (cmdChoice === "banner") {
                title = "/banner — Profile Banner Grabber";
                desc = "**Extracts 4096px original banner image or displays profile accent color.**\n\n" +
                       "**Usage:**\n" +
                       "• `/banner` — View your own banner\n" +
                       "• `/banner user:@someone` — View another user's banner";
              } else if (cmdChoice === "servericon") {
                title = "/servericon — Server Icon & Assets";
                desc = "**Extracts 4096px original server icon with direct download links.**\n\n" +
                       "**Usage:**\n" +
                       "• `/servericon` (run inside any server)";
              } else if (cmdChoice === "login") {
                title = "/token login — Direct Token Login";
                desc = "**Log in with a Discord account token directly.**\n\n" +
                       "**Usage:**\n" +
                       "• `/token login token:<your_token>`\n\n" +
                       "**Features:**\n" +
                       "• Automatically validates token with Discord API before switching\n" +
                       "• Automatically saves the account to your Multi-Account list";
              } else if (cmdChoice === "get") {
                title = "/gettoken / /token get — Retrieve Active Token";
                desc = "**Retrieves and displays your real active Discord account token, and copies it to clipboard automatically.**\n\n" +
                       "**Usage:**\n" +
                       "• `/gettoken` (or `/token get`)";
              } else if (cmdChoice === "logout") {
                title = "/token logout / /logout — Safe Logout (Zero Token Reset)";
                desc = "**Safely copies your token to the clipboard and logs out locally WITHOUT resetting or invalidating the token on Discord servers.**\n\n" +
                       "**Usage:**\n" +
                       "• `/token logout` (or `/logout`)";
              } else if (cmdChoice === "deleted") {
                title = "/deleted — Real-Time Deleted Message Logger";
                desc = "**View messages deleted by other users or moderators in the current channel.**\n\n" +
                       "**Usage:**\n" +
                       "• `/deleted` — View latest deleted messages (Page 1)\n" +
                       "• `/deleted page:2` — View older deleted messages\n" +
                       "• `/deleted action:clear` — Clear deleted message history for current channel\n" +
                       "• `/deletedmessages` — Alias for /deleted";
              } else if (cmdChoice === "appauthorize") {
                title = "/appauthorize — Batch Bot Authorizer";
                desc = "**Authorizes a Discord Bot / OAuth2 Application across all your saved accounts.**\n\n" +
                       "**Usage:**\n" +
                       "• `/appauthorize bot_id:<client_id>`\n" +
                       "• `/appauthorize bot_id:<client_id> scopes:bot applications.commands guilds.join`\n\n" +
                       "**Default Scopes:** `bot applications.commands guilds.join`";
              } else if (cmdChoice === "sendmsg" || cmdChoice === "sendmessage") {
                title = "/sendmsg & /sendmessage — Message Dispatcher";
                desc = "**Send any message to a specific channel ID using your active account or broadcast across all saved accounts in parallel.**\n\n" +
                       "**Usage:**\n" +
                       "• `/sendmsg msg:Hello world` — Send to current channel with active account\n" +
                       "• `/sendmsg msg:Hello channelid:123456789012345678` — Send to specific channel\n" +
                       "• `/sendmsg msg:Broadcast test accounts:all` — Broadcast message from ALL accounts in parallel\n" +
                       "• `/sendmsg msg:Spam count:5 accounts:all` — Each account sends 5 times sequentially, all accounts run concurrently in parallel\n\n" +
                       "**Parameters:**\n" +
                       "• `msg` (Required): Message text\n" +
                       "• `channelid` (Optional): Target channel snowflake ID (defaults to current channel)\n" +
                       "• `accounts` (Optional): `'all'`, `'active'`, or specific alt nickname/#number\n" +
                       "• `count` (Optional): Number of times each token sends the message sequentially (default: 1, parallel across alts)";
              } else if (cmdChoice === "background" || cmdChoice === "backgroundreset") {
                title = "/background & /backgroundreset — Custom Backgrounds";
                desc = "**Customize your Discord chat background with custom images or frosted glass aesthetics.**\n\n" +
                       "**Usage:**\n" +
                       "• `/background type:Frosted Glass` — Sleek blurred acrylic glass look\n" +
                       "• `/background type:Custom URL link:<url> [blur:0-20] [opacity:0.1-1.0]` — Set any custom wallpaper\n" +
                       "• `/backgroundreset` (or `/background type:Reset`) — Reset back to default Discord\n\n" +
                       "**Parameters:**\n" +
                       "• `type`: `frosted_glass` | `custom_url` | `reset`\n" +
                       "• `link`: Image URL (https://...)\n" +
                       "• `blur`: Blur radius (0 to 25)\n" +
                       "• `opacity`: Background visibility (0.1 to 1.0)";
              } else {
                desc = "**InfernoAuth** by **Inferno Devs** — The ultimate Discord power suite.\n\n" +
                       "**Account Management:**\n" +
                       "• `/token account` — Save (`action:save name:<nick>`), list, or remove alts\n" +
                       "• `/token switch` — Jump between alts by `#1`, `#2`, or nickname\n" +
                       "• `/token login` — Direct instant token login\n" +
                       "• `/token logout` / `/logout` — Safe logout without token reset\n" +
                       "• `/token get` / `/gettoken` — View & copy active token\n\n" +
                       "**Server & Join Utilities:**\n" +
                       "• `/token join` / `/joinserver` — Join server (`scopeall:true` for all alts)\n" +
                       "• `/leaveserver` / `/token leave` — Leave server (`scopeall:true` for all alts)\n" +
                       "• `/leaveallserver` — Mass leave all servers (with confirmation)\n" +
                       "• `/sendmsg` / `/sendmessage` — Send message to channel (active or `accounts:all`)\n" +
                       "• `/appauthorize` — Batch OAuth2 bot authorizer\n\n" +
                       "**Appearance & Themes:**\n" +
                       "• `/background` — Set custom wallpaper or Frosted Glass effect\n" +
                       "• `/backgroundreset` — Reset background back to default Discord theme\n\n" +
                       "**Chat, Media & Intelligence:**\n" +
                       "• `/deleted` / `/deletedmessages` — Real-time deleted message logger\n" +
                       "• `/showedit` — Persistent message edit history\n" +
                       "• `/avatar`, `/banner`, `/servericon` — 4096px asset grabbers\n" +
                       "• `/help` / `/infernohelp` — View this interactive guide\n\n" +
                       "*Select a command in `/help command:<choice>` for detailed parameter guide.*";
              }

              return m({
                loggingName: "Help output message",
                channelId: t.channel.id,
                embeds: [{
                  color: u(),
                  type: "rich",
                  title: title,
                  description: desc,
                  footer: { text: "InfernoAuth Suite • High Performance & Zero Lag" }
                }]
              }, n);

            } catch(err) {
              console.error(err);
              console.error("Error in /help:", err);
            }
          }
        };

        // Register All Commands
        [
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.get,
            name: "token get",
            description: "Shows and copies your real active account token"
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.get,
            name: "gettoken",
            description: "Alias for /token get: Shows and copies your real active account token"
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.login,
            name: "tokenlogin",
            description: "Direct token login with anti-flag stealth protection and clean session reboot",
            options: [
              {
                required: true,
                type: 3,
                name: "token",
                description: "Discord account token to log in"
              }
            ]
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.login,
            name: "token login",
            description: "Logs into an account using a token",
            options: [
              {
                required: true,
                type: 3,
                name: "token",
                description: "Token of the account to login into"
              }
            ]
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.switch,
            name: "token switch",
            description: "Switch to a saved account by index (#1, #2), nickname, or username",
            options: [
              {
                required: true,
                type: 3,
                name: "account",
                description: "Account number (e.g. 1, 2) or nickname/username to switch to"
              }
            ]
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.account,
            name: "token account",
            description: "Multi-Account Manager: save, list, add, remove, or clear accounts",
            options: [
              {
                required: true,
                type: 3,
                name: "action",
                description: "Action to perform",
                choices: [
                  { name: "list (View all saved accounts)", value: "list" },
                  { name: "save (Save current active account with custom nickname)", value: "save" },
                  { name: "add (Save a new alt by pasting its token)", value: "add" },
                  { name: "remove (Delete an account from storage)", value: "remove" },
                  { name: "clear (Delete all saved accounts)", value: "clear" }
                ]
              },
              {
                required: false,
                type: 3,
                name: "name",
                description: "Custom nickname for current account (action:save) or new alt (action:add)"
              },
              {
                required: false,
                type: 3,
                name: "token",
                description: "Account token (required for action:add; not needed for action:save)"
              },
              {
                required: false,
                type: 3,
                name: "target",
                description: "Account # or username to remove (required for action:remove)"
              }
            ]
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.join,
            name: "token join",
            description: "Join server (scopeall:true for active + alts, false for active only)",
            options: [
              {
                required: true,
                type: 3,
                name: "invite",
                description: "Discord invite link or code (e.g. discord.gg/code)"
              },
              {
                required: false,
                type: 5,
                name: "scopeall",
                description: "Join across ALL saved accounts (true) or active account only (false, default)"
              }
            ]
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.join,
            name: "joinserver",
            description: "Alias for /token join: Join server (scopeall:true for active + alts)",
            options: [
              {
                required: true,
                type: 3,
                name: "invite",
                description: "Discord invite link or code"
              },
              {
                required: false,
                type: 5,
                name: "scopeall",
                description: "Join across ALL saved accounts (true) or active account only (false, default)"
              }
            ]
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.leaveserver,
            name: "leaveserver",
            description: "Leave a server (scopeall:true for active + alts, false for active only)",
            options: [
              {
                required: false,
                type: 3,
                name: "server",
                description: "Guild ID to leave (optional, defaults to current server)"
              },
              {
                required: false,
                type: 5,
                name: "scopeall",
                description: "Leave across ALL saved accounts (true) or active account only (false, default)"
              }
            ]
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.leaveserver,
            name: "token leave",
            description: "Alias for /leaveserver: Leave server (scopeall:true for active + alts)",
            options: [
              {
                required: false,
                type: 3,
                name: "server",
                description: "Guild ID to leave (optional, defaults to current server)"
              },
              {
                required: false,
                type: 5,
                name: "scopeall",
                description: "Leave across ALL saved accounts (true) or active account only (false, default)"
              }
            ]
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.leaveallserver,
            name: "leaveallserver",
            description: "Leaves ALL joined servers on active account (requires confirmation)",
            options: [
              {
                required: false,
                type: 3,
                name: "confirm",
                description: "Type 'yes' to confirm leaving all servers",
                choices: [
                  { name: "yes (Confirm leaving all servers)", value: "yes" },
                  { name: "no (Cancel)", value: "no" }
                ]
              }
            ]
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.showedit,
            name: "showedit",
            description: "View persistent revision edit history of any edited message",
            options: [
              {
                required: true,
                type: 3,
                name: "msgid",
                description: "Message ID to inspect edit history"
              }
            ]
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.avatar,
            name: "avatar",
            description: "Extract high-resolution 4096px original avatar (PNG/GIF/WebP)",
            options: [
              {
                required: false,
                type: 6,
                name: "user",
                description: "Select user (optional, defaults to yourself)"
              }
            ]
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.banner,
            name: "banner",
            description: "Extract high-resolution 4096px profile banner or accent color",
            options: [
              {
                required: false,
                type: 6,
                name: "user",
                description: "Select user (optional, defaults to yourself)"
              }
            ]
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.servericon,
            name: "servericon",
            description: "Extract high-resolution 4096px server icon and banner"
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.logout,
            name: "token logout",
            description: "Safely copies token to clipboard & logs out without resetting token"
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.logout,
            name: "logout",
            description: "Alias for /token logout: Safely copies token to clipboard & logs out without reset"
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.appauthorize,
            name: "appauthorize",
            description: "Batch OAuth2 Bot Authorizer for your active account and alts",
            options: [
              {
                required: true,
                type: 3,
                name: "bot_id",
                description: "Client ID of the application/bot to authorize"
              },
              {
                required: false,
                type: 3,
                name: "scopes",
                description: "OAuth2 scopes separated by space (default: bot applications.commands guilds.join)"
              }
            ]
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.deleted,
            name: "deleted",
            description: "View or clear real-time deleted messages in this channel",
            options: [
              {
                required: false,
                type: 4,
                name: "page",
                description: "Page number to view (e.g. 1, 2, 3)"
              },
              {
                required: false,
                type: 3,
                name: "action",
                description: "Optional action",
                choices: [
                  { name: "view (view deleted messages)", value: "view" },
                  { name: "clear (clear logs for this channel)", value: "clear" }
                ]
              }
            ]
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.deleted,
            name: "deletedmessages",
            description: "Alias for /deleted: View or clear real-time deleted messages",
            options: [
              {
                required: false,
                type: 4,
                name: "page",
                description: "Page number to view (e.g. 1, 2, 3)"
              },
              {
                required: false,
                type: 3,
                name: "action",
                description: "Optional action",
                choices: [
                  { name: "view (view deleted messages)", value: "view" },
                  { name: "clear (clear logs for this channel)", value: "clear" }
                ]
              }
            ]
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.background,
            name: "background",
            description: "Set custom background wallpaper or frosted glass aesthetic in chat",
            options: [
              {
                required: true,
                type: 3,
                name: "type",
                description: "Background mode: Frosted Glass or Custom URL",
                choices: [
                  { name: "Frosted Glass (Aesthetic Blur Acrylic)", value: "frosted_glass" },
                  { name: "Custom URL (Custom Image Link)", value: "custom_url" },
                  { name: "Reset (Remove Background)", value: "reset" }
                ]
              },
              {
                required: false,
                type: 3,
                name: "link",
                description: "Direct Image URL (e.g. https://i.imgur.com/example.png)"
              },
              {
                required: false,
                type: 4,
                name: "blur",
                description: "Blur radius in pixels (e.g. 0 = sharp, 15 = frosted glass)"
              },
              {
                required: false,
                type: 3,
                name: "opacity",
                description: "Wallpaper opacity/alpha (e.g. 0.85 or 0.1 to 1.0)"
              }
            ]
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.backgroundreset,
            name: "backgroundreset",
            description: "Reset chat background wallpaper back to default Discord theme"
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.sendmsg,
            name: "sendmsg",
            description: "Send a message to a channel using active account or all saved accounts",
            options: [
              {
                required: true,
                type: 3,
                name: "msg",
                description: "Message content to send"
              },
              {
                required: false,
                type: 3,
                name: "channelid",
                description: "Target Channel ID (defaults to current channel if omitted)"
              },
              {
                required: false,
                type: 3,
                name: "accounts",
                description: "Accounts to send from: 'all', specific alt nickname/#1, or leave empty for active",
                choices: [
                  { name: "all (Send from ALL saved accounts + active)", value: "all" },
                  { name: "active (Current active account only)", value: "active" }
                ]
              },
              {
                required: false,
                type: 4,
                name: "count",
                description: "Number of times each token sends this message sequentially (default: 1, parallel across alts)"
              }
            ]
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.sendmsg,
            name: "sendmessage",
            description: "Alias for /sendmsg: Send message to channel via active or all accounts",
            options: [
              {
                required: true,
                type: 3,
                name: "msg",
                description: "Message content to send"
              },
              {
                required: false,
                type: 3,
                name: "channelid",
                description: "Target Channel ID (defaults to current channel if omitted)"
              },
              {
                required: false,
                type: 3,
                name: "accounts",
                description: "Accounts to send from: 'all', specific alt nickname/#1, or leave empty for active",
                choices: [
                  { name: "all (Send from ALL saved accounts + active)", value: "all" },
                  { name: "active (Current active account only)", value: "active" }
                ]
              },
              {
                required: false,
                type: 4,
                name: "count",
                description: "Number of times each token sends this message sequentially (default: 1, parallel across alts)"
              }
            ]
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.onboard,
            name: "onboard",
            description: "Automatically answer community onboarding questions on current server (last options)"
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.help,
            name: "help",
            description: "Interactive help guide for InfernoAuth Suite",
            options: [
              {
                required: false,
                type: 3,
                name: "command",
                description: "Select a command to see its detailed guide and usage examples",
                choices: [
                  { name: "all (Overview of all commands)", value: "all" },
                  { name: "/token account (Multi-account manager)", value: "account" },
                  { name: "/token switch (Fast account switcher)", value: "switch" },
                  { name: "/token join (Server joiner - active or alts)", value: "join" },
                  { name: "/leaveserver (Leave server - active or alts)", value: "leaveserver" },
                  { name: "/leaveallserver (Mass leave all servers)", value: "leaveallserver" },
                  { name: "/showedit (Persistent message edit history)", value: "showedit" },
                  { name: "/avatar (High-res 4096px avatar grabber)", value: "avatar" },
                  { name: "/banner (High-res 4096px banner grabber)", value: "banner" },
                  { name: "/servericon (High-res 4096px server icon)", value: "servericon" },
                  { name: "/token login (Direct token login)", value: "login" },
                  { name: "/tokenlogin (Direct safe token login)", value: "login" },
                  { name: "/token logout (Safe session logout)", value: "logout" },
                  { name: "/token get (Retrieve active token)", value: "get" },
                  { name: "/deleted (Deleted messages logger)", value: "deleted" },
                  { name: "/appauthorize (Batch bot/app authorizer)", value: "appauthorize" },
                  { name: "/background (Custom wallpaper & frosted glass)", value: "background" },
                  { name: "/backgroundreset (Reset background to default)", value: "backgroundreset" },
                  { name: "/sendmsg (Send message to channel - active or all alts)", value: "sendmsg" },
                  { name: "/onboard (Auto-solve onboarding questions - last options)", value: "onboard" }
                ]
              }
            ]
          }),
          y({
            type: 1,
            inputType: 1,
            applicationId: "-1",
            execute: r.help,
            name: "infernohelp",
            description: "Alias for /help",
            options: [
              {
                required: false,
                type: 3,
                name: "command",
                description: "Select a command to see its detailed guide and usage examples",
                choices: [
                  { name: "all (Overview of all commands)", value: "all" },
                  { name: "/token account (Multi-account manager)", value: "account" },
                  { name: "/token switch (Fast account switcher)", value: "switch" },
                  { name: "/token join (Server joiner - active or alts)", value: "join" },
                  { name: "/leaveserver (Leave server - active or alts)", value: "leaveserver" },
                  { name: "/leaveallserver (Mass leave all servers)", value: "leaveallserver" },
                  { name: "/showedit (Persistent message edit history)", value: "showedit" },
                  { name: "/avatar (High-res 4096px avatar grabber)", value: "avatar" },
                  { name: "/banner (High-res 4096px banner grabber)", value: "banner" },
                  { name: "/servericon (High-res 4096px server icon)", value: "servericon" },
                  { name: "/token login (Direct token login)", value: "login" },
                  { name: "/tokenlogin (Direct safe token login)", value: "login" },
                  { name: "/token logout (Safe session logout)", value: "logout" },
                  { name: "/token get (Retrieve active token)", value: "get" },
                  { name: "/deleted (Deleted messages logger)", value: "deleted" },
                  { name: "/appauthorize (Batch bot/app authorizer)", value: "appauthorize" },
                  { name: "/background (Custom wallpaper & frosted glass)", value: "background" },
                  { name: "/backgroundreset (Reset background to default)", value: "backgroundreset" },
                  { name: "/sendmsg (Send message to channel - active or all alts)", value: "sendmsg" },
                  { name: "/onboard (Auto-solve onboarding questions - last options)", value: "onboard" }
                ]
              }
            ]
          })
        ].forEach(function(cmd) {
          e.patches.push(S.registerCommand(cmd));
        });

      } catch(err) {
        console.error(err);
        console.error("Error loading InfernoAuth:", err);
      }
    }
  };

  return h.EMBED_COLOR = u, h.authorMods = p, h.default = I, Object.defineProperty(h, "__esModule", { value: true }), h;
})({}, vendetta.ui, vendetta.commands, vendetta.metro, vendetta.utils, vendetta.metro.common.clipboard, vendetta.patcher, vendetta.ui.toasts);
