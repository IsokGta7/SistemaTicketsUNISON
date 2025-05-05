"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

interface ReCaptchaProps {
  onToken: (token: string) => void
  action: string
}

export function ReCaptcha({ onToken, action }: ReCaptchaProps) {
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    const loadScript = () => {
      if (scriptRef.current) return

      const script = document.createElement("script")
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`
      script.async = true
      script.defer = true
      script.onload = () => {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, { action })
            .then((token) => onToken(token))
        })
      }
      document.body.appendChild(script)
      scriptRef.current = script
    }

    loadScript()

    return () => {
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current)
        scriptRef.current = null
      }
    }
  }, [action, onToken])

  return null
} 