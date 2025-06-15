## 🔐 Why OTP Instead of Magic Link?

We use an **6-digit base-36 OTP (valid for 300 seconds)** instead of a traditional magic link for authentication.

### ✅ Reasons:

- **More flexible UX:**  
  Users can either **click the link** from their email _or_ **manually enter the OTP** on a different device.

  > Example: Email on phone, login on laptop.

- **Short-lived & secure:**  
  OTPs are:

  - Valid for only 5 minutes
  - One-time use
  - ~2B possible combinations (6 base-36 digits)
  - Would require ~7M attempts per second to brute-force in 5 minutes
  - Hashed before storing
  - Fixed attempts

- **Lower friction than passwords**
