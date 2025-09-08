class FarmAssist {
  constructor() {
    this.selectedLanguage = document.getElementById("language").value || null // Read initial language value from dropdown instead of starting with null
    this.selectedLocation = null
    this.locationMethod = null
    this.debounceTimer = null

    this.init()
  }

  init() {
    this.bindEvents()
    this.updateGetStartedButton() // Check initial state
  }

  bindEvents() {
    // Language selection
    document.getElementById("language").addEventListener("change", (e) => {
      this.selectedLanguage = e.target.value
      this.updateGetStartedButton() // Update button state when language changes
    })

    // Location method buttons
    document.getElementById("searchBtn").addEventListener("click", () => {
      this.setLocationMethod("search")
    })

    document.getElementById("liveBtn").addEventListener("click", () => {
      this.setLocationMethod("live")
    })

    // Search input
    document.getElementById("locationSearch").addEventListener("input", (e) => {
      this.handleSearchInput(e.target.value)
    })

    // Get location button
    document.getElementById("getLocationBtn").addEventListener("click", () => {
      this.getCurrentLocation()
    })

    // Get started button
    document.getElementById("getStartedBtn").addEventListener("click", (event) => {
      this.handleGetStartedClick(event)
    })
  }

  setLocationMethod(method) {
    this.locationMethod = method

    // Update button states
    document.getElementById("searchBtn").classList.toggle("active", method === "search")
    document.getElementById("liveBtn").classList.toggle("active", method === "live")

    // Show/hide sections
    document.getElementById("searchSection").classList.toggle("hidden", method !== "search")
    document.getElementById("liveSection").classList.toggle("hidden", method !== "live")

    // Clear previous selection when switching methods
    this.clearSelectedLocation()
  }

  handleSearchInput(query) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    if (query.length < 3) {
      this.hideSuggestions()
      return
    }

    this.debounceTimer = setTimeout(() => {
      this.searchLocations(query)
    }, 300)
  }

  async searchLocations(query) {
    const loader = document.getElementById("searchLoader")
    const suggestions = document.getElementById("suggestions")

    loader.classList.remove("hidden")

    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=7eba5dd3b8dc4e28bf0d65986e96d262`,
      )
      const data = await response.json()

      if (data.features && data.features.length > 0) {
        this.showSuggestions(data.features)
      } else {
        this.hideSuggestions()
      }
    } catch (error) {
      console.error("Error searching locations:", error)
      this.hideSuggestions()
    } finally {
      loader.classList.add("hidden")
    }
  }

  showSuggestions(features) {
    const suggestions = document.getElementById("suggestions")
    suggestions.innerHTML = ""

    features.forEach((feature) => {
      const item = document.createElement("div")
      item.className = "suggestion-item"
      item.innerHTML = `
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>${feature.properties.formatted}</span>
            `

      item.addEventListener("click", () => {
        this.selectLocation({
          name: feature.properties.formatted,
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0],
        })
        document.getElementById("locationSearch").value = feature.properties.formatted
        this.hideSuggestions()
      })

      suggestions.appendChild(item)
    })

    suggestions.classList.remove("hidden")
  }

  hideSuggestions() {
    document.getElementById("suggestions").classList.add("hidden")
  }

  async getCurrentLocation() {
    const statusDiv = document.getElementById("locationStatus")

    if (!navigator.geolocation) {
      this.showLocationError("Geolocation is not supported by this browser.")
      return
    }

    // Show loading state
    statusDiv.innerHTML = `
            <div class="location-status loading">
                <svg class="spinner icon" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="4" opacity="0.25"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75"></path>
                </svg>
                Getting your location...
            </div>
        `

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        try {
          // Get address from coordinates using Geoapify reverse geocoding
          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=7eba5dd3b8dc4e28bf0d65986e96d262`,
          )
          const data = await response.json()

          if (data.features && data.features.length > 0) {
            const address = data.features[0].properties.formatted

            this.selectLocation({
              name: address,
              lat: lat,
              lng: lng,
            })

            // Show success state
            statusDiv.innerHTML = `
                            <div class="location-status success">
                                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <strong>📍 Your Location:</strong> ${address}
                            </div>
                        `
          } else {
            this.showLocationError("Unable to get location name from coordinates.")
          }
        } catch (error) {
          console.error("Error getting address:", error)
          this.showLocationError("Failed to get location name. Please try again.")
        }
      },
      (error) => {
        let errorMessage = "Unable to access live location."

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out."
            break
        }

        this.showLocationError(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }

  showLocationError(message) {
    const statusDiv = document.getElementById("locationStatus")
    statusDiv.innerHTML = `
            <div class="location-status error">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                ${message}
                <button class="btn btn-outline" style="margin-left: auto; padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="farmAssist.getCurrentLocation()">
                    <svg class="icon" style="width: 0.75rem; height: 0.75rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="1 4 1 10 7 10"></polyline>
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                    </svg>
                    Retry
                </button>
            </div>
        `
  }

  selectLocation(location) {
    this.selectedLocation = location

    // Show selected location
    const selectedDiv = document.getElementById("selectedLocation")
    const locationName = document.getElementById("locationName")

    locationName.textContent = location.name
    selectedDiv.classList.remove("hidden")

    this.updateGetStartedButton()

    console.log("Location selected:", location)
  }

  clearSelectedLocation() {
    this.selectedLocation = null
    document.getElementById("selectedLocation").classList.add("hidden")
    this.updateGetStartedButton() // Update button state when location is cleared

    // Reset live location status
    const statusDiv = document.getElementById("locationStatus")
    statusDiv.innerHTML = `
            <button id="getLocationBtn" class="btn btn-outline full-width">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Get My Current Location
            </button>
        `

    // Re-bind the event listener for the new button
    document.getElementById("getLocationBtn").addEventListener("click", () => {
      this.getCurrentLocation()
    })
  }

  updateGetStartedButton() {
    const getStartedBtn = document.getElementById("getStartedBtn")
    const isValid = this.selectedLanguage && this.selectedLocation

    if (isValid) {
      getStartedBtn.classList.remove("disabled")
      getStartedBtn.href = "home.html"
      getStartedBtn.title = "Continue to Farm Assist"
    } else {
      getStartedBtn.classList.add("disabled")
      getStartedBtn.href = "#"

      let message = "Please select "
      const missing = []
      if (!this.selectedLanguage) missing.push("language")
      if (!this.selectedLocation) missing.push("location")
      message += missing.join(" and ") + " before continuing."

      getStartedBtn.title = message
    }
  }

  handleGetStartedClick(event) {
    // Prevent default anchor behavior if validation fails
    if (!this.selectedLanguage || !this.selectedLocation) {
      event.preventDefault()

      let message = "Please select "
      const missing = []
      if (!this.selectedLanguage) missing.push("language")
      if (!this.selectedLocation) missing.push("location")
      message += missing.join(" and ") + " before continuing."

      alert(message)
      return false
    }

    // Store selections in localStorage for use on home page
    localStorage.setItem("farmAssistLanguage", this.selectedLanguage)
    localStorage.setItem("farmAssistLocation", JSON.stringify(this.selectedLocation))

    console.log("Getting started with:", {
      selectedLanguage: this.selectedLanguage,
      selectedLocation: this.selectedLocation?.name,
    })

    // Allow default anchor behavior (redirect to home.html)
    return true
  }

  handleGetStarted() {
    // Validate both selections before proceeding
    if (!this.selectedLanguage || !this.selectedLocation) {
      alert("Please select both language and location before continuing.")
      return
    }

    console.log("Getting started with:", {
      selectedLanguage: this.selectedLanguage,
      selectedLocation: this.selectedLocation?.name,
    })

    // Store selections in localStorage for use on home page
    localStorage.setItem("farmAssistLanguage", this.selectedLanguage)
    localStorage.setItem("farmAssistLocation", JSON.stringify(this.selectedLocation))

    // Navigate to home page
    window.location.href = "home.html"
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.farmAssist = new FarmAssist()
})
