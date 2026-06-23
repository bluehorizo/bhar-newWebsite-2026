/**
 * BHAR India – Form Handler
 * Client-side validation + EmailJS / Formspree submission
 * File: js/form.js
 *
 * HOW TO USE:
 *  Option A (EmailJS – recommended, free tier available):
 *    1. Sign up at emailjs.com
 *    2. Create a service, template, and get your public key
 *    3. Replace EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY below
 *
 *  Option B (Formspree – simplest, no backend):
 *    1. Sign up at formspree.io, create a form
 *    2. Set USE_FORMSPREE = true and add your FORMSPREE_ENDPOINT
 *
 *  Option C (Custom backend – Node/PHP):
 *    Set USE_CUSTOM_API = true and point CUSTOM_API_URL to your endpoint
 */

/* ── Configuration ── */
const FORM_CONFIG = {
  USE_EMAILJS:    false,  // set true to use EmailJS
  USE_FORMSPREE:  false,  // set true to use Formspree
  USE_CUSTOM_API: false,  // set true to use your own backend

  EMAILJS_SERVICE_ID:  'YOUR_SERVICE_ID',
  EMAILJS_TEMPLATE_ID: 'YOUR_TEMPLATE_ID',
  EMAILJS_PUBLIC_KEY:  'YOUR_PUBLIC_KEY',

  FORMSPREE_ENDPOINT: 'https://formspree.io/f/YOUR_FORM_ID',

  CUSTOM_API_URL: '/api/contact',  // your backend endpoint
};

/* ── Validators ── */
const validators = {
  required: (value) => value.trim().length > 0,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
  minLength: (value, len) => value.trim().length >= len,
  phone: (value) => !value || /^[+0-9\s\-()]{7,15}$/.test(value.trim()),
};

/* ── Show/hide field error ── */
function showError(input, message) {
  input.classList.add('error');
  input.classList.remove('success');
  const errEl = input.parentNode.querySelector('.field-error');
  if (errEl) {
    errEl.textContent = message;
    errEl.classList.add('visible');
  }
}
function clearError(input) {
  input.classList.remove('error');
  input.classList.add('success');
  const errEl = input.parentNode.querySelector('.field-error');
  if (errEl) errEl.classList.remove('visible');
}

/* ── Validate single field ── */
function validateField(input) {
  const value    = input.value;
  const type     = input.type;
  const name     = input.name;
  const required = input.required;

  if (required && !validators.required(value)) {
    showError(input, 'This field is required.');
    return false;
  }
  if (type === 'email' && value && !validators.email(value)) {
    showError(input, 'Please enter a valid email address.');
    return false;
  }
  if (name === 'phone' && value && !validators.phone(value)) {
    showError(input, 'Please enter a valid phone number.');
    return false;
  }
  if (name === 'message' && required && !validators.minLength(value, 20)) {
    showError(input, 'Message must be at least 20 characters.');
    return false;
  }
  clearError(input);
  return true;
}

/* ── Validate all fields ── */
function validateForm(form) {
  const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
  let valid = true;
  fields.forEach(field => {
    if (!validateField(field)) valid = false;
  });
  return valid;
}

/* ── Set loading state on submit button ── */
function setLoading(btn, loading) {
  if (loading) {
    btn.dataset.originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;
    btn.style.opacity = '0.7';
  } else {
    btn.textContent = btn.dataset.originalText || 'Send Message';
    btn.disabled = false;
    btn.style.opacity = '';
  }
}

/* ── Show form status message ── */
function showStatus(statusEl, type, message) {
  if (!statusEl) return;
  statusEl.className = 'form-status ' + type;
  statusEl.textContent = message;
  setTimeout(() => {
    statusEl.className = 'form-status';
    statusEl.textContent = '';
  }, 6000);
}

/* ── Send via EmailJS ── */
async function sendEmailJS(formData) {
  if (!window.emailjs) {
    throw new Error('EmailJS not loaded. Add <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script> to your page.');
  }
  emailjs.init(FORM_CONFIG.EMAILJS_PUBLIC_KEY);
  return emailjs.send(
    FORM_CONFIG.EMAILJS_SERVICE_ID,
    FORM_CONFIG.EMAILJS_TEMPLATE_ID,
    formData
  );
}

/* ── Send via Formspree ── */
async function sendFormspree(form) {
  const res = await fetch(FORM_CONFIG.FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: new FormData(form),
  });
  if (!res.ok) throw new Error('Formspree submission failed.');
  return res.json();
}

/* ── Send via custom API ── */
async function sendCustomAPI(formData) {
  const res = await fetch(FORM_CONFIG.CUSTOM_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  if (!res.ok) throw new Error('API submission failed.');
  return res.json();
}

/* ── Main form handler ── */
function initContactForm() {
  const form     = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const statusEl  = document.getElementById('formStatus');

  /* Live validation on blur */
  form.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });

  /* Submit */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm(form)) {
      showStatus(statusEl, 'error', 'Please fix the errors above and try again.');
      return;
    }

    /* Collect form data */
    const formData = {
      from_name:  form.querySelector('[name="name"]')?.value.trim()    || '',
      from_email: form.querySelector('[name="email"]')?.value.trim()   || '',
      phone:      form.querySelector('[name="phone"]')?.value.trim()   || '',
      company:    form.querySelector('[name="company"]')?.value.trim() || '',
      subject:    form.querySelector('[name="subject"]')?.value.trim() || 'Contact Form Submission',
      message:    form.querySelector('[name="message"]')?.value.trim() || '',
      to_name:    'BHAR India Team',
    };

    setLoading(submitBtn, true);

    try {
      if (FORM_CONFIG.USE_EMAILJS) {
        await sendEmailJS(formData);
      } else if (FORM_CONFIG.USE_FORMSPREE) {
        await sendFormspree(form);
      } else if (FORM_CONFIG.USE_CUSTOM_API) {
        await sendCustomAPI(formData);
      } else {
        /* Demo mode – simulate a delay */
        await new Promise(r => setTimeout(r, 1200));
        console.log('Form data (demo mode):', formData);
      }

      showStatus(statusEl, 'success', '✓ Message sent successfully! We\'ll get back to you within 24 hours.');
      form.reset();
      form.querySelectorAll('input, textarea').forEach(el => el.classList.remove('success', 'error'));

    } catch (err) {
      console.error('Form submission error:', err);
      showStatus(statusEl, 'error', '✗ Something went wrong. Please email us directly at customerdelight@bhar.co.in');
    } finally {
      setLoading(submitBtn, false);
    }
  });
}

document.addEventListener('DOMContentLoaded', initContactForm);
