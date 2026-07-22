'use client'

import { useState } from 'react'

type Service = { id: number; name: string }

export function ContactForm({ services }: { services: Service[] }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget

    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
      city: (form.elements.namedItem('city') as HTMLInputElement).value,
      serviceId: (form.elements.namedItem('serviceId') as HTMLSelectElement).value,
    }

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) { setStatus('sent'); form.reset() } else { setStatus('error') }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required /><br />
      <input name="email" type="email" placeholder="Email" required /><br />
      <input name="phone" placeholder="Phone" required /><br />
      <input name="city" placeholder="Your City" /><br />
      <select name="serviceId">
        <option value="">Service Interested In (optional)</option>
        {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select><br />
      <textarea name="message" placeholder="Message" required /><br />
      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Submit'}
      </button>
      {status === 'sent' && <p>Thank you! We&apos;ll be in touch soon.</p>}
      {status === 'error' && <p>Something went wrong.</p>}
    </form>
  )
}