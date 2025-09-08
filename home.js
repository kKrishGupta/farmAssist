let count = 1000 // starting number
const target = 1200 // final number
const counter = document.getElementById("queryCount")

function updateCounter() {
  if (count < target) {
    count++
    counter.textContent = count
  } else {
    clearInterval(interval) // stop when target is reached
  }
}

// run every 1000 ms = 1 second
const interval = setInterval(updateCounter, 1000)

document.addEventListener("DOMContentLoaded", () => {
  // Get all feature cards
  const askCard = document.querySelector(".ask-card")
  const learningCard = document.querySelector(".learning-card")
  const rewardsCard = document.querySelector(".rewards-card")
  const cropCard = document.querySelector(".crop-card")
  const weatherCard = document.querySelector(".weather-card")
  const marketCard = document.querySelector(".market-card")
  const forumCard = document.querySelector(".forum-card")
  const officerCard = document.querySelector(".officer-card")

  askCard.addEventListener("click", () => {
    openChatbox()
  })

  learningCard.addEventListener("click", () => {
    openLearningHub()
  })

  rewardsCard.addEventListener("click", () => {
    openRewardsPopup()
  })

  // Other cards still show login popup
  ;[cropCard, weatherCard, marketCard, forumCard, officerCard].forEach((card) => {
    card.addEventListener("click", () => {
      openLoginPopup()
    })
  })
})

function openChatbox() {
  const chatboxHTML = `
    <div id="chatboxModal" class="modal">
      <div class="modal-content chatbox-content">
        <span class="close" onclick="closeChatbox()">&times;</span>
        <h2>Ask Your Question</h2>
        <div class="chat-container">
          <div id="chatMessages" class="chat-messages"></div>
          <div class="chat-input-container">
            <textarea id="questionInput" placeholder="Enter your farming question here..." rows="3"></textarea>
            <button onclick="generateAnswer()" class="ask-btn">Ask AI</button>
          </div>
        </div>
      </div>
    </div>
  `

  document.body.insertAdjacentHTML("beforeend", chatboxHTML)
  document.getElementById("chatboxModal").style.display = "block"
}

function closeChatbox() {
  const modal = document.getElementById("chatboxModal")
  if (modal) {
    modal.remove()
  }
}

function generateAnswer() {
  const questionInput = document.getElementById("questionInput")
  const chatMessages = document.getElementById("chatMessages")
  const question = questionInput.value.trim()

  if (!question) {
    alert("Please enter a question first!")
    return
  }

  // Add user question to chat
  const userMessage = document.createElement("div")
  userMessage.className = "message user-message"
  userMessage.innerHTML = `<strong>You:</strong> ${question}`
  chatMessages.appendChild(userMessage)

  // Show loading message
  const loadingMessage = document.createElement("div")
  loadingMessage.className = "message ai-message loading"
  loadingMessage.innerHTML = "<strong>AI:</strong> Generating answer..."
  chatMessages.appendChild(loadingMessage)

  // Simulate AI response (replace with actual AI API call)
  setTimeout(() => {
    loadingMessage.classList.remove("loading")
    loadingMessage.innerHTML = `<strong>AI:</strong> ${generateFarmingAdvice(question)}`
    chatMessages.scrollTop = chatMessages.scrollHeight
  }, 2000)

  // Clear input
  questionInput.value = ""
  chatMessages.scrollTop = chatMessages.scrollHeight
}

