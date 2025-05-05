export async function verifyRecaptcha(token: string) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  if (!secretKey) {
    throw new Error("reCAPTCHA secret key is not configured")
  }

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `secret=${secretKey}&response=${token}`,
  })

  const data = await response.json()

  if (!data.success) {
    throw new Error("reCAPTCHA verification failed")
  }

  return data.score >= 0.5 // Adjust threshold as needed
} 