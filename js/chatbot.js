/* ── AWEBAI CHATBOT ASSISTANT ── */

let chatOpen = false;

const bots = {
    "pricing": "💰 Our websites start from ₹15,000. AI projects from ₹25,000. Automation from ₹20,000. Get a free custom quote on our Contact page!",
    "web dev": "🌐 We build fast, modern websites with Next.js, React & Tailwind. Mobile-first, SEO-ready. View our Portfolio for examples!",
    "ai tools": "🤖 We build custom AI chatbots, automation tools and smart integrations using GPT-4, Claude and more. Shall I connect you with our team?",
    "contact": "📞 Email: awebai07@gmail.com | WhatsApp: +91 91231 35001. We reply within 24 hours!",
    "default": "🤔 Great question! For a detailed answer, please visit our Contact page or WhatsApp us — we respond fast! 🚀"
};

function toggleChat() {
    const chatbot = document.getElementById("chatbot");
    const fab = document.getElementById("fab");
    if (!chatbot || !fab) return;
    
    chatOpen = !chatOpen;
    chatbot.classList.toggle("open", chatOpen);
    
    fab.innerHTML = chatOpen 
        ? "<div class='fab-ring'></div>✕" 
        : "<div class='fab-ring'></div><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.25' stroke-linecap='round' stroke-linejoin='round' style='width:22px;height:22px;'><path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'/></svg>";
}

function addMsg(t, type, isHtml = false) {
    const cbMsgs = document.getElementById("cbMsgs");
    if (!cbMsgs) return;
    
    const d = document.createElement("div");
    d.className = "msg " + type;
    if (isHtml) {
        d.innerHTML = t;
    } else {
        d.textContent = t;
    }
    
    cbMsgs.appendChild(d);
    cbMsgs.scrollTop = cbMsgs.scrollHeight;
    return d;
}

function addTypingIndicator() {
    const cbMsgs = document.getElementById("cbMsgs");
    if (!cbMsgs) return;
    
    const d = document.createElement("div");
    d.className = "msg bot typing-indicator-msg";
    d.id = "typing-indicator";
    d.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    
    cbMsgs.appendChild(d);
    cbMsgs.scrollTop = cbMsgs.scrollHeight;
    return d;
}

function removeTypingIndicator() {
    const indicator = document.getElementById("typing-indicator");
    if (indicator) indicator.remove();
}

function formatMessage(text) {
    const div = document.createElement('div');
    div.textContent = text;
    let escaped = div.innerHTML;

    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
    escaped = escaped.replace(/`(.*?)`/g, '<code style="background: rgba(255,255,255,0.1); padding: 2px 4px; border-radius: 4px; font-family: monospace;">$1</code>');
    escaped = escaped.replace(/\n/g, '<br>');

    return escaped;
}

async function getAIResponse(userText) {
    addTypingIndicator();
    let replyText = "";
    try {
        const response = await fetch("https://api.blackbox.ai/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: [{ role: "user", content: userText }],
                id: "chat-session",
                previewToken: null,
                userId: null,
                codeModelMode: true,
                agentMode: {},
                trendingAgentMode: {},
                isMicMode: false,
                isClearStack: false
            })
        });
        if (response.ok) {
            replyText = await response.text();
        } else {
            throw new Error("API call failed");
        }
    } catch (error) {
        const l = userText.toLowerCase();
        replyText = bots.default;
        for (const [k, v] of Object.entries(bots)) {
            if (l.includes(k)) {
                replyText = v;
                break;
            }
        }
    } finally {
        removeTypingIndicator();
    }
    addMsg(formatMessage(replyText), "bot", true);
}

function qr(t) {
    addMsg(t, "usr");
    setTimeout(() => {
        getAIResponse(t);
    }, 400);
}

function sendChat() {
    const inp = document.getElementById("cbInp");
    if (!inp) return;
    
    const t = inp.value.trim();
    if (!t) return;
    
    addMsg(t, "usr");
    inp.value = "";
    setTimeout(() => {
        getAIResponse(t);
    }, 400);
}
