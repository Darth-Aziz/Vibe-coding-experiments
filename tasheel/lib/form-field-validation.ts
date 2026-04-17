import { isValidPhoneNumber } from "react-phone-number-input"
import type { FormField } from "./types"

function isFormValueEmpty(field: FormField, value: unknown): boolean {
  if (value === undefined || value === null) return true
  if (field.type === "checkbox") {
    return !Array.isArray(value) || value.length === 0
  }
  if (typeof value === "string") return value.trim() === ""
  return false
}

/** Returns a user-facing validation message, or null if the value is acceptable. */
export function getFormFieldValidationError(
  field: FormField,
  value: unknown
): string | null {
  if (isFormValueEmpty(field, value)) {
    return field.required ? "This field is required" : null
  }

  if (field.type === "checkbox" || field.type === "file") {
    return null
  }

  const str =
    typeof value === "number" && !Number.isNaN(value)
      ? String(value)
      : String(value).trim()

  if (field.type === "email") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
      return "Enter a valid email address"
    }
  }

  if (field.type === "url") {
    try {
      const href = str.includes("://") ? str : `https://${str}`
      new URL(href)
    } catch {
      return "Enter a valid URL"
    }
  }

  if (field.type === "tel") {
    if (!isValidPhoneNumber(str)) {
      return "Enter a valid phone number with country code"
    }
  }

  if (field.type === "number") {
    const n = Number(str)
    if (Number.isNaN(n)) return "Enter a valid number"
    if (field.min !== undefined && n < field.min) {
      return `Must be at least ${field.min}`
    }
    if (field.max !== undefined && n > field.max) {
      return `Must be at most ${field.max}`
    }
  }

  const textLike: FormField["type"][] = [
    "text",
    "textarea",
    "email",
    "url",
    "tel",
  ]
  if (textLike.includes(field.type)) {
    const len = str.length
    if (field.minLength !== undefined && len < field.minLength) {
      return `Use at least ${field.minLength} characters`
    }
    if (field.maxLength !== undefined && len > field.maxLength) {
      return `Use at most ${field.maxLength} characters`
    }
  }

  return null
}