function generateFarmingAdvice(question) {
  const responses = [
    "Based on your question, I recommend checking soil moisture levels and ensuring proper drainage for optimal crop growth.",
    "For this farming issue, consider using organic fertilizers and implementing crop rotation to maintain soil health.",
    "Weather conditions play a crucial role. Monitor local weather forecasts and adjust irrigation schedules accordingly.",
    "This appears to be a common farming challenge. Consider consulting with local agricultural experts for region-specific advice.",
    "Proper timing is essential in farming. Make sure to follow seasonal guidelines for your specific crop type.",
    "Integrated pest management techniques can help address this issue while maintaining environmental sustainability.",
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

function openLoginPopup() {
  const loginHTML = `
    <div id="loginModal" class="modal">
      <div class="modal-content login-content">
        <span class="close" onclick="closeLoginPopup()">&times;</span>
        <h2>Access Required</h2>
        <p>Please login or signup to access this feature</p>
        <div class="login-buttons">
          <button onclick="handleLogin()" class="login-btn">Login</button>
          <button onclick="handleSignup()" class="signup-btn">Sign Up</button>
        </div>
      </div>
    </div>
  `

  document.body.insertAdjacentHTML("beforeend", loginHTML)
  document.getElementById("loginModal").style.display = "block"
}

function closeLoginPopup() {
  const modal = document.getElementById("loginModal")
  if (modal) {
    modal.remove()
  }
}

function handleLogin() {
  closeLoginPopup()
  showLoginForm()
}

function handleSignup() {
  closeLoginPopup()
  showSignupForm()
}

function showLoginForm() {
  const loginFormHTML = `
    <div id="loginFormModal" class="modal">
      <div class="modal-content login-form-content">
        <span class="close" onclick="closeLoginForm()">&times;</span>
        <h2>Login</h2>
        <form class="auth-form">
          <div class="form-group">
            <label for="loginEmail">Email:</label>
            <input type="email" id="loginEmail" required>
          </div>
          <div class="form-group">
            <label for="loginPassword">Password:</label>
            <input type="password" id="loginPassword" required>
          </div>
          <button type="submit" class="auth-btn">Login</button>
          <p class="switch-form">Don't have an account? <a href="#" onclick="switchToSignup()">Sign up</a></p>
        </form>
      </div>
    </div>
  `

  document.body.insertAdjacentHTML("beforeend", loginFormHTML)
  document.getElementById("loginFormModal").style.display = "block"
}

function showSignupForm() {
  const signupFormHTML = `
    <div id="signupFormModal" class="modal">
      <div class="modal-content signup-form-content">
        <span class="close" onclick="closeSignupForm()">&times;</span>
        <h2>Sign Up</h2>
        <form class="auth-form">
          <div class="form-group">
            <label for="signupName">Full Name:</label>
            <input type="text" id="signupName" required>
          </div>
          <div class="form-group">
            <label for="signupEmail">Email:</label>
            <input type="email" id="signupEmail" required>
          </div>
          <div class="form-group">
            <label for="signupPassword">Password:</label>
            <input type="password" id="signupPassword" required>
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm Password:</label>
            <input type="password" id="confirmPassword" required>
          </div>
          <button type="submit" class="auth-btn">Sign Up</button>
          <p class="switch-form">Already have an account? <a href="#" onclick="switchToLogin()">Login</a></p>
        </form>
      </div>
    </div>
  `

  document.body.insertAdjacentHTML("beforeend", signupFormHTML)
  document.getElementById("signupFormModal").style.display = "block"
}

function closeLoginForm() {
  const modal = document.getElementById("loginFormModal")
  if (modal) {
    modal.remove()
  }
}

function closeSignupForm() {
  const modal = document.getElementById("signupFormModal")
  if (modal) {
    modal.remove()
  }
}

function switchToSignup() {
  closeLoginForm()
  showSignupForm()
}

function switchToLogin() {
  closeSignupForm()
  showLoginForm()
}

function openLearningHub() {
  const learningHubHTML = `
    <div id="learningHubModal" class="modal">
      <div class="modal-content learning-hub-content">
        <span class="close" onclick="closeLearningHub()">&times;</span>
        <h2>🌱 Learning Hub</h2>
        <p>Expand your farming knowledge with these topics:</p>
        <div class="learning-topics">
          <div class="topic-card" onclick="openTopic('soil-management')">
            <h3>🌱 Soil Management</h3>
            <p>Learn about soil health, pH levels, and nutrient management</p>
          </div>
          <div class="topic-card" onclick="openTopic('crop-rotation')">
            <h3>🔄 Crop Rotation</h3>
            <p>Master the art of rotating crops for better yields</p>
          </div>
          <div class="topic-card" onclick="openTopic('pest-control')">
            <h3>🐛 Pest Control</h3>
            <p>Natural and effective pest management techniques</p>
          </div>
          <div class="topic-card" onclick="openTopic('irrigation')">
            <h3>💧 Irrigation Systems</h3>
            <p>Efficient water management and irrigation methods</p>
          </div>
          <div class="topic-card" onclick="openTopic('organic-farming')">
            <h3>🌿 Organic Farming</h3>
            <p>Sustainable and chemical-free farming practices</p>
          </div>
          <div class="topic-card" onclick="openTopic('harvest-storage')">
            <h3>📦 Harvest & Storage</h3>
            <p>Proper harvesting techniques and storage methods</p>
          </div>
        </div>
      </div>
    </div>
  `

  document.body.insertAdjacentHTML("beforeend", learningHubHTML)
  document.getElementById("learningHubModal").style.display = "block"
}

function closeLearningHub() {
  const modal = document.getElementById("learningHubModal")
  if (modal) {
    modal.remove()
  }
}

function openRewardsPopup() {
  const rewardsHTML = `
    <div id="rewardsModal" class="modal">
      <div class="modal-content rewards-content">
        <span class="close" onclick="closeRewardsPopup()">&times;</span>
        <h2>🎁 Rewards & Coins</h2>
        <div class="rewards-info">
          <h3>💰 Earn Money by Referring Friends!</h3>
          <p>Share FarmAssist with your fellow farmers and earn rewards:</p>
          <ul>
            <li>🌟 ₹50 for each successful referral</li>
            <li>🏆 Bonus ₹100 when you refer 5 friends</li>
            <li>💎 Premium features unlock at 10 referrals</li>
          </ul>
          <div class="referral-code">
            <p><strong>Your Referral Code:</strong> <span class="code">FARM${Math.floor(Math.random() * 10000)}</span></p>
          </div>
          <div class="share-buttons">
            <button onclick="shareReferral('whatsapp')" class="share-btn whatsapp">Share on WhatsApp</button>
            <button onclick="shareReferral('copy')" class="share-btn copy">Copy Link</button>
          </div>
        </div>
      </div>
    </div>
  `

  document.body.insertAdjacentHTML("beforeend", rewardsHTML)
  document.getElementById("rewardsModal").style.display = "block"
}

function closeRewardsPopup() {
  const modal = document.getElementById("rewardsModal")
  if (modal) {
    modal.remove()
  }
}

function openTopic(topicId) {
  alert(`Opening ${topicId.replace("-", " ")} learning module...`)
  // Here you would typically load the specific learning content
}

function shareReferral(platform) {
  const referralCode = document.querySelector(".code").textContent
  const message = `Join FarmAssist and get expert farming advice! Use my referral code: ${referralCode} and we both earn rewards! Download: https://farmassist.com`

  if (platform === "whatsapp") {
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank")
  } else if (platform === "copy") {
    navigator.clipboard.writeText(message).then(() => {
      alert("Referral link copied to clipboard!")
    })
  }
}

window.onclick = (event) => {
  const chatModal = document.getElementById("chatboxModal")
  const loginModal = document.getElementById("loginModal")
  const learningModal = document.getElementById("learningHubModal")
  const rewardsModal = document.getElementById("rewardsModal")
  const loginFormModal = document.getElementById("loginFormModal")
  const signupFormModal = document.getElementById("signupFormModal")

  if (event.target === chatModal) {
    closeChatbox()
  }
  if (event.target === loginModal) {
    closeLoginPopup()
  }
  if (event.target === learningModal) {
    closeLearningHub()
  }
  if (event.target === rewardsModal) {
    closeRewardsPopup()
  }
  if (event.target === loginFormModal) {
    closeLoginForm()
  }
  if (event.target === signupFormModal) {
    closeSignupForm()
  }
}
