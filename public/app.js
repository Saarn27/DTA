const chatContainer = document.getElementById('chat');
const form = document.getElementById('chat-form');
const promptField = document.getElementById('prompt');
const sendButton = document.getElementById('send-btn');
const messageTemplate = document.getElementById('message-template');

const conversation = [];

function createMessageElement(role, content) {
  const node = messageTemplate.content.cloneNode(true);
  const message = node.querySelector('.message');
  message.classList.add(role);

  const avatar = node.querySelector('.avatar');
  avatar.textContent = role === 'user' ? 'You' : 'AI';

  const bubble = node.querySelector('.bubble');
  bubble.textContent = content.trim();

  return message;
}

function appendMessage(role, content) {
  const element = createMessageElement(role, content);
  chatContainer.appendChild(element);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function setLoading(isLoading) {
  sendButton.disabled = isLoading;
  promptField.disabled = isLoading;
  sendButton.textContent = isLoading ? 'Thinking…' : 'Send';
}

function ensureEmptyState() {
  if (conversation.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = `
      <strong>Start the conversation</strong>
      Ask a question and Gemini will answer.
    `;
    chatContainer.appendChild(empty);
  }
}

function clearEmptyState() {
  const empty = chatContainer.querySelector('.empty-state');
  if (empty) {
    empty.remove();
  }
}

async function sendMessage(prompt) {
  const userMessage = { role: 'user', content: prompt };
  conversation.push(userMessage);
  appendMessage('user', prompt);

  setLoading(true);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversation }),
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    const data = await response.json();
    const reply = data.reply?.trim();

    if (!reply) {
      throw new Error('No reply received');
    }

    const aiMessage = { role: 'model', content: reply };
    conversation.push(aiMessage);
    appendMessage('model', reply);
  } catch (error) {
    console.error(error);
    appendMessage('model', 'Sorry, something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const prompt = promptField.value.trim();
  if (!prompt) {
    return;
  }

  clearEmptyState();
  promptField.value = '';
  await sendMessage(prompt);
  promptField.focus();
});

ensureEmptyState();
