'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { checkRateLimit } from '@/app/lib/rate-limit'
import { ContactNotificationEmail } from '@/app/lib/emails/contact-notification'

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120, 'Name is too long'),
  email: z.string().trim().email('Please enter a valid email address').max(320, 'Email is too long'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000, 'Message is too long'),
  website: z.string().optional(),
})

export type ContactFormValues = {
  name: string
  email: string
  message: string
}

export type ContactActionState = {
  status: 'idle' | 'success' | 'validation-error' | 'error'
  message?: string
  summary?: string
  values: ContactFormValues
  fieldErrors?: Partial<Record<keyof ContactFormValues, string>>
}

export const initialContactActionState: ContactActionState = {
  status: 'idle',
  values: {
    name: '',
    email: '',
    message: '',
  },
}

function getFormValues(formData: FormData): ContactFormValues {
  return {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    message: String(formData.get('message') ?? ''),
  }
}

function getClientKey(formData: FormData, values: ContactFormValues): string {
  const ip = String(formData.get('ip') ?? '').trim()
  if (ip) return `contact:ip:${ip}`
  return `contact:email:${values.email.toLowerCase()}`
}

export async function submitContactForm(
  _prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const values = getFormValues(formData)
  const website = String(formData.get('website') ?? '')

  if (website.trim().length > 0) {
    return {
      status: 'error',
      message: 'Submission blocked. Please try again.',
      values,
    }
  }

  const parsed = contactSchema.safeParse({ ...values, website })
  if (!parsed.success) {
    const flattened = parsed.error.flatten()
    return {
      status: 'validation-error',
      summary: 'Please fix the highlighted fields and try again.',
      values,
      fieldErrors: {
        name: flattened.fieldErrors.name?.[0],
        email: flattened.fieldErrors.email?.[0],
        message: flattened.fieldErrors.message?.[0],
      },
    }
  }

  const rateKey = getClientKey(formData, parsed.data)
  const limiter = checkRateLimit(rateKey, 3, 10 * 60 * 1000)
  if (!limiter.allowed) {
    return {
      status: 'error',
      message: 'Too many attempts. Please wait a few minutes before retrying.',
      values,
    }
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL
  const recipient = process.env.CONTACT_NOTIFICATION_EMAIL

  if (!resendApiKey || !fromEmail || !recipient) {
    console.error('[contact] Missing mailer configuration', {
      resendApiKey: Boolean(resendApiKey),
      fromEmail: Boolean(fromEmail),
      recipient: Boolean(recipient),
    })
    return {
      status: 'error',
      message: 'Could not send your message right now. Please retry in a moment.',
      values,
    }
  }

  try {
    const resend = new Resend(resendApiKey)
    await resend.emails.send({
      from: fromEmail,
      to: recipient,
      subject: `New portfolio contact from ${parsed.data.name}`,
      react: ContactNotificationEmail({
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
      }),
    })
  } catch (error) {
    console.error('[contact] Resend delivery failed', {
      error,
      email: parsed.data.email,
      name: parsed.data.name,
    })
    return {
      status: 'error',
      message: 'Message delivery failed. Please retry in a moment.',
      values,
    }
  }

  return {
    status: 'success',
    message: 'Thanks. Your message has been sent.',
    values: initialContactActionState.values,
  }
}
