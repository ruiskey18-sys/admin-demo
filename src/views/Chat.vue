
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface ChatMessage {
  id: string
  senderId: string
  content: string
  sentAt: string
}

const storedClientId = sessionStorage.getItem('chat-client-id')
const clientId = storedClientId || crypto.randomUUID()
sessionStorage.setItem('chat-client-id', clientId)

const messages = ref<ChatMessage[]>([])
const inputMessage = ref('')
const connected = ref(false)

let socket: WebSocket | null = null

// 1. 建立 WebSocket 连接
function connect() {
  socket = new WebSocket('ws://localhost:8080/ws/chat')

  socket.onopen = () => {
    connected.value = true
    console.log('WebSocket 连接成功')
  }

  // 2. 接收服务器广播的消息
  socket.onmessage = (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data) as ChatMessage
      messages.value.push(message)
    } catch {
      // 兼容后端或旧客户端发送的纯文本消息。
      messages.value.push({
        id: crypto.randomUUID(),
        senderId: '',
        content: String(event.data),
        sentAt: new Date().toISOString()
      })
    }
  }

  socket.onerror = (error) => {
    console.error('WebSocket 出错', error)
  }

  socket.onclose = () => {
    connected.value = false
    console.log('WebSocket 连接关闭')
  }
}

// 3. 向服务器发送消息
function sendMessage() {
  if (!inputMessage.value.trim()) return

  if (socket?.readyState === WebSocket.OPEN) {
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: clientId,
      content: inputMessage.value.trim(),
      sentAt: new Date().toISOString()
    }

    // 后端会将 JSON 字符串原样广播给所有客户端。
    socket.send(JSON.stringify(message))
    inputMessage.value = ''
  }
}

// 4. 进入页面时自动连接
onMounted(() => {
  connect()
})

// 5. 离开页面时关闭连接
onUnmounted(() => {
  socket?.close()
})
</script>

<template>
  <div class="chat-container">
    <h2>WebSocket 群聊 Demo</h2>

    <p>
      连接状态：
      {{ connected ? '🟢 已连接' : '🔴 未连接' }}
    </p>

    <div class="message-list">
      <div
        v-for="(message, index) in messages"
        :key="message.id || index"
        class="message-row"
        :class="{ 'message-row--self': message.senderId === clientId }"
      >
        <div class="message-bubble">
          {{ message.content }}
        </div>
      </div>
    </div>

    <div class="input-area">
      <input
        v-model="inputMessage"
        placeholder="输入消息"
        @keyup.enter="sendMessage"
      />

      <button
        :disabled="!connected"
        @click="sendMessage"
      >
        发送
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  width: 600px;
  margin: 40px auto;
}

.message-list {
  height: 350px;
  border: 1px solid #ddd;
  padding: 12px;
  overflow-y: auto;
}

.message-row {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 8px;
}

.message-row--self {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 72%;
  padding: 9px 12px;
  color: #303133;
  background: #f2f3f5;
  border-radius: 6px;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.message-row--self .message-bubble {
  color: #fff;
  background: #409eff;
}

.input-area {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.input-area input {
  flex: 1;
  padding: 10px;
}

.input-area button {
  padding: 10px 20px;
}
</style>
