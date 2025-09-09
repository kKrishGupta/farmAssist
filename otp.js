// document.addEventListener("DOMContentLoaded", () => {
//   const otpInputs = document.querySelectorAll(".otp-input")
//   const verifyBtn = document.getElementById("verify-otp-btn")
//   const resendBtn = document.getElementById("resend-btn")
//   const backBtn = document.getElementById("back-to-signup")
//   const timerElement = document.getElementById("timer")
//   const phoneLastDigits = document.getElementById("phone-last-digits")
//   const messageBox = document.getElementById("message-box")
//   const messageText = document.getElementById("message-text")
//   const closeBtn = document.querySelector(".close-btn")

//   let timer = 30
//   let timerInterval
//   const correctOTP = "123456" // In real app, this would come from server

//   // Initialize
//   init()

//   function init() {
//     // Get user data from localStorage
//     const userData = JSON.parse(localStorage.getItem("pendingUser"))
//     if (!userData) {
//       window.location.href = "index.html"
//       return
//     }

//     // Display last 4 digits of phone number
//     const phone = userData.phone
//     phoneLastDigits.textContent = phone.slice(-4)

//     // Start timer
//     startTimer()

//     // Setup OTP input handlers
//     setupOTPInputs()
//   }

//   function setupOTPInputs() {
//     otpInputs.forEach((input, index) => {
//       input.addEventListener("input", (e) => {
//         const value = e.target.value

//         // Only allow numbers
//         if (!/^\d$/.test(value)) {
//           e.target.value = ""
//           return
//         }

//         // Add filled class
//         e.target.classList.add("filled")

//         // Move to next input
//         if (value && index < otpInputs.length - 1) {
//           otpInputs[index + 1].focus()
//         }

//         // Check if all inputs are filled
//         checkOTPComplete()
//       })

//       input.addEventListener("keydown", (e) => {
//         // Handle backspace
//         if (e.key === "Backspace" && !input.value && index > 0) {
//           otpInputs[index - 1].focus()
//           otpInputs[index - 1].classList.remove("filled")
//         }
//       })

//       input.addEventListener("paste", (e) => {
//         e.preventDefault()
//         const pastedData = e.clipboardData.getData("text")
//         const digits = pastedData.replace(/\D/g, "").slice(0, 6)

//         digits.split("").forEach((digit, i) => {
//           if (otpInputs[i]) {
//             otpInputs[i].value = digit
//             otpInputs[i].classList.add("filled")
//           }
//         })

//         checkOTPComplete()
//       })
//     })
//   }

//   function checkOTPComplete() {
//     const otp = Array.from(otpInputs)
//       .map((input) => input.value)
//       .join("")
//     verifyBtn.disabled = otp.length !== 6
//   }

//   function startTimer() {
//     timer = 30
//     resendBtn.disabled = true
//     timerInterval = setInterval(() => {
//       timer--
//       timerElement.textContent = timer

//       if (timer <= 0) {
//         clearInterval(timerInterval)
//         resendBtn.disabled = false
//         timerElement.parentElement.textContent = "Didn't receive OTP?"
//       }
//     }, 1000)
//   }

//   // Verify OTP button click handler
//   verifyBtn.addEventListener("click", () => {
//     const enteredOTP = Array.from(otpInputs)
//       .map((input) => input.value)
//       .join("")

//     if (enteredOTP === correctOTP) {
//       // OTP is correct
//       showMessage("OTP verified successfully!", () => {
//         // Clear pending user data
//         localStorage.removeItem("pendingUser")
//         // Redirect to dashboard
//         window.location.href = "dashboard.html"
//       })
//     } else {
//       // OTP is incorrect
//       showMessage("Invalid OTP. Please enter the correct OTP.")
//       // Clear inputs
//       otpInputs.forEach((input) => {
//         input.value = ""
//         input.classList.remove("filled")
//       })
//       otpInputs[0].focus()
//       verifyBtn.disabled = true
//     }
//   })

//   // Resend OTP button click handler
//   resendBtn.addEventListener("click", () => {
//     showMessage("OTP has been resent to your mobile number")
//     startTimer()
//     // Clear inputs
//     otpInputs.forEach((input) => {
//       input.value = ""
//       input.classList.remove("filled")
//     })
//     otpInputs[0].focus()
//     verifyBtn.disabled = true
//   })

//   // Back to signup button click handler
//   backBtn.addEventListener("click", () => {
//     window.location.href = "index.html"
//   })

//   // Message box functionality
//   function showMessage(message, callback = null) {
//     messageText.textContent = message
//     messageBox.style.display = "flex"

