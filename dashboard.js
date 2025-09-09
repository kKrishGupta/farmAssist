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
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault()
    alert("You have been logged out!")
    // redirect to login page if needed
    // window.location.href = "login.html";
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

  // Image Modal Elements
  const imageModal = document.getElementById("imageModal")
  const cameraSection = document.getElementById("cameraSection")
  const cameraVideo = document.getElementById("cameraVideo")
  const cameraCanvas = document.getElementById("cameraCanvas")
  const fileInput = document.getElementById("fileInput")
  const imagePreviewSection = document.getElementById("imagePreviewSection")
  const previewImage = document.getElementById("previewImage")
  const extractedText = document.getElementById("extractedText")
  const imageResponseSection = document.getElementById("imageResponseSection")
  const imageResponse = document.getElementById("imageResponse")

  // Crop Calendar Modal Elements
  const cropCalendarModal = document.getElementById("cropCalendarModal")
  const cropSelect = document.getElementById("cropSelect")
  const seasonSelect = document.getElementById("seasonSelect")
  const regionSelect = document.getElementById("regionSelect")
  const seasonTips = document.getElementById("seasonTips")

  // Market Updates Modal Elements
  const marketModal = document.getElementById("marketModal")
  const marketLocation = document.getElementById("marketLocation")
  const refreshBtn = document.querySelector(".refresh-btn")

  // Community Forum Modal Elements
  const communityModal = document.getElementById("communityModal")
  const newPostForm = document.getElementById("newPostForm")
  const postTitle = document.getElementById("postTitle")
  const postContent = document.getElementById("postContent")
  const postCategory = document.getElementById("postCategory")
  const forumPosts = document.getElementById("forumPosts")
  const categoryButtons = document.querySelectorAll(".category-btn")

  const chatHistoryArray = []
  let hasStartedChat = false
  let isHistoryVisible = false
  let cameraStream = null

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

  function openImageModal() {
    imageModal.style.display = "block"
    resetImageUpload()
  }

  function closeImageModal() {
    imageModal.style.display = "none"
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      cameraStream = null
    }
  }

  function openCamera() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        cameraStream = stream
        cameraVideo.srcObject = stream
        cameraSection.style.display = "block"
        document.querySelector(".upload-options").style.display = "none"
      })
      .catch((err) => {
        console.error("Error accessing camera:", err)
        alert("Unable to access camera. Please check permissions or try file upload.")
      })
  }

  function closeCameraSection() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      cameraStream = null
    }
    cameraSection.style.display = "none"
    document.querySelector(".upload-options").style.display = "flex"
  }

  function captureImage() {
    const canvas = cameraCanvas
    const video = cameraVideo
    const context = canvas.getContext("2d")

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    canvas.toBlob(
      (blob) => {
        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" })
        processImageFile(file)
      },
      "image/jpeg",
      0.8,
    )

    closeCameraSection()
  }

  function openFileUpload() {
    fileInput.click()
  }

  function handleFileUpload(event) {
    const file = event.target.files[0]
    if (file && file.type.startsWith("image/")) {
      processImageFile(file)
    } else {
      alert("Please select a valid image file.")
    }
  }

  function processImageFile(file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.src = e.target.result
      document.querySelector(".upload-options").style.display = "none"
      imagePreviewSection.style.display = "flex"

      // Simulate OCR processing
      extractedText.textContent = "Processing image..."

      // Simulate OCR delay
      setTimeout(() => {
        const mockOCRText = simulateOCR(file.name)
        extractedText.textContent = mockOCRText
      }, 2000)
    }
    reader.readAsDataURL(file)
  }

  function simulateOCR(filename) {
    // Mock OCR responses based on common farming scenarios
    const ocrResponses = [
      "Leaf spots visible on tomato plant. Brown circular lesions with yellow halos. Possible early blight disease.",
      "Yellowing leaves on corn crop. Nitrogen deficiency symptoms observed. Recommend fertilizer application.",
      "White powdery substance on cucumber leaves. Powdery mildew infection detected. Fungicide treatment needed.",
      "Insect damage on cabbage leaves. Small holes and chewed edges. Caterpillar infestation likely.",
      "Wilting plants in field. Soil appears dry and cracked. Irrigation required immediately.",
      "Healthy green wheat crop. Good growth pattern observed. Continue current care routine.",
      "Red spider mites on bean plants. Fine webbing visible. Miticide application recommended.",
      "Fruit rot on apple tree. Brown soft spots on apples. Remove affected fruits and apply fungicide.",
    ]

    return ocrResponses[Math.floor(Math.random() * ocrResponses.length)]
  }

  function processImageText() {
    const text = extractedText.textContent
    if (text && text !== "Processing image...") {
      imageResponseSection.style.display = "block"
      imageResponse.innerHTML = '<div class="loading">Analyzing image and generating response...</div>'

      // Simulate AI analysis
      setTimeout(() => {
        const response = generateFarmingResponse(text)
        imageResponse.innerHTML = `<p>${response}</p>`

        // Save to chat history
        saveChatHistory(`Image Analysis: ${text.substring(0, 50)}...`, response)
      }, 2000)
    }
  }

  function resetImageUpload() {
    document.querySelector(".upload-options").style.display = "flex"
    cameraSection.style.display = "none"
    imagePreviewSection.style.display = "none"
    imageResponseSection.style.display = "none"
    extractedText.textContent = "Processing image..."
    fileInput.value = ""

    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      cameraStream = null
    }
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
      "Apply balanced NPK fertilizer (10:26:26) at flowering stage for better fruit development.",
      "Ensure proper spacing between plants to prevent disease spread and improve air circulation.",
      "Regular pruning helps in better light penetration and reduces pest infestation.",
      "Mulching around plants helps retain moisture and suppress weed growth.",
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

  // Crop Calendar Modal Functions
  const CROP_CALENDAR_API_BASE = "https://api.example.com" // Replace with actual API endpoint
  const GEOAPIFY_API_KEY = "7eba5dd3b8dc4e28bf0d65986e96d262"

  // Get stored location data from landing page
  function getStoredLocationData() {
    try {
      const locationData = localStorage.getItem("farmAssistLocation")
      const language = localStorage.getItem("farmAssistLanguage") || "english"
      return {
        location: locationData ? JSON.parse(locationData) : null,
        language: language,
      }
    } catch (error) {
      console.error("[v0] Error retrieving stored location data:", error)
      return { location: null, language: "english" }
    }
  }

  // Convert location to country code for API
  async function getCountryCodeFromLocation(location) {
    if (!location || !location.lat || !location.lng) {
      return "IN" // Default to India
    }

    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${location.lat}&lon=${location.lng}&apiKey=${GEOAPIFY_API_KEY}`,
      )
      const data = await response.json()

      if (data.features && data.features.length > 0) {
        const countryCode = data.features[0].properties.country_code?.toUpperCase()
        return countryCode || "IN"
      }
      return "IN"
    } catch (error) {
      console.error("[v0] Error getting country code:", error)
      return "IN"
    }
  }

  // Enhanced search function with API integration
  async function searchCrops() {
    const searchTerm = document.getElementById("cropSearchInput").value.toLowerCase()
    const searchResults = document.getElementById("searchResults")

    if (searchTerm.length < 2) {
      searchResults.innerHTML = ""
      searchResults.style.display = "none"
      return
    }

    // Show loading state
    searchResults.innerHTML = '<div class="search-loading">🔍 Searching crops...</div>'
    searchResults.style.display = "block"

    try {
      const { location, language } = getStoredLocationData()
      const countryCode = await getCountryCodeFromLocation(location)

      const apiResponse = await fetchCropCalendarData(countryCode, searchTerm, language)

      if (apiResponse && apiResponse.length > 0) {
        displaySearchResults(apiResponse, searchTerm)
      } else {
        // Fallback to local data if API fails
        searchLocalCrops(searchTerm)
      }
    } catch (error) {
      console.error("[v0] API search failed, using local data:", error)
      searchLocalCrops(searchTerm)
    }
  }

  async function fetchCropCalendarData(countryCode, cropQuery, language = "english") {
    try {
      const url = `${CROP_CALENDAR_API_BASE}/countries/${countryCode}/cropCalendar?crop=${encodeURIComponent(cropQuery)}&language=${language}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Crop calendar API error:", error)
      return null
    }
  }

  function displaySearchResults(apiData, searchTerm) {
    const searchResults = document.getElementById("searchResults")

    if (!apiData || apiData.length === 0) {
      searchResults.innerHTML = '<div class="no-results">No crops found for your search.</div>'
      return
    }

    const resultsHTML = apiData
      .map(
        (crop) => `
      <div class="search-result-item" onclick="selectCropFromAPI('${crop.id}', '${crop.name}')">
        <div class="crop-icon">${crop.icon || "🌾"}</div>
        <div class="crop-info">
          <h5>${crop.name}</h5>
          <p>${crop.description || "Click to view calendar"}</p>
          <small>Duration: ${crop.duration || "N/A"} | Season: ${crop.season || "All seasons"}</small>
        </div>
      </div>
    `,
      )
      .join("")

    searchResults.innerHTML = resultsHTML
  }

  function searchLocalCrops(searchTerm) {
    const searchResults = document.getElementById("searchResults")
    const cropSelect = document.getElementById("cropSelect")
    const matchingCrops = []

    // Search through local crop data
    for (const [key, crop] of Object.entries(cropData)) {
      if (crop.name.toLowerCase().includes(searchTerm) || key.toLowerCase().includes(searchTerm)) {
        matchingCrops.push({ key, ...crop })
      }
    }

    if (matchingCrops.length === 0) {
      searchResults.innerHTML = '<div class="no-results">No crops found. Try a different search term.</div>'
      return
    }

    const resultsHTML = matchingCrops
      .map(
        (crop) => `
      <div class="search-result-item" onclick="selectCropFromLocal('${crop.key}')">
        <div class="crop-icon">🌾</div>
        <div class="crop-info">
          <h5>${crop.name}</h5>
          <p>${crop.overview.description}</p>
          <small>Duration: ${crop.duration} | Type: ${crop.type}</small>
        </div>
      </div>
    `,
      )
      .join("")

    searchResults.innerHTML = resultsHTML
  }

  function selectCropFromLocal(cropKey) {
    const searchResults = document.getElementById("searchResults")
    const cropSearchInput = document.getElementById("cropSearchInput")
    const cropSelect = document.getElementById("cropSelect")

    if (cropData[cropKey]) {
      cropSearchInput.value = cropData[cropKey].name
      cropSelect.value = cropKey
    }

    searchResults.style.display = "none"
    updateCropCalendar()
  }

  function selectCropFromAPI(cropId, cropName) {
    const searchResults = document.getElementById("searchResults")
    const cropSearchInput = document.getElementById("cropSearchInput")
    const cropSelect = document.getElementById("cropSelect")

    cropSearchInput.value = cropName

    // Try to find matching local crop for dropdown
    const matchingKey = Object.keys(cropData).find((key) =>
      cropData[key].name.toLowerCase().includes(cropName.toLowerCase()),
    )

    if (matchingKey) {
      cropSelect.value = matchingKey
    }

    searchResults.style.display = "none"
    loadCropDataFromAPI(cropId)
  }

  async function loadCropDataFromAPI(cropId) {
    try {
      const { location, language } = getStoredLocationData()
      const countryCode = await getCountryCodeFromLocation(location)

      // Show loading state
      document.getElementById("timelineContainer").innerHTML = '<div class="loading">Loading crop calendar...</div>'

      const detailedData = await fetchCropCalendarData(countryCode, cropId, language)

      if (detailedData && detailedData.length > 0) {
        displayAPICalendarData(detailedData[0])
      } else {
        throw new Error("No detailed data available")
      }
    } catch (error) {
      console.error("[v0] Failed to load API data:", error)
      document.getElementById("timelineContainer").innerHTML =
        '<div class="error">Failed to load crop calendar. Please try again.</div>'
    }
  }

  function displayAPICalendarData(cropData) {
    // Update timeline title
    document.getElementById("timelineTitle").textContent = `Farming Calendar for ${cropData.name}`

    // Update timeline with API data
    if (cropData.timeline && cropData.timeline.length > 0) {
      const timelineHTML = cropData.timeline
        .map(
          (stage) => `
        <div class="timeline-item">
          <div class="timeline-icon">${stage.icon || "📅"}</div>
          <div class="timeline-content">
            <h5>${stage.stage}</h5>
            <div class="timeline-period">${stage.period}</div>
            <p>${stage.details}</p>
          </div>
        </div>
      `,
        )
        .join("")

      document.getElementById("timelineContainer").innerHTML = timelineHTML
    }

    // Update other tabs with API data
    updateAPIOverview(cropData)
    updateAPICultivation(cropData)
    updateAPIMarketInfo(cropData)
  }

  function updateAPIOverview(data) {
    const overview = document.getElementById("cropOverview")
    overview.innerHTML = `
      <div class="overview-grid">
        <div class="overview-item">
          <h5>Description</h5>
          <p>${data.description || "No description available"}</p>
        </div>
        <div class="overview-item">
          <h5>Duration</h5>
          <p>${data.duration || "N/A"}</p>
        </div>
        <div class="overview-item">
          <h5>Season</h5>
          <p>${data.season || "All seasons"}</p>
        </div>
        <div class="overview-item">
          <h5>Climate Requirements</h5>
          <p>${data.climate || "Varies by region"}</p>
        </div>
        <div class="overview-item">
          <h5>Soil Type</h5>
          <p>${data.soilType || "Well-drained fertile soil"}</p>
        </div>
        <div class="overview-item">
          <h5>Water Requirements</h5>
          <p>${data.waterRequirement || "Moderate to high"}</p>
        </div>
      </div>
    `
  }

  function updateAPICultivation(data) {
    const cultivation = document.getElementById("cultivationInfo")
    cultivation.innerHTML = `
      <div class="cultivation-grid">
        <div class="cultivation-item">
          <h5>Land Preparation</h5>
          <p>${data.landPreparation || "Follow standard practices for your region"}</p>
        </div>
        <div class="cultivation-item">
          <h5>Sowing Method</h5>
          <p>${data.sowingMethod || "Direct seeding or transplanting"}</p>
        </div>
        <div class="cultivation-item">
          <h5>Seed Rate</h5>
          <p>${data.seedRate || "Consult local agricultural officer"}</p>
        </div>
        <div class="cultivation-item">
          <h5>Fertilizer</h5>
          <p>${data.fertilizer || "Apply based on soil test results"}</p>
        </div>
        <div class="cultivation-item">
          <h5>Irrigation</h5>
          <p>${data.irrigation || "Regular watering as per crop needs"}</p>
        </div>
        <div class="cultivation-item">
          <h5>Harvesting</h5>
          <p>${data.harvesting || "Harvest when crop reaches maturity"}</p>
        </div>
      </div>
    `
  }

  function updateAPIMarketInfo(data) {
    const { location } = getStoredLocationData()
    const locationName = location ? location.name : "Your area"

    const marketInfo = document.getElementById("marketInfo")
    marketInfo.innerHTML = `
      <div class="market-grid">
        <div class="market-item">
          <h5>Current Price Range</h5>
          <p>${data.priceRange || "₹2000-3000 per quintal"}</p>
          <small>Prices in ${locationName}</small>
        </div>
        <div class="market-item">
          <h5>Market Demand</h5>
          <p>${data.marketDemand || "Moderate to High"}</p>
        </div>
        <div class="market-item">
          <h5>Best Selling Season</h5>
          <p>${data.bestSellingPeriod || "Post harvest season"}</p>
        </div>
        <div class="market-item">
          <h5>Storage Tips</h5>
          <p>${data.storageTips || "Store in cool, dry place"}</p>
        </div>
      </div>
    `
  }

  function openCropCalendarModal() {
    cropCalendarModal.style.display = "block"

    initializeCropCalendarEventListeners()

    // Display user's location context
    const { location, language } = getStoredLocationData()
    if (location) {
      const locationDisplay = document.getElementById("userLocationDisplay")
      if (locationDisplay) {
        locationDisplay.textContent = `📍 Showing data for: ${location.name}`
      }
    }

    // Initialize with default or previously selected crop
    updateCropCalendar()
  }

  const cropData = {
    rice: {
      name: "Rice (धान)",
      type: "Cereal",
      duration: "120-150 days",
      seasons: ["kharif", "rabi"],
      regions: ["all"],
      overview: {
        description: "Rice is the staple food crop of India, grown in diverse agro-climatic conditions.",
        varieties: ["Basmati", "Non-Basmati", "Aromatic", "Fine grain", "Medium grain", "Coarse grain"],
        soilType: "Clay loam, silty clay loam with pH 5.5-7.0",
        climate: "Tropical and subtropical with 20-35°C temperature",
        rainfall: "1000-2000mm annually",
      },
      cultivation: {
        landPrep: "Deep plowing, puddling, leveling for water retention",
        seedRate: "20-25 kg/hectare for transplanting, 60-80 kg/hectare for direct seeding",
        spacing: "20cm x 15cm for transplanting",
        fertilizer: "120:60:40 NPK kg/hectare",
        irrigation: "Continuous flooding during vegetative stage, intermittent during reproductive stage",
      },
      timeline: {
        kharif: [
          {
            stage: "Land Preparation",
            period: "May-June",
            icon: "🚜",
            details: "Deep plowing, puddling, leveling. Apply FYM 10-12 tons/hectare.",
          },
          {
            stage: "Nursery Preparation",
            period: "June",
            icon: "🌱",
            details: "Prepare nursery beds, sow seeds. Maintain 2-3cm water level.",
          },
          {
            stage: "Transplanting",
            period: "July",
            icon: "🌾",
            details: "Transplant 25-30 day old seedlings. Maintain proper spacing.",
          },
          {
            stage: "Vegetative Growth",
            period: "July-August",
            icon: "🌿",
            details: "Apply nitrogen fertilizer. Maintain water level 2-5cm.",
          },
          {
            stage: "Reproductive Phase",
            period: "September",
            icon: "🌸",
            details: "Panicle initiation. Apply potash fertilizer. Control pests.",
          },
          {
            stage: "Grain Filling",
            period: "October",
            icon: "🌾",
            details: "Intermittent irrigation. Monitor for diseases.",
          },
          {
            stage: "Maturity & Harvest",
            period: "November",
            icon: "🚛",
            details: "Harvest when 80% grains turn golden. Proper drying essential.",
          },
        ],
        rabi: [
          {
            stage: "Land Preparation",
            period: "October-November",
            icon: "🚜",
            details: "Prepare fields after kharif harvest. Level properly.",
          },
          {
            stage: "Sowing",
            period: "November-December",
            icon: "🌱",
            details: "Direct seeding or transplanting. Use short duration varieties.",
          },
          {
            stage: "Vegetative Growth",
            period: "December-January",
            icon: "🌿",
            details: "Regular irrigation. Apply nitrogen in splits.",
          },
          {
            stage: "Reproductive Phase",
            period: "February",
            icon: "🌸",
            details: "Flowering stage. Ensure adequate water supply.",
          },
          {
            stage: "Grain Filling",
            period: "March",
            icon: "🌾",
            details: "Grain development. Reduce irrigation frequency.",
          },
          {
            stage: "Harvest",
            period: "April",
            icon: "🚛",
            details: "Harvest before summer heat. Proper storage important.",
          },
        ],
      },
      diseases: [
        {
          name: "Rust (Yellow, Brown, Black)",
          symptoms: "Rust colored pustules",
          control: "Resistant varieties, fungicide spray",
        },
        { name: "Powdery Mildew", symptoms: "White powdery growth", control: "Sulfur dusting, systemic fungicides" },
        {
          name: "Loose Smut",
          symptoms: "Black powdery mass in ears",
          control: "Seed treatment with systemic fungicides",
        },
      ],
      pests: [
        { name: "Aphids", symptoms: "Yellowing, stunted growth", control: "Insecticidal soap, predatory insects" },
        { name: "Termites", symptoms: "Wilting, root damage", control: "Soil treatment, resistant varieties" },
        { name: "Army Worm", symptoms: "Defoliation", control: "Early detection, insecticide spray" },
      ],
      market: {
        msp: "₹2,275/quintal (2024-25)",
        avgPrice: "₹2,400-2,800/quintal",
        demand: "High domestic demand, government procurement",
        storage: "Moisture content below 12%, pest-free storage",
      },
    },
    tomato: {
      name: "Tomato (टमाटर)",
      type: "Vegetable",
      duration: "90-120 days",
      seasons: ["kharif", "rabi", "zaid"],
      regions: ["all"],
      overview: {
        description: "Tomato is one of the most important vegetable crops grown worldwide.",
        varieties: ["Determinate", "Indeterminate", "Cherry tomatoes", "Hybrid varieties"],
        soilType: "Well-drained sandy loam with pH 6.0-7.0",
        climate: "Warm season crop, temperature 20-25°C optimal",
        rainfall: "600-750mm annually",
      },
      cultivation: {
        landPrep: "Deep plowing, raised beds for drainage",
        seedRate: "300-400g/hectare",
        spacing: "60cm x 45cm",
        fertilizer: "120:80:50 NPK kg/hectare",
        irrigation: "Drip irrigation preferred, avoid water stress",
      },
      timeline: {
        rabi: [
          {
            stage: "Nursery Preparation",
            period: "September",
            icon: "🌱",
            details: "Prepare nursery beds, sow seeds in pro-trays.",
          },
          {
            stage: "Land Preparation",
            period: "October",
            icon: "🚜",
            details: "Prepare raised beds, install drip irrigation.",
          },
          {
            stage: "Transplanting",
            period: "October-November",
            icon: "🌿",
            details: "Transplant 4-5 week old seedlings.",
          },
          {
            stage: "Vegetative Growth",
            period: "November-December",
            icon: "🌿",
            details: "Regular irrigation, apply nitrogen fertilizer.",
          },
          {
            stage: "Flowering",
            period: "December-January",
            icon: "🌸",
            details: "Support plants with stakes. Apply phosphorus.",
          },
          {
            stage: "Fruit Development",
            period: "January-February",
            icon: "🍅",
            details: "Regular harvesting begins. Apply potash.",
          },
          {
            stage: "Peak Harvest",
            period: "February-March",
            icon: "🚛",
            details: "Daily harvesting. Proper post-harvest handling.",
          },
        ],
        kharif: [
          {
            stage: "Nursery Preparation",
            period: "May",
            icon: "🌱",
            details: "Protected nursery required during monsoon.",
          },
          {
            stage: "Land Preparation",
            period: "June",
            icon: "🚜",
            details: "Ensure proper drainage, raised bed cultivation.",
          },
          { stage: "Transplanting", period: "July", icon: "🌿", details: "Use disease-resistant varieties." },
          {
            stage: "Vegetative Growth",
            period: "July-August",
            icon: "🌿",
            details: "Disease management critical in humid conditions.",
          },
          {
            stage: "Flowering",
            period: "August-September",
            icon: "🌸",
            details: "Fungicide spray for disease prevention.",
          },
          {
            stage: "Fruit Development",
            period: "September-October",
            icon: "🍅",
            details: "Monitor for fruit rot diseases.",
          },
          { stage: "Harvest", period: "October-November", icon: "🚛", details: "Harvest before winter sets in." },
        ],
      },
      diseases: [
        {
          name: "Early Blight",
          symptoms: "Dark spots with concentric rings",
          control: "Fungicide spray, crop rotation",
        },
        { name: "Late Blight", symptoms: "Water-soaked lesions", control: "Copper fungicides, resistant varieties" },
        { name: "Bacterial Wilt", symptoms: "Sudden wilting", control: "Soil solarization, resistant varieties" },
      ],
      pests: [
        { name: "Fruit Borer", symptoms: "Holes in fruits", control: "Pheromone traps, Bt spray" },
        { name: "Whitefly", symptoms: "Yellowing, virus transmission", control: "Yellow sticky traps, insecticides" },
        { name: "Aphids", symptoms: "Curling leaves", control: "Neem oil, predatory insects" },
      ],
      market: {
        msp: "Not applicable",
        avgPrice: "₹1,500-4,000/quintal (seasonal variation)",
        demand: "High demand year-round, processing industry",
        storage: "Short shelf life, cold storage for extended storage",
      },
    },
    // Add more crops with similar detailed structure...
  }

  async function performCropSearch() {
    const searchTerm = document.getElementById("cropSearchInput").value.toLowerCase()
    const searchResults = document.getElementById("searchResults")

    if (searchTerm.length < 2) {
      searchResults.innerHTML = ""
      searchResults.style.display = "none"
      return
    }

    // Show loading state
    searchResults.innerHTML = '<div class="search-loading">🔍 Searching crops...</div>'
    searchResults.style.display = "block"

    try {
      const { location, language } = getStoredLocationData()
      const countryCode = await getCountryCodeFromLocation(location)

      const apiResponse = await fetchCropCalendarData(countryCode, searchTerm, language)

      if (apiResponse && apiResponse.length > 0) {
        displaySearchResults(apiResponse, searchTerm)
      } else {
        // Fallback to local data if API fails
        searchLocalCrops(searchTerm)
      }
    } catch (error) {
      console.error("[v0] API search failed, using local data:", error)
      searchLocalCrops(searchTerm)
    }
  }

  function initializeCropCalendarEventListeners() {
    // Search input event listener
    const cropSearchInput = document.getElementById("cropSearchInput")
    if (cropSearchInput) {
      cropSearchInput.addEventListener("input", searchCrops)
      cropSearchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          searchCrops()
        }
      })
    }

    // Dropdown change event listeners
    if (cropSelect) {
      cropSelect.addEventListener("change", function () {
        const selectedCrop = this.value
        const cropName = cropData[selectedCrop]?.name || selectedCrop

        // Sync search input with dropdown selection
        if (cropSearchInput) {
          cropSearchInput.value = cropName
        }

        // Hide search results
        const searchResults = document.getElementById("searchResults")
        if (searchResults) {
          searchResults.style.display = "none"
        }

        // Update calendar data
        updateCropCalendar()
      })
    }

    if (seasonSelect) {
      seasonSelect.addEventListener("change", updateCropCalendar)
    }

    if (regionSelect) {
      regionSelect.addEventListener("change", updateCropCalendar)
    }
  }

  function updateCropCalendar() {
    const crop = cropSelect.value
    const season = seasonSelect.value
    const region = regionSelect.value

    const data = cropData[crop]
    if (!data) {
      console.log("[v0] Crop not found in local data:", crop)
      return
    }

    const seasonName = season.charAt(0).toUpperCase() + season.slice(1)
    document.getElementById("timelineTitle").textContent = `Farming Timeline for ${data.name} - ${seasonName} Season`

    // Update timeline
    updateTimeline(data, season)

    // Update crop details tabs
    updateCropOverview(data)
    updateCultivationInfo(data)
    updateDiseasesInfo(data)
    updateMarketInfo(data)

    // Update season tips
    updateSeasonTips(crop, season, region)
  }

  function updateTimeline(data, season) {
    const container = document.getElementById("timelineContainer")
    const timeline = data.timeline[season] || data.timeline.kharif || []

    container.innerHTML = timeline
      .map(
        (stage) => `
      <div class="timeline-item">
        <div class="timeline-icon">${stage.icon}</div>
        <div class="timeline-content">
          <h5>${stage.stage}</h5>
          <div class="timeline-period">${stage.period}</div>
          <p>${stage.details}</p>
        </div>
      </div>
    `,
      )
      .join("")
  }

  function updateCropOverview(data) {
    const overview = document.getElementById("cropOverview")
    overview.innerHTML = `
      <div class="overview-grid">
        <div class="overview-item">
          <h5>Description</h5>
          <p>${data.overview.description}</p>
        </div>
        <div class="overview-item">
          <h5>Duration</h5>
          <p>${data.duration}</p>
        </div>
        <div class="overview-item">
          <h5>Soil Type</h5>
          <p>${data.overview.soilType}</p>
        </div>
        <div class="overview-item">
          <h5>Climate</h5>
          <p>${data.overview.climate}</p>
        </div>
        <div class="overview-item">
          <h5>Rainfall</h5>
          <p>${data.overview.rainfall}</p>
        </div>
        <div class="overview-item">
          <h5>Varieties</h5>
          <ul>${data.overview.varieties.map((v) => `<li>${v}</li>`).join("")}</ul>
        </div>
      </div>
    `
  }

  function updateCultivationInfo(data) {
    const cultivation = document.getElementById("cultivationInfo")
    cultivation.innerHTML = `
      <div class="cultivation-grid">
        <div class="cultivation-item">
          <h5>Land Preparation</h5>
          <p>${data.cultivation.landPrep}</p>
        </div>
        <div class="cultivation-item">
          <h5>Seed Rate</h5>
          <p>${data.cultivation.seedRate}</p>
        </div>
        <div class="cultivation-item">
          <h5>Spacing</h5>
          <p>${data.cultivation.spacing}</p>
        </div>
        <div class="cultivation-item">
          <h5>Fertilizer</h5>
          <p>${data.cultivation.fertilizer}</p>
        </div>
        <div class="cultivation-item">
          <h5>Irrigation</h5>
          <p>${data.cultivation.irrigation}</p>
        </div>
      </div>
    `
  }

  function updateDiseasesInfo(data) {
    const diseases = document.getElementById("diseasesInfo")
    diseases.innerHTML = `
      <div class="diseases-section">
        <h5>Common Diseases</h5>
        <div class="diseases-list">
          ${data.diseases
            .map(
              (disease) => `
            <div class="disease-item">
              <h6>${disease.name}</h6>
              <p><strong>Symptoms:</strong> ${disease.symptoms}</p>
              <p><strong>Control:</strong> ${disease.control}</p>
            </div>
          `,
            )
            .join("")}
        </div>
        
        <h5>Common Pests</h5>
        <div class="pests-list">
          ${data.pests
            .map(
              (pest) => `
            <div class="pest-item">
              <h6>${pest.name}</h6>
              <p><strong>Symptoms:</strong> ${pest.symptoms}</p>
              <p><strong>Control:</strong> ${pest.control}</p>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    `
  }

  function updateMarketInfo(data) {
    const market = document.getElementById("marketInfo")
    market.innerHTML = `
      <div class="market-grid">
        <div class="market-item">
          <h5>MSP (Minimum Support Price)</h5>
          <p>${data.market.msp}</p>
        </div>
        <div class="market-item">
          <h5>Average Market Price</h5>
          <p>${data.market.avgPrice}</p>
        </div>
        <div class="market-item">
          <h5>Market Demand</h5>
          <p>${data.market.demand}</p>
        </div>
        <div class="market-item">
          <h5>Storage Requirements</h5>
          <p>${data.market.storage}</p>
        </div>
      </div>
    `
  }

  function updateSeasonTips(crop, season, region) {
    // Enhanced tips based on crop, season, and region
    const tips = {
      rice: {
        kharif: {
          north: [
            "• Transplant during July for optimal growth",
            "• Maintain 2-5cm water level",
            "• Watch for blast disease in humid conditions",
          ],
          south: [
            "• Early variety planting in June",
            "• Manage water efficiently during monsoon",
            "• Control brown plant hopper",
          ],
        },
      },
      // Add more comprehensive tips...
    }

    const currentTips = tips[crop]?.[season]?.[region] ||
      tips[crop]?.[season]?.north || [
        "• Follow recommended practices for your region",
        "• Consult local agricultural extension officer",
        "• Monitor weather conditions regularly",
      ]

    document.getElementById("seasonTips").innerHTML = currentTips.map((tip) => `<p>${tip}</p>`).join("")
  }

  // Market Updates Modal Functions
  function openMarketModal() {
    marketModal.style.display = "block"
    updateMarketPrices()
  }

  function closeMarketModal() {
    marketModal.style.display = "none"
  }

  function updateMarketPrices() {
    // Simulate price updates based on location
    const location = marketLocation.value
    console.log(`[v0] Updating market prices for ${location}`)

    // Add some visual feedback
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...'

    setTimeout(() => {
      refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh'
      // Prices would be updated here in a real application
    }, 1000)
  }

  function refreshMarketData() {
    updateMarketPrices()
  }

  // Community Forum Modal Functions
  function openCommunityModal() {
    communityModal.style.display = "block"
  }

  function closeCommunityModal() {
    communityModal.style.display = "none"
    // Hide new post form if open
    newPostForm.style.display = "none"
  }

  function showNewPostForm() {
    newPostForm.style.display = "block"
    postTitle.focus()
  }

  function cancelPost() {
    newPostForm.style.display = "none"
    // Clear form
    postTitle.value = ""
    postContent.value = ""
  }

  function submitPost() {
    const title = postTitle.value.trim()
    const content = postContent.value.trim()
    const category = postCategory.value

    if (!title || !content) {
      alert("Please fill in both title and content")
      return
    }

    // Create new post element
    const newPost = document.createElement("div")
    newPost.className = "forum-post"
    newPost.setAttribute("data-category", category)

    newPost.innerHTML = `
      <div class="post-header">
        <div class="user-info">
          <img src="/placeholder.svg?height=40&width=40" alt="User" class="user-avatar">
          <div>
            <div class="username">Ramu (You)</div>
            <div class="post-time">Just now</div>
          </div>
        </div>
        <span class="post-category ${category}">${category.charAt(0).toUpperCase() + category.slice(1)}</span>
      </div>
      <div class="post-content">
        <h4>${title}</h4>
        <p>${content}</p>
      </div>
      <div class="post-actions">
        <button class="action-btn"><i class="fas fa-thumbs-up"></i> 0</button>
        <button class="action-btn"><i class="fas fa-comment"></i> 0 replies</button>
        <button class="action-btn"><i class="fas fa-share"></i> Share</button>
      </div>
    `

    // Add to top of posts
    forumPosts.insertBefore(newPost, forumPosts.firstChild)

    // Clear and hide form
    cancelPost()

    alert("Post created successfully!")
  }

  function filterPosts(category) {
    const posts = document.querySelectorAll(".forum-post")
    const buttons = document.querySelectorAll(".category-btn")

    // Update active button
    buttons.forEach((btn) => btn.classList.remove("active"))
    event.target.classList.add("active")

    // Filter posts
    posts.forEach((post) => {
      if (category === "all" || post.getAttribute("data-category") === category) {
        post.style.display = "block"
      } else {
        post.style.display = "none"
      }
    })
  }

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

  function openLearningHub() {
    const learningHubHTML = `
    <div id="learningHubModal" class="modal">
      <div class="modal-content learning-hub-content">
        <div class="learning-header">
          <h2>🌱 Learning Hub - Master Modern Farming</h2>
          <button class="close" onclick="closeLearningHub()">&times;</button>
        </div>
        <div style="padding: 2rem;">
          <div class="learning-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div class="stat-card" style="background: linear-gradient(135deg, #4caf50, #66bb6a); color: white; padding: 1.5rem; border-radius: 12px; text-align: center;">
              <h4 style="margin: 0 0 0.5rem 0; font-size: 0.9rem; opacity: 0.9;">Courses Available</h4>
              <span style="font-size: 1.8rem; font-weight: bold; display: block;">25+</span>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #2196f3, #64b5f6); color: white; padding: 1.5rem; border-radius: 12px; text-align: center;">
              <h4 style="margin: 0 0 0.5rem 0; font-size: 0.9rem; opacity: 0.9;">Your Progress</h4>
              <span style="font-size: 1.8rem; font-weight: bold; display: block;">65%</span>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #ff9800, #ffb74d); color: white; padding: 1.5rem; border-radius: 12px; text-align: center;">
              <h4 style="margin: 0 0 0.5rem 0; font-size: 0.9rem; opacity: 0.9;">Certificates Earned</h4>
              <span style="font-size: 1.8rem; font-weight: bold; display: block;">3</span>
            </div>
          </div>
          
          <div class="learning-topics">
            <div class="topic-card" onclick="openTopic('soil-management')" style="background: linear-gradient(135deg, #e8f5e9, #f1f8e9); border: 2px solid #4caf50; position: relative; overflow: hidden;">
              <div style="position: absolute; top: 10px; right: 10px; background: #4caf50; color: white; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem;">85% Complete</div>
              <h3 style="color: #2e7d32; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                🌱 Soil Management <span style="background: #4caf50; color: white; padding: 0.2rem 0.5rem; border-radius: 8px; font-size: 0.7rem;">POPULAR</span>
              </h3>
              <p style="color: #666; margin-bottom: 1rem;">Master soil health, pH testing, nutrient management, and organic matter enhancement</p>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #4caf50; font-weight: 600; font-size: 0.9rem;">⏱️ 2.5 hours</span>
                <button style="background: #4caf50; color: white; border: none; padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer; font-weight: 600;">Continue</button>
              </div>
            </div>
            
            <div class="topic-card" onclick="openTopic('crop-rotation')" style="background: linear-gradient(135deg, #fff3e0, #fce4ec); border: 2px solid #ff9800;">
              <div style="position: absolute; top: 10px; right: 10px; background: #ff9800; color: white; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem;">NEW</div>
              <h3 style="color: #e65100; margin-bottom: 0.5rem;">🔄 Advanced Crop Rotation</h3>
              <p style="color: #666; margin-bottom: 1rem;">Learn 4-season rotation patterns, companion planting, and yield optimization strategies</p>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #ff9800; font-weight: 600; font-size: 0.9rem;">⏱️ 3 hours</span>
                <button style="background: #ff9800; color: white; border: none; padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer; font-weight: 600;">Start Now</button>
              </div>
            </div>
            
            <div class="topic-card" onclick="openTopic('pest-control')" style="background: linear-gradient(135deg, #f3e5f5, #e8f5e9); border: 2px solid #9c27b0;">
              <h3 style="color: #7b1fa2; margin-bottom: 0.5rem;">🐛 Integrated Pest Management</h3>
              <p style="color: #666; margin-bottom: 1rem;">Natural pest control, beneficial insects, and eco-friendly treatment methods</p>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #9c27b0; font-weight: 600; font-size: 0.9rem;">⏱️ 2 hours</span>
                <button style="background: #9c27b0; color: white; border: none; padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer; font-weight: 600;">Start</button>
              </div>
            </div>
            
            <div class="topic-card" onclick="openTopic('irrigation')" style="background: linear-gradient(135deg, #e3f2fd, #e8f5e9); border: 2px solid #2196f3;">
              <h3 style="color: #1976d2; margin-bottom: 0.5rem;">💧 Smart Irrigation Systems</h3>
              <p style="color: #666; margin-bottom: 1rem;">Drip irrigation, sensor-based watering, and water conservation techniques</p>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #2196f3; font-weight: 600; font-size: 0.9rem;">⏱️ 1.5 hours</span>
                <button style="background: #2196f3; color: white; border: none; padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer; font-weight: 600;">Start</button>
              </div>
            </div>
            
            <div class="topic-card" onclick="openTopic('organic-farming')" style="background: linear-gradient(135deg, #e8f5e9, #f1f8e9); border: 2px solid #4caf50;">
              <div style="position: absolute; top: 10px; right: 10px; background: #4caf50; color: white; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem;">TRENDING</div>
              <h3 style="color: #2e7d32; margin-bottom: 0.5rem;">🌿 Organic Certification Course</h3>
              <p style="color: #666; margin-bottom: 1rem;">Complete guide to organic farming practices and certification process</p>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #4caf50; font-weight: 600; font-size: 0.9rem;">⏱️ 4 hours</span>
                <button style="background: #4caf50; color: white; border: none; padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer; font-weight: 600;">Enroll</button>
              </div>
            </div>
            
            <div class="topic-card" onclick="openTopic('harvest-storage')" style="background: linear-gradient(135deg, #fff8e1, #f3e5f5); border: 2px solid #ffc107;">
              <h3 style="color: #f57c00; margin-bottom: 0.5rem;">📦 Post-Harvest Management</h3>
              <p style="color: #666; margin-bottom: 1rem;">Proper harvesting, storage techniques, and value addition methods</p>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #ffc107; font-weight: 600; font-size: 0.9rem;">⏱️ 2.5 hours</span>
                <button style="background: #ffc107; color: white; border: none; padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer; font-weight: 600;">Start</button>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #e8f5e9, #f1f8e9); border-radius: 12px;">
            <h4 style="color: #2e7d32; margin-bottom: 1rem;">🎓 Complete courses to earn certificates and unlock premium features!</h4>
            <button onclick="openTopic('all-courses')" style="background: linear-gradient(135deg, #4caf50, #66bb6a); color: white; border: none; padding: 1rem 2rem; border-radius: 25px; cursor: pointer; font-weight: 600; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);">View All Courses</button>
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
        <div class="rewards-header">
          <h2>🎁 Rewards & Coins - Earn Real Money!</h2>
          <button class="close" onclick="closeRewardsPopup()">&times;</button>
        </div>
        <div class="rewards-info">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div class="stat-card" style="background: linear-gradient(135deg, #ff9800, #ffb74d); color: white; padding: 1.5rem; border-radius: 12px; text-align: center;">
              <h4 style="margin: 0 0 0.5rem 0; font-size: 0.9rem; opacity: 0.9;">Your Earnings</h4>
              <span style="font-size: 1.8rem; font-weight: bold; display: block;">₹1,250</span>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #4caf50, #66bb6a); color: white; padding: 1.5rem; border-radius: 12px; text-align: center;">
              <h4 style="margin: 0 0 0.5rem 0; font-size: 0.9rem; opacity: 0.9;">Referrals Made</h4>
              <span style="font-size: 1.8rem; font-weight: bold; display: block;">8</span>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #2196f3, #64b5f6); color: white; padding: 1.5rem; border-radius: 12px; text-align: center;">
              <h4 style="margin: 0 0 0.5rem 0; font-size: 0.9rem; opacity: 0.9;">Coins Balance</h4>
              <span style="font-size: 1.8rem; font-weight: bold; display: block;">2,450</span>
            </div>
          </div>
          
          <div style="background: linear-gradient(135deg, #e8f5e9, #f1f8e9); padding: 2rem; border-radius: 15px; margin-bottom: 2rem;">
            <h3 style="color: #2e7d32; margin-bottom: 1rem; text-align: center;">💰 Multiple Ways to Earn!</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
              <div style="background: white; padding: 1.5rem; border-radius: 10px; border-left: 4px solid #4caf50;">
                <h4 style="color: #2e7d32; margin-bottom: 0.5rem;">🤝 Refer Friends</h4>
                <p style="color: #666; margin: 0; font-size: 0.9rem;">₹50 per successful referral + ₹100 bonus at 5 referrals</p>
              </div>
              <div style="background: white; padding: 1.5rem; border-radius: 10px; border-left: 4px solid #ff9800;">
                <h4 style="color: #f57c00; margin-bottom: 0.5rem;">📚 Complete Courses</h4>
                <p style="color: #666; margin: 0; font-size: 0.9rem;">Earn 100-500 coins per completed learning module</p>
              </div>
              <div style="background: white; padding: 1.5rem; border-radius: 10px; border-left: 4px solid #2196f3;">
                <h4 style="color: #1976d2; margin-bottom: 0.5rem;">💬 Community Activity</h4>
                <p style="color: #666; margin: 0; font-size: 0.9rem;">Get 10 coins for helpful forum posts and answers</p>
              </div>
              <div style="background: white; padding: 1.5rem; border-radius: 10px; border-left: 4px solid #9c27b0;">
                <h4 style="color: #7b1fa2; margin-bottom: 0.5rem;">📱 Daily Check-in</h4>
                <p style="color: #666; margin: 0; font-size: 0.9rem;">25 coins daily + streak bonuses up to 100 coins</p>
              </div>
            </div>
          </div>
          
          <div class="referral-code" style="background: linear-gradient(135deg, #f8f9fa, #e8f5e9); border: 2px solid #4caf50; border-radius: 15px; padding: 2rem; text-align: center; margin-bottom: 2rem;">
            <h4 style="color: #2e7d32; margin-bottom: 1rem;">🔗 Your Personal Referral Code</h4>
            <div style="background: #4caf50; color: white; padding: 1rem; border-radius: 10px; margin-bottom: 1rem; display: inline-block;">
              <span class="code" style="font-family: monospace; font-size: 1.3rem; font-weight: bold; letter-spacing: 2px;">FARM${Math.floor(Math.random() * 10000)}</span>
            </div>
            <p style="color: #666; margin-bottom: 1.5rem;">Share this code with friends and family to start earning!</p>
            
            <div class="share-buttons" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              <button onclick="shareReferral('whatsapp')" class="share-btn whatsapp" style="background: #25d366; color: white; border: none; padding: 1rem 1.5rem; border-radius: 10px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; transition: all 0.3s ease;">
                <i class="fab fa-whatsapp"></i> Share on WhatsApp
              </button>
              <button onclick="shareReferral('copy')" class="share-btn copy" style="background: #2196f3; color: white; border: none; padding: 1rem 1.5rem; border-radius: 10px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; transition: all 0.3s ease;">
                <i class="fas fa-copy"></i> Copy Link
              </button>
              <button onclick="shareReferral('sms')" class="share-btn sms" style="background: #ff9800; color: white; border: none; padding: 1rem 1.5rem; border-radius: 10px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; transition: all 0.3s ease;">
                <i class="fas fa-sms"></i> Send SMS
              </button>
            </div>
          </div>
          
          <div style="background: linear-gradient(135deg, #fff3e0, #fce4ec); padding: 2rem; border-radius: 15px; text-align: center;">
            <h4 style="color: #e65100; margin-bottom: 1rem;">🏆 Unlock Premium Benefits</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
              <div style="background: white; padding: 1rem; border-radius: 8px;">
                <h5 style="color: #ff9800; margin-bottom: 0.5rem;">10 Referrals</h5>
                <p style="color: #666; margin: 0; font-size: 0.9rem;">Premium weather alerts</p>
              </div>
              <div style="background: white; padding: 1rem; border-radius: 8px;">
                <h5 style="color: #ff9800; margin-bottom: 0.5rem;">25 Referrals</h5>
                <p style="color: #666; margin: 0; font-size: 0.9rem;">Advanced market analytics</p>
              </div>
              <div style="background: white; padding: 1rem; border-radius: 8px;">
                <h5 style="color: #ff9800; margin-bottom: 0.5rem;">50 Referrals</h5>
                <p style="color: #666; margin: 0; font-size: 0.9rem;">Personal farming consultant</p>
              </div>
            </div>
            <button onclick="openTopic('premium-benefits')" style="background: linear-gradient(135deg, #ff9800, #ffb74d); color: white; border: none; padding: 1rem 2rem; border-radius: 25px; cursor: pointer; font-weight: 600; font-size: 1.1rem; box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);">View All Benefits</button>
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

  function closeCropCalendarModal() {
    const modal = document.getElementById("cropCalendarModal")
    if (modal) {
      modal.style.display = "none"
    }
  }

  function openTopic(topicId) {
    const topics = {
      "soil-management": {
        title: "Soil Management",
        content: "Learn about soil testing, pH levels, nutrient management, and organic matter improvement techniques.",
        modules: ["Soil Testing Basics", "pH Management", "Nutrient Cycling", "Organic Matter"],
      },
      "pest-control": {
        title: "Pest Control",
        content: "Integrated pest management strategies, biological controls, and sustainable pest prevention methods.",
        modules: ["IPM Principles", "Beneficial Insects", "Natural Pesticides", "Prevention Strategies"],
      },
      irrigation: {
        title: "Irrigation Systems",
        content: "Water management, irrigation scheduling, and efficient water use techniques for optimal crop growth.",
        modules: ["Drip Irrigation", "Water Scheduling", "Soil Moisture", "Water Conservation"],
      },
    }

    const topic = topics[topicId]
    if (topic) {
      alert(`${topic.title}\n\n${topic.content}\n\nModules: ${topic.modules.join(", ")}`)
    }
  }

  function shareReferral(platform) {
    const referralCode = "FARM2024"
    const message = `Join me on FarmAssist and get rewards! Use my referral code: ${referralCode}`

    if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank")
    } else if (platform === "copy") {
      navigator.clipboard.writeText(message).then(() => {
        alert("Referral message copied to clipboard!")
      })
    }
  }

  function showMarketTab(tabName) {
    const tabs = document.querySelectorAll(".market-tab")
    const contents = document.querySelectorAll(".market-tab-content")

    tabs.forEach((tab) => tab.classList.remove("active"))
    contents.forEach((content) => content.classList.remove("active"))

    const activeTab = document.querySelector(`[onclick="showMarketTab('${tabName}')"]`)
    const activeContent = document.getElementById(`${tabName}Tab`)

    if (activeTab) activeTab.classList.add("active")
    if (activeContent) activeContent.classList.add("active")
  }

  function setAlert(crop, price) {
    const alerts = JSON.parse(localStorage.getItem("priceAlerts") || "[]")
    alerts.push({ crop, price, timestamp: Date.now() })
    localStorage.setItem("priceAlerts", JSON.stringify(alerts))
    alert(`Price alert set for ${crop} at ₹${price}/kg`)
  }

  function removeAlert(index) {
    const alerts = JSON.parse(localStorage.getItem("priceAlerts") || "[]")
    alerts.splice(index, 1)
    localStorage.setItem("priceAlerts", JSON.stringify(alerts))
    alert("Price alert removed")
  }

  function filterMarketData(category) {
    const rows = document.querySelectorAll("#marketTable tbody tr")
    rows.forEach((row) => {
      if (category === "all" || row.dataset.category === category) {
        row.style.display = ""
      } else {
        row.style.display = "none"
      }
    })
  }

  function searchMarketData() {
    const searchTerm = document.getElementById("marketSearch").value.toLowerCase()
    const rows = document.querySelectorAll("#marketTable tbody tr")

    rows.forEach((row) => {
      const cropName = row.cells[0].textContent.toLowerCase()
      if (cropName.includes(searchTerm)) {
        row.style.display = ""
      } else {
        row.style.display = "none"
      }
    })
  }

  function exportMarketData() {
    const data = [
      ["Crop", "Current Price", "Change", "Market"],
      ["Wheat", "₹2,150/quintal", "+2.5%", "Mandi"],
      ["Rice", "₹3,200/quintal", "-1.2%", "Wholesale"],
      ["Corn", "₹1,850/quintal", "+0.8%", "Local"],
      ["Sugarcane", "₹350/quintal", "+1.5%", "Mill"],
    ]

    const csvContent = data.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "market_data.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  let currentPage = 1
  const itemsPerPage = 10

  function nextPage() {
    currentPage++
    updatePagination()
  }

  function previousPage() {
    if (currentPage > 1) {
      currentPage--
      updatePagination()
    }
  }

  function updatePagination() {
    document.getElementById("currentPage").textContent = currentPage
    document.getElementById("prevBtn").disabled = currentPage === 1
  }

  function searchPosts() {
    const searchTerm = document.getElementById("forumSearch").value.toLowerCase()
    const posts = document.querySelectorAll(".forum-post")

    posts.forEach((post) => {
      const title = post.querySelector("h4").textContent.toLowerCase()
      const content = post.querySelector("p").textContent.toLowerCase()

      if (title.includes(searchTerm) || content.includes(searchTerm)) {
        post.style.display = ""
      } else {
        post.style.display = "none"
      }
    })
  }

  function loadMorePosts() {
    const postsContainer = document.getElementById("forumPosts")
    const newPosts = [
      {
        title: "Organic Fertilizer Tips",
        author: "GreenFarmer",
        time: "3 hours ago",
        content: "Share your best organic fertilizer recipes and application methods.",
        replies: 8,
        likes: 15,
      },
      {
        title: "Seasonal Crop Planning",
        author: "CropExpert",
        time: "5 hours ago",
        content: "How do you plan your crop rotation for maximum yield?",
        replies: 12,
        likes: 23,
      },
    ]

    newPosts.forEach((post) => {
      const postElement = document.createElement("div")
      postElement.className = "forum-post"
      postElement.innerHTML = `
            <h4>${post.title}</h4>
            <p>${post.content}</p>
            <div class="post-meta">
                <span>By ${post.author} • ${post.time}</span>
                <div class="post-actions">
                    <span>👍 ${post.likes}</span>
                    <span>💬 ${post.replies}</span>
                </div>
            </div>
        `
      postsContainer.appendChild(postElement)
    })
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

  // Tab functionality for crop details
  function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll(".tab-content").forEach((tab) => {
      tab.classList.remove("active")
    })

    // Remove active class from all tab buttons
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active")
    })

    // Show selected tab content
    document.getElementById(tabName + "Tab").classList.add("active")

    // Add active class to clicked button
    event.target.classList.add("active")
  }

  function testAllModals() {
    console.log("[v0] Testing all modal functionality...")

    // Test basic modal functions
    const modalTests = [
      { name: "Chat Modal", open: "openChatModal", close: "closeChatModal", param: "text" },
      { name: "Image Modal", open: "openImageModal", close: "closeImageModal" },
      { name: "Weather Modal", open: "openWeatherModal", close: "closeWeatherModal" },
      { name: "Voice Modal", open: "openVoiceModal", close: "closeVoiceModal" },
      { name: "Crop Calendar Modal", open: "openCropCalendarModal", close: "closeCropCalendarModal" },
      { name: "Market Modal", open: "openMarketModal", close: "closeMarketModal" },
      { name: "Community Modal", open: "openCommunityModal", close: "closeCommunityModal" },
      { name: "Learning Hub", open: "openLearningHub", close: "closeLearningHub" },
      { name: "Rewards Popup", open: "openRewardsPopup", close: "closeRewardsPopup" },
    ]

    modalTests.forEach((test) => {
      try {
        console.log(`[v0] Testing ${test.name}...`)

        // Test open function
        if (typeof window[test.open] === "function") {
          console.log(`[v0] ✓ ${test.open} function exists`)
          if (test.param) {
            window[test.open](test.param)
          } else {
            window[test.open]()
          }
          console.log(`[v0] ✓ ${test.open} executed successfully`)
        } else {
          console.error(`[v0] ✗ ${test.open} function missing`)
        }

        // Test close function
        setTimeout(() => {
          if (typeof window[test.close] === "function") {
            console.log(`[v0] ✓ ${test.close} function exists`)
            window[test.close]()
            console.log(`[v0] ✓ ${test.close} executed successfully`)
          } else {
            console.error(`[v0] ✗ ${test.close} function missing`)
          }
        }, 100)
      } catch (error) {
        console.error(`[v0] ✗ Error testing ${test.name}:`, error)
      }
    })

    // Test interactive functions
    setTimeout(() => {
      console.log("[v0] Testing interactive functions...")

      const interactiveFunctions = [
        "showMarketTab",
        "filterMarketData",
        "searchMarketData",
        "exportMarketData",
        "setAlert",
        "removeAlert",
        "nextPage",
        "previousPage",
        "searchPosts",
        "loadMorePosts",
        "openTopic",
        "shareReferral",
      ]

      interactiveFunctions.forEach((funcName) => {
        if (typeof window[funcName] === "function") {
          console.log(`[v0] ✓ ${funcName} function exists and is accessible`)
        } else {
          console.error(`[v0] ✗ ${funcName} function missing or not accessible`)
        }
      })

      console.log("[v0] Modal functionality testing completed!")
    }, 2000)
  }

  function testOnClickHandlers() {
    console.log("[v0] Testing onclick handlers...")

    const buttonTests = [
      { selector: '[onclick="openCropCalendarModal()"]', name: "Crop Calendar" },
      { selector: '[onclick="openWeatherModal()"]', name: "Weather Alerts" },
      { selector: '[onclick="openMarketModal()"]', name: "Market Updates" },
      { selector: '[onclick="openCommunityModal()"]', name: "Community Forum" },
      { selector: '[onclick="openLearningHub()"]', name: "Learning Hub" },
      { selector: '[onclick="openRewardsPopup()"]', name: "Rewards & Coins" },
    ]

    buttonTests.forEach((test) => {
      const element = document.querySelector(test.selector)
      if (element) {
        console.log(`[v0] ✓ ${test.name} button found with onclick handler`)

        // Test if onclick attribute exists and is valid
        const onclickAttr = element.getAttribute("onclick")
        if (onclickAttr) {
          console.log(`[v0] ✓ ${test.name} onclick attribute: ${onclickAttr}`)
        } else {
          console.error(`[v0] ✗ ${test.name} missing onclick attribute`)
        }
      } else {
        console.error(`[v0] ✗ ${test.name} button not found`)
      }
    })
  }

  function verifyModalStates() {
    console.log("[v0] Verifying modal states...")

    const modalIds = [
      "chatModal",
      "imageModal",
      "weatherModal",
      "voiceModal",
      "cropCalendarModal",
      "marketModal",
      "communityModal",
    ]

    modalIds.forEach((modalId) => {
      const modal = document.getElementById(modalId)
      if (modal) {
        console.log(`[v0] ✓ ${modalId} element exists`)

        // Check if modal has proper close button
        const closeBtn = modal.querySelector(".close")
        if (closeBtn) {
          console.log(`[v0] ✓ ${modalId} has close button`)
          const onclickAttr = closeBtn.getAttribute("onclick")
          if (onclickAttr) {
            console.log(`[v0] ✓ ${modalId} close button has onclick: ${onclickAttr}`)
          }
        } else {
          console.error(`[v0] ✗ ${modalId} missing close button`)
        }
      } else {
        console.error(`[v0] ✗ ${modalId} element not found`)
      }
    })
  }

  setTimeout(() => {
    console.log("[v0] Starting comprehensive modal testing...")
    testOnClickHandlers()
    verifyModalStates()
    testAllModals()
  }, 1000)

  // Make functions globally available
  window.openChatModal = openChatModal
  window.closeChatModal = closeChatModal
  window.openImageModal = openImageModal
  window.closeImageModal = closeImageModal
  window.openCamera = openCamera
  window.closeCameraSection = closeCameraSection
  window.captureImage = captureImage
  window.openFileUpload = openFileUpload
  window.handleFileUpload = handleFileUpload
  window.processImageText = processImageText
  window.resetImageUpload = resetImageUpload
  window.sendMessage = sendMessage
  window.toggleHistoryList = toggleHistoryList
  window.openWeatherModal = openWeatherModal
  window.closeWeatherModal = closeWeatherModal
  window.searchLocation = searchLocation
  window.getCurrentLocation = getCurrentLocation
  window.askExample = askExample
  window.toggleMoreExamples = toggleMoreExamples
  window.openVoiceModal = openVoiceModal
  window.closeVoiceModal = closeVoiceModal
  window.toggleRecording = toggleRecording
  window.openCropCalendarModal = openCropCalendarModal
  window.closeCropCalendarModal = closeCropCalendarModal
  window.updateCropCalendar = updateCropCalendar
  window.openMarketModal = openMarketModal
  window.closeMarketModal = closeMarketModal
  window.updateMarketPrices = updateMarketPrices
  window.refreshMarketData = refreshMarketData
  window.openCommunityModal = openCommunityModal
  window.closeCommunityModal = closeCommunityModal
  window.showNewPostForm = showNewPostForm
  window.cancelPost = cancelPost
  window.submitPost = submitPost
  window.filterPosts = filterPosts
  window.showTab = showTab
  window.performCropSearch = performCropSearch
  window.openLearningHub = openLearningHub
  window.closeLearningHub = closeLearningHub
  window.openRewardsPopup = openRewardsPopup
  window.closeRewardsPopup = closeRewardsPopup
  window.openTopic = openTopic
  window.shareReferral = shareReferral
  window.showMarketTab = showMarketTab
  window.setAlert = setAlert
  window.removeAlert = removeAlert
  window.filterMarketData = filterMarketData
  window.searchMarketData = searchMarketData
  window.exportMarketData = exportMarketData
  window.nextPage = nextPage
  window.previousPage = previousPage
  window.searchPosts = searchPosts
  window.loadMorePosts = loadMorePosts

  window.testAllModals = testAllModals
  window.testOnClickHandlers = testOnClickHandlers
  window.verifyModalStates = verifyModalStates
})
