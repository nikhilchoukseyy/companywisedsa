import { useState } from 'react';
import { FiMessageSquare, FiSend } from 'react-icons/fi';
import { feedbackApi } from '../utils/api';

export default function FeedbackForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await feedbackApi.send({ name, email, message });
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      window.setTimeout(() => setSubmitted(false), 2400);
    } catch (submissionError) {
      setError(submissionError.message || 'Could not send feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[1280px] rounded-[28px] border border-border bg-surface p-4 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-brand">
              <FiMessageSquare size={14} />
              <span>Feedback</span>
            </div>
            <h2 className="mt-2 text-lg font-bold text-text-primary sm:text-[22px]">
              Share what feels helpful
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-text-secondary">
            Tell us what part of the app helps you most while you prepare.
          </p>
        </div>

        {submitted ? (
          <div className="mt-5 rounded-2xl border border-easy/30 bg-easy/10 px-4 py-3 text-sm font-semibold text-easy">
            Thanks for your feedback. It was emailed successfully.
          </div>
        ) : null}

        {error ? (
          <div className="mt-5 rounded-2xl border border-hard/30 bg-hard/10 px-4 py-3 text-sm font-semibold text-hard">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-text-primary">Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              required
              className="w-full rounded-2xl border border-border bg-page px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-brand"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-text-primary">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-border bg-page px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-brand"
            />
          </label>

          <label className="grid gap-2 lg:col-span-2">
            <span className="text-sm font-semibold text-text-primary">Feedback</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Tell us what you like or what should improve..."
              required
              className="min-h-32 w-full resize-y rounded-2xl border border-border bg-page px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-brand"
            />
          </label>

          <div className="lg:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-page transition-colors hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-70"
            >
              <FiSend size={14} />
              {submitting ? 'Sending...' : 'Send feedback'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
