// Generate a random ID function
function generateRandomId() {
    return Math.random().toString(36).substr(2, 9);
}

// Function to handle form submission and chat window interaction
document.getElementById('contactForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = event.target.name.value;
    const topic = event.target.topic.value;
    const message = event.target.message.value;
    const chatId = generateRandomId(); // Generate a random chat ID

    // Send data to Discord webhook with chat ID
    await sendMessageToWebhook(`**Chat ID:** ${chatId}\n**Name:** ${name}\n**Topic:** ${topic}\n**Message:** ${message}`);

    // Open chat window with the initial message and chat ID
    openChatWindow(chatId, name, message);
});

// Function to send message to Discord webhook
async function sendMessageToWebhook(messageContent) {
    await fetch('https://discord.com/api/webhooks/1262261700212822069/qKAjkAWPooS1S0DVlBFowfaxEu_7G12exIpQ1Io8KOFotzrXM37Xfp7J5TI9v9_mv7p9', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: messageContent
        }),
    });
}

// Function to open and interact with the chat window
function openChatWindow(chatId, name, initialMessage) {
    const chatWindow = document.getElementById('chatWindow');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const minimizeBtn = document.getElementById('minimizeChat');
    const closeBtn = document.getElementById('closeChat');

    chatWindow.style.display = 'flex';
    chatWindow.dataset.chatId = chatId; // Store chat ID in dataset
    chatMessages.innerHTML = `<div class="message"><strong>${name}:</strong> ${initialMessage}</div>`;
    chatInput.focus();

    closeBtn.addEventListener('click', async () => {
        // Send message to Discord webhook about conversation closure
        await sendMessageToWebhook(`**Conversation Closed**\n**Chat ID:** ${chatId}\n**Name:** ${name}`);

        // Show confirmation to the user on the site
        alert('Conversation closed. Thank you for chatting with us!');

        // Remove chat window and reset
        chatWindow.style.display = 'none';
        chatMessages.innerHTML = '';
        chatInput.value = '';
    });

    document.getElementById('sendChat').addEventListener('click', async () => {
        const message = chatInput.value.trim();
        if (message) {
            chatMessages.innerHTML += `<div class="message"><strong>You:</strong> ${message}</div>`;
            await sendMessageToWebhook(`**${name}**:\n${message}`);
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
        }
    });

    minimizeBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('minimized');
        if (chatWindow.classList.contains('minimized')) {
            minimizeBtn.innerText = 'Maximize';
        } else {
            minimizeBtn.innerText = 'Minimize';
        }
    });
}

  