//     if (callback) {
//       setTimeout(() => {
//         hideMessage()
//         callback()
//       }, 2000)
//     }
//   }

//   function hideMessage() {
//     messageBox.style.display = "none"
//   }

//   // Close message box
//   closeBtn.addEventListener("click", hideMessage)

//   // Close message box when clicking outside
//   messageBox.addEventListener("click", (e) => {
//     if (e.target === messageBox) {
//       hideMessage()
//     }
//   })
// })


document.addEventListener("DOMContentLoaded", () => {
  const otpInputs = document.querySelectorAll(".otp-input")
  const verifyBtn = document.getElementById("verify-otp-btn")
  const resendBtn = document.getElementById("resend-btn")
  const backBtn = document.getElementById("back-to-signup")
  const timerElement = document.getElementById("timer")
  const emailDisplay = document.getElementById("email-display")
  const messageBox = document.getElementById("message-box")
  const messageText = document.getElementById("message-text")
  const closeBtn = document.querySelector(".close-btn")

  let timer = 30
  let timerInterval
  const correctOTP = "123456" // In real app, this would come from server

  // Initialize
  init()

  function init() {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("pendingUser"))
    if (!userData) {
      window.location.href = "index.html"
      return
    }

    const email = userData.email
    const emailParts = email.split("@")
    const maskedEmail = emailParts[0].substring(0, 2) + "***@" + emailParts[1]
    emailDisplay.textContent = maskedEmail

    // Start timer
    startTimer()

    // Setup OTP input handlers
    setupOTPInputs()
  }

  function setupOTPInputs() {
    otpInputs.forEach((input, index) => {
      input.addEventListener("input", (e) => {
        const value = e.target.value

        // Only allow numbers
        if (!/^\d$/.test(value)) {
          e.target.value = ""
          return
        }

        // Add filled class
        e.target.classList.add("filled")

        // Move to next input
        if (value && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus()
        }

        // Check if all inputs are filled
        checkOTPComplete()
      })

      input.addEventListener("keydown", (e) => {
        // Handle backspace
        if (e.key === "Backspace" && !input.value && index > 0) {
          otpInputs[index - 1].focus()
          otpInputs[index - 1].classList.remove("filled")
        }
      })

      input.addEventListener("paste", (e) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text")
        const digits = pastedData.replace(/\D/g, "").slice(0, 6)

        digits.split("").forEach((digit, i) => {
          if (otpInputs[i]) {
            otpInputs[i].value = digit
            otpInputs[i].classList.add("filled")
          }
        })

        checkOTPComplete()
      })
    })
  }

  function checkOTPComplete() {
    const otp = Array.from(otpInputs)
      .map((input) => input.value)
      .join("")
    verifyBtn.disabled = otp.length !== 6
  }

  function startTimer() {
    timer = 30
    resendBtn.disabled = true
    timerInterval = setInterval(() => {
      timer--
      timerElement.textContent = timer

      if (timer <= 0) {
        clearInterval(timerInterval)
        resendBtn.disabled = false
        timerElement.parentElement.textContent = "Didn't receive OTP?"
      }
    }, 1000)
  }

  // Verify OTP button click handler
  verifyBtn.addEventListener("click", () => {
    const enteredOTP = Array.from(otpInputs)
      .map((input) => input.value)
      .join("")

    if (enteredOTP === correctOTP) {
      // OTP is correct
      showMessage("OTP verified successfully!", () => {
        // Clear pending user data
        localStorage.removeItem("pendingUser")
        // Redirect to dashboard
        window.location.href = "dashboard.html"
      })
    } else {
      // OTP is incorrect
      showMessage("Invalid OTP. Please enter the correct OTP.")
      // Clear inputs
      otpInputs.forEach((input) => {
        input.value = ""
        input.classList.remove("filled")
      })
      otpInputs[0].focus()
      verifyBtn.disabled = true
    }
  })

  // Resend OTP button click handler
  resendBtn.addEventListener("click", () => {
    showMessage("OTP has been resent to your email address")
    startTimer()
    // Clear inputs
    otpInputs.forEach((input) => {
      input.value = ""
      input.classList.remove("filled")
    })
    otpInputs[0].focus()
    verifyBtn.disabled = true
  })

  // Back to signup button click handler
  backBtn.addEventListener("click", () => {
    window.location.href = "index.html"
  })

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
  closeBtn.addEventListener("click", hideMessage)

  // Close message box when clicking outside
  messageBox.addEventListener("click", (e) => {
    if (e.target === messageBox) {
      hideMessage()
    }
  })
})