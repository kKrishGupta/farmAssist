document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.getElementById("profileBtn")
  const profilePopup = document.getElementById("profilePopup")

  // Toggle profile popup
  profileBtn.addEventListener("click", () => {
    profilePopup.style.display = profilePopup.style.display === "block" ? "none" : "block"
  })

  // Close popup if clicked outside
  document.addEventListener("click", (e) => {
    if (!profileBtn.contains(e.target) && !profilePopup.contains(e.target)) {
      profilePopup.style.display = "none"
    }
  })

  // Logout button action
  const logoutBtn = document.querySelector(".logout-btn")
  logoutBtn.addEventListener("click", () => {
    alert("You have been logged out!")
    // redirect to login page if needed
    window.location.href = "login.html"
  })

  // Chat Modal Functions
  const chatModal = document.getElementById("chatModal")
  const chatInput = document.getElementById("chatInput")
  const chatMessages = document.getElementById("chatMessages")
  const chatHistory = document.getElementById("chatHistory")
  const chatSidebar = document.getElementById("chatSidebar")
  const weatherModal = document.getElementById("weatherModal")
  const locationInput = document.getElementById("locationInput")
  const weatherDisplay = document.getElementById("weatherDisplay")
  const examplesSection = document.getElementById("examplesSection")

  const chatHistoryArray = []
  let hasStartedChat = false
  let isHistoryVisible = false

  function openChatModal(mode) {
    if (mode === "audio") {
      openVoiceModal()
      return
    }

    if (mode !== "text") return

    chatModal.style.display = "block"

    if (!hasStartedChat) {
      examplesSection.style.display = "block"
    } else {
      examplesSection.style.display = "none"
    }

    chatInput.focus()
    loadChatHistory()
  }

  function closeChatModal() {
    chatModal.style.display = "none"
  }

  function askExample(question) {
    startChatInterface()
    addMessageToChat("user", question)

    // Simulate AI response
    setTimeout(() => {
      const response = generateFarmingResponse(question)
      addMessageToChat("bot", response)
      saveChatHistory(question, response)
    }, 1000)
  }

  function startChatInterface() {
    if (!hasStartedChat) {
      hasStartedChat = true
      examplesSection.style.display = "none"

      // Clear initial welcome message and add new one
      chatMessages.innerHTML = `
        <div class="bot-message">
          <div class="message-avatar">🤖</div>
          <div class="message-content">Welcome to Farm Assist! How can I help you with your farming needs?</div>
        </div>
      `
    }
  }

  function toggleMoreExamples() {
    // Add more example questions
    const moreExamples = [
      "What is the best fertilizer for tomatoes?",
      "How to prevent fungal diseases in crops?",
      "When should I harvest my wheat crop?",
      "What are organic pest control methods?",
    ]

    const examplesGrid = document.querySelector(".examples-grid")
    const currentCards = examplesGrid.children.length

    if (currentCards === 4) {
      // Add more examples
      moreExamples.forEach((example) => {
        const card = document.createElement("div")
        card.className = "example-card"
        card.textContent = example
        card.onclick = () => askExample(example)
        examplesGrid.appendChild(card)
      })

      // Update button text
      document.querySelector(".more-examples").innerHTML = '<i class="fas fa-chevron-up"></i> Less Examples'
    } else {
      // Remove extra examples
      while (examplesGrid.children.length > 4) {
        examplesGrid.removeChild(examplesGrid.lastChild)
      }

      // Update button text
      document.querySelector(".more-examples").innerHTML = '<i class="fas fa-chevron-down"></i> More Examples'
    }
  }

  function sendMessage() {
    const message = chatInput.value.trim()

    if (message) {
      startChatInterface()
      addMessageToChat("user", message)
      chatInput.value = ""

      showTypingIndicator()

      // Simulate AI response
      setTimeout(() => {
        hideTypingIndicator()
        const response = generateFarmingResponse(message)
        addMessageToChat("bot", response)
        saveChatHistory(message, response)
      }, 1500)
    }
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement("div")
    typingDiv.className = "bot-message typing-indicator"
    typingDiv.id = "typingIndicator"
    typingDiv.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-content">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `
    chatMessages.appendChild(typingDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  function hideTypingIndicator() {
    const typingIndicator = document.getElementById("typingIndicator")
    if (typingIndicator) {
      typingIndicator.remove()
    }
  }

  function addMessageToChat(sender, message) {
    const messageDiv = document.createElement("div")
    messageDiv.className = sender === "user" ? "user-message" : "bot-message"

    const avatar = sender === "user" ? "👤" : "🤖"
    messageDiv.innerHTML = `
      <div class="message-avatar">${avatar}</div>
      <div class="message-content">${message}</div>
    `

    chatMessages.appendChild(messageDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  function generateFarmingResponse(question) {
    const responses = [
      "For rice cultivation at 30 days, apply urea 50kg per acre with irrigation.",
      "Check soil moisture levels and ensure proper drainage for your crops.",
      "Consider using organic fertilizers for better soil health and sustainability.",
      "Monitor weather conditions and adjust irrigation schedule accordingly.",
      "Pest control is crucial at this stage. Use integrated pest management techniques.",
      "For soil improvement, add organic compost and maintain proper pH levels between 6.0-7.0.",
      "Use neem oil spray for organic pest control, apply early morning or evening.",
      "Harvest when 80% of grains turn golden yellow for optimal yield and quality.",
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  function saveChatHistory(question, answer) {
    const historyItem = {
      id: Date.now(),
      question: question.substring(0, 50) + (question.length > 50 ? "..." : ""),
      timestamp: new Date().toLocaleString(),
    }

    chatHistoryArray.unshift(historyItem)
    if (chatHistoryArray.length > 10) chatHistoryArray.pop()

    updateHistoryDisplay()
  }

  function loadChatHistory() {
    updateHistoryDisplay()
  }

  function updateHistoryDisplay() {
    if (chatHistoryArray.length === 0) {
      chatHistory.innerHTML = '<div class="history-item">No previous chats</div>'
      return
    }

    chatHistory.innerHTML = ""
    chatHistoryArray.forEach((item) => {
      const historyDiv = document.createElement("div")
      historyDiv.className = "history-item"
      historyDiv.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 0.25rem;">${item.question}</div>
        <div style="font-size: 0.8rem; color: #666;">${item.timestamp}</div>
      `
      chatHistory.appendChild(historyDiv)
    })
  }

  // Weather Modal Functions
  function openWeatherModal() {
    weatherModal.style.display = "block"
    // Load weather for default location
    loadWeatherData("Palakkad")
  }

  function closeWeatherModal() {
    weatherModal.style.display = "none"
  }

  function searchLocation() {
    const location = locationInput.value.trim()
    if (location) {
      loadWeatherData(location)
    }
  }

  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lon = position.coords.longitude
          loadWeatherByCoords(lat, lon)
        },
        (error) => {
          alert("Unable to get your location. Please search manually.")
        },
      )
    }
  }

  function loadWeatherData(location) {
    // Simulate weather API call
    const weatherData = {
      location: location,
      current: {
        temp: 27,
        condition: "Sunny",
        icon: "☀️",
      },
      forecast: [
        { day: "TUE", icon: "☀️", high: 26, low: 19 },
        { day: "WED", icon: "🌧️", high: 24, low: 18 },
        { day: "THU", icon: "⛈️", high: 20, low: 16 },
        { day: "FRI", icon: "☁️", high: 24, low: 16 },
      ],
    }

    displayWeatherData(weatherData)
  }

  function loadWeatherByCoords(lat, lon) {
    // Simulate reverse geocoding and weather fetch
    loadWeatherData("Current Location")
  }

  function displayWeatherData(data) {
    weatherDisplay.innerHTML = `
      <div class="current-weather">
        <div class="weather-icon">${data.current.icon}</div>
        <div class="temperature">${data.current.temp}°C</div>
        <div class="weather-desc">${data.current.condition}</div>
        <div style="margin-top: 1rem; color: #666;">📍 ${data.location}</div>
      </div>
      
      <div class="forecast-container">
        ${data.forecast
          .map(
            (day) => `
          <div class="forecast-day">
            <h4>${day.day}</h4>
            <div style="font-size: 2rem; margin: 0.5rem 0;">${day.icon}</div>
            <div style="font-weight: bold;">${day.high}°</div>
            <div style="color: #666;">${day.low}°</div>
          </div>
        `,
          )
          .join("")}
      </div>
    `
  }

  // Close modals when clicking outside
  window.onclick = (event) => {
    if (event.target === chatModal) {
      closeChatModal()
    }
    if (event.target === weatherModal) {
      closeWeatherModal()
    }
    if (event.target === document.getElementById("voiceModal")) {
      closeVoiceModal()
    }
  }

  // Allow Enter key to send messages
  document.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && chatModal.style.display === "block") {
      sendMessage()
    }
  })

  function toggleHistoryList() {
    isHistoryVisible = !isHistoryVisible
    const sidebar = document.getElementById("chatSidebar")
    const chatMain = document.querySelector(".chat-main")

    if (isHistoryVisible) {
      sidebar.style.display = "block"
      chatMain.style.width = "70%"
    } else {
      sidebar.style.display = "none"
      chatMain.style.width = "100%"
    }
  }

  window.openChatModal = openChatModal
  window.closeChatModal = closeChatModal
  window.sendMessage = sendMessage
  window.toggleHistoryList = toggleHistoryList
  window.openWeatherModal = openWeatherModal
  window.closeWeatherModal = closeWeatherModal
  window.searchLocation = searchLocation
  window.getCurrentLocation = getCurrentLocation
  window.askExample = askExample
  window.toggleMoreExamples = toggleMoreExamples

  // Voice Recognition Variables and Functions
  let recognition = null
  let isRecording = false

  // Initialize speech recognition if available
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onstart = () => {
      isRecording = true
      updateMicButton()
      document.getElementById("recordingStatus").textContent = "Listening..."
      document.getElementById("voiceTextDisplay").innerHTML = "<p>Listening for your voice...</p>"
    }

    recognition.onresult = (event) => {
      let transcript = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }

      document.getElementById("voiceTextDisplay").innerHTML = `<p><strong>You said:</strong> ${transcript}</p>`

      if (event.results[event.results.length - 1].isFinal) {
        processVoiceQuery(transcript)
      }
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error)
      document.getElementById("recordingStatus").textContent = "Error occurred. Try again."
      isRecording = false
      updateMicButton()
    }

    recognition.onend = () => {
      isRecording = false
      updateMicButton()
      document.getElementById("recordingStatus").textContent = "Tap to speak"
    }
  }

  function openVoiceModal() {
    const voiceModal = document.getElementById("voiceModal")
    voiceModal.style.display = "block"

    // Reset interface
    document.getElementById("voiceTextDisplay").innerHTML = "<p>Your speech will appear here...</p>"
    document.getElementById("voiceResponse").style.display = "none"
    document.getElementById("recordingStatus").textContent = "Tap to speak"
    isRecording = false
    updateMicButton()
  }

  function closeVoiceModal() {
    const voiceModal = document.getElementById("voiceModal")
    voiceModal.style.display = "none"

    // Stop recording if active
    if (isRecording && recognition) {
      recognition.stop()
    }
  }

  function toggleRecording() {
    if (!recognition) {
      alert("Speech recognition is not supported in your browser. Please use Chrome or Edge.")
      return
    }

    if (isRecording) {
      recognition.stop()
    } else {
      recognition.start()
    }
  }

  function updateMicButton() {
    const micButton = document.getElementById("micButton")
    const micIcon = document.getElementById("micIcon")

    if (isRecording) {
      micButton.classList.add("recording")
      micIcon.className = "fas fa-stop"
    } else {
      micButton.classList.remove("recording")
      micIcon.className = "fas fa-microphone"
    }
  }

  function processVoiceQuery(transcript) {
    // Show the response section
    const voiceResponse = document.getElementById("voiceResponse")
    const responseContent = document.getElementById("responseContent")

    voiceResponse.style.display = "block"
    responseContent.innerHTML = '<div class="loading">Processing your query...</div>'

    // Simulate AI response processing
    setTimeout(() => {
      const response = generateFarmingResponse(transcript)
      responseContent.innerHTML = `<p>${response}</p>`

      // Save to chat history
      saveChatHistory(transcript, response)
    }, 1500)
  }

  // Add voice modal functions to window object
  window.openVoiceModal = openVoiceModal
  window.closeVoiceModal = closeVoiceModal
  window.toggleRecording = toggleRecording
})

const cards = document.querySelector(".circle-cards")
let angle = 0
function next() {
  angle -= 90 // rotate by one card
  cards.style.transform = `rotate(${angle}deg)`
}
function prev() {
  angle += 90
  cards.style.transform = `rotate(${angle}deg)`
}
