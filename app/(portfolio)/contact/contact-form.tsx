'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  submitContactForm,
  type ContactActionState,
} from '@/app/(portfolio)/contact/actions'

const initialContactActionState: ContactActionState = {
  status: 'idle',
  values: {
    name: '',
    email: '',
    message: '',
  },
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button className="portfolio-contact-submit" type="submit" disabled={pending}>
      {pending ? 'Sending...' : 'Send message'}
    </button>
  )
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialContactActionState)
  const showSummary = state.status === 'validation-error' || state.status === 'error'

  return (
    <form className="portfolio-contact-form" action={formAction} noValidate>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="portfolio-contact-honeypot"
        aria-hidden="true"
      />

      {showSummary ? (
        <div className="portfolio-contact-summary" role="alert" aria-live="polite">
          {state.summary ?? state.message ?? 'Please review your submission and retry.'}
        </div>
      ) : null}

      {state.status === 'success' ? (
        <p className="portfolio-contact-success" role="status" aria-live="polite">
          {state.message ?? 'Thanks. Your message has been sent.'} Expected response window: within 1 business day.
        </p>
      ) : null}

      <div className="portfolio-contact-field">
        <label className="portfolio-contact-label" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          className="portfolio-contact-input"
          defaultValue={state.values.name}
          aria-invalid={Boolean(state.fieldErrors?.name)}
          aria-describedby={state.fieldErrors?.name ? 'contact-name-error' : undefined}
          required
        />
        {state.fieldErrors?.name ? (
          <p id="contact-name-error" className="portfolio-contact-error" role="alert">
            {state.fieldErrors.name}
          </p>
        ) : null}
      </div>

      <div className="portfolio-contact-field">
        <label className="portfolio-contact-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="portfolio-contact-input"
          defaultValue={state.values.email}
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={state.fieldErrors?.email ? 'contact-email-error' : undefined}
          required
        />
        {state.fieldErrors?.email ? (
          <p id="contact-email-error" className="portfolio-contact-error" role="alert">
            {state.fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="portfolio-contact-field">
        <label className="portfolio-contact-label" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          className="portfolio-contact-textarea"
          defaultValue={state.values.message}
          aria-invalid={Boolean(state.fieldErrors?.message)}
          aria-describedby={state.fieldErrors?.message ? 'contact-message-error' : undefined}
          rows={7}
          required
        />
        {state.fieldErrors?.message ? (
          <p id="contact-message-error" className="portfolio-contact-error" role="alert">
            {state.fieldErrors.message}
          </p>
        ) : null}
      </div>

      <SubmitButton />
    </form>
  )
}
