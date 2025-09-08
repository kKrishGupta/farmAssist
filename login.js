document.addEventListener("DOMContentLoaded", () => {
  const mainContainer = document.querySelector(".main-container")
  const loginForm = document.querySelector(".login-form")
  const signupForm = document.querySelector(".signup-form")
  const formToggleButtons = document.querySelectorAll(".form-toggle-btn")
  const passwordToggles = document.querySelectorAll(".password-toggle")
  const sendOtpBtn = document.querySelector(".send-otp-btn")
  const messageBox = document.getElementById("message-box")
  const messageText = document.getElementById("message-text")
  const closeBtn = document.querySelector(".close-btn")
  const loginBtn = document.querySelector(".login-form .b")

  // Toggle between login and signup forms
  formToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (mainContainer.classList.contains("signup-mode")) {
        mainContainer.classList.remove("signup-mode")
        loginForm.classList.add("active")
        signupForm.classList.remove("active")
      } else {
        mainContainer.classList.add("signup-mode")
        loginForm.classList.remove("active")
        signupForm.classList.add("active")
      }
    })
  })

  // Toggle password visibility
  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const passwordInput = toggle.previousElementSibling
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
      passwordInput.setAttribute("type", type)
      toggle.classList.toggle("fa-eye")
      toggle.classList.toggle("fa-eye-slash")
    })
  })

  // Send OTP button click handler
  if (sendOtpBtn) {
    sendOtpBtn.addEventListener("click", (e) => {
      e.preventDefault()

      // Get form data
      const name = document.getElementById("signup-name").value.trim()
      const email = document.getElementById("signup-email").value.trim()
      const phone = document.getElementById("signup-phone").value.trim()
      const password = document.getElementById("signup-password").value.trim()

      // Validate form data
      if (!name || !email || !phone || !password) {
        showMessage("Please fill in all fields")
        return
      }

      if (!isValidEmail(email)) {
        showMessage("Please enter a valid email address")
        return
      }

      if (!isValidPhone(phone)) {
        showMessage("Please enter a valid phone number")
        return
      }

      if (password.length < 6) {
        showMessage("Password must be at least 6 characters long")
        return
      }

      // Store user data in localStorage for OTP verification
      const userData = { name, email, phone, password }
      localStorage.setItem("pendingUser", JSON.stringify(userData))

      showMessage("OTP sent successfully", () => {
        // Redirect to OTP verification page
        window.location.href = "otp.html"
      })
    })
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault()

      const username = document.getElementById("login-username").value.trim()
      const password = document.getElementById("login-password").value.trim()
      const robotCheck = document.getElementById("robot-check").checked

      if (!username || !password) {
        showMessage("Please fill in all fields")
        return
      }

      if (!robotCheck) {
        showMessage("Please verify that you're not a robot")
        return
      }

      // Redirect directly to dashboard
      window.location.href = "dashboard.html"
    })
  }

  // Message box functionality
  function showMessage(message, callback = null) {
    messageText.textContent = message
    messageBox.style.display = "flex"

    if (callback) {
      setTimeout(() => {
        hideMessage()
        callback()
      }, 2000)
    }
  }

  function hideMessage() {
    messageBox.style.display = "none"
  }

  // Close message box
  if (closeBtn) {
    closeBtn.addEventListener("click", hideMessage)
  }

  // Close message box when clicking outside
  messageBox?.addEventListener("click", (e) => {
    if (e.target === messageBox) {
      hideMessage()
    }
  })

  // Validation functions
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  function isValidPhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/
    return phoneRegex.test(phone.replace(/\D/g, ""))
  }
})
