# Rey Corporate Group — Event Registration

A single-purpose, secure registration form for Rey Corporate Group events. Attendees
scan a QR code, fill in four fields, and receive an instant confirmation email
from `admin@reycorp.com.au`.

**Fields collected:** Full name, phone number, email address, home address.  
**On submit:** attendee is shown an on-screen confirmation and is emailed a
branded "Thank you for participating with us in this event" message.  
**Storage:** every submission is also sent to a Google Form (easy to view/export).

---

## 1. Run it locally

```bash
npm install
cp .env.example .env.local     # fill in the real values (see below)
npm run dev
```

Open http://localhost:3000 — that's the form.

## 2. Configure the mailbox (admin@reycorp.com.au — Google Workspace)

`reycorp.com.au` mail runs on Google Workspace, so the app is already defaulted to Gmail's SMTP relay in `.env.example`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=admin@reycorp.com.au
SMTP_PASS=bxcb pirb rums vlkv
```

`SMTP_PASS` must be an **app password**, not the normal login password — Google Workspace accounts require this once 2-Step Verification is on (and it should be on for an admin mailbox). To create one:

1. Sign in to `admin@reycorp.com.au` and go to https://myaccount.google.com/security.
2. Turn on **2-Step Verification** if it isn't already.
3. Go to https://myaccount.google.com/apppasswords.
4. Create an app password (name it something like "Reycorp registration form").
5. Copy the 16-character code it gives you — that's `SMTP_PASS`. Spaces don't matter either way.

If the Workspace admin has **"Less secure app access" / app passwords disabled organisation-wide** (common on managed Workspace accounts), there are two fallbacks:
- Ask the Workspace super admin to enable app passwords for this one account under Admin Console → Security → Authentication → 2-step verification.
- Or send via the **Gmail API with OAuth2** instead of SMTP — more setup, but works even with app passwords locked down. Ask if you want this wired in instead of the SMTP approach in `lib/sendEmail.js`.

> For higher-volume events, a transactional email API (Resend, Postmark, SendGrid) configured to send *as* `admin@reycorp.com.au` via a verified domain is worth considering for deliverability — swap the implementation in `lib/sendEmail.js`, the rest of the app is unaffected.

## 3. Google Form setup (replaces Google Sheets — much easier)

Every submission is also posted to a Google Form. You can view responses in the Form → Responses tab, or link it to a Sheet later if you want.

### Step-by-step

1. **Create a new Google Form**
   - Go to https://forms.google.com → blank form.
   - Title it something like "Rey Corporate Group — Event Registrations".

2. **Add these questions** (all "Short answer" unless noted):
   | Question text       | Type          | Required? |
   |---------------------|---------------|-----------|
   | Full name           | Short answer  | Yes       |
   | Phone number        | Short answer  | Yes       |
   | Email address       | Short answer  | Yes       |
   | Home address        | Paragraph     | Yes       |
   | Reference           | Short answer  | No        |
   | Submitted at        | Short answer  | No        |

3. **Get the Form ID**
   - Click the **Send** button (top right) → link icon → copy the link.
   - The URL looks like:  
     `https://docs.google.com/forms/d/e/`**`1FAIpQLSdxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`**`/viewform`
   - The long string between `/d/e/` and `/viewform` is your **GOOGLE_FORM_ID**.

4. **Get the entry IDs** (one number per question)
   - Open the live form link in a new tab.
   - Right-click → **View page source** (or Inspect).
   - Press Ctrl+F / Cmd+F and search for `entry.`.
   - You will see lines like:
     ```
     name="entry.1234567890"
     ```
   - Match each `entry.XXXX` number to the question it belongs to (they appear in the same order as the questions).
   - Write them down:
     - Full name → `GOOGLE_FORM_ENTRY_FULL_NAME`
     - Phone number → `GOOGLE_FORM_ENTRY_PHONE`
     - Email address → `GOOGLE_FORM_ENTRY_EMAIL`
     - Home address → `GOOGLE_FORM_ENTRY_ADDRESS`
     - Reference → `GOOGLE_FORM_ENTRY_REFERENCE` (optional)
     - Submitted at → `GOOGLE_FORM_ENTRY_SUBMITTED_AT` (optional)

5. **Put the values in `.env.local`** (and later in Vercel):

```env
GOOGLE_FORM_ID=1FAIpQLSdxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_FORM_ENTRY_FULL_NAME=1234567890
GOOGLE_FORM_ENTRY_PHONE=1234567891
GOOGLE_FORM_ENTRY_EMAIL=1234567892
GOOGLE_FORM_ENTRY_ADDRESS=1234567893
GOOGLE_FORM_ENTRY_REFERENCE=1234567894
GOOGLE_FORM_ENTRY_SUBMITTED_AT=1234567895
```

That's it. No service account, no sharing, no JSON keys.

> Tip: After the first real submission appears in the Form responses, you can click "Link to Sheets" inside Google Forms if you ever want a spreadsheet view.

## 4. Deploy to Vercel (step-by-step)

1. **Push the code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Reycorp event registration form"
   # Create a new repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/reycorp-form.git
   git branch -M main
   git push -u origin main
   ```

2. **Import the project on Vercel**
   - Go to https://vercel.com → Log in (GitHub is easiest).
   - Click **Add New… → Project**.
   - Select the repo you just pushed.
   - Framework Preset should auto-detect **Next.js**. Leave defaults.
   - **Do not deploy yet** — first add the environment variables.

3. **Add Environment Variables** (Project Settings → Environment Variables)
   Copy every variable from your `.env.local` (or from `.env.example` after you fill it):

   | Name                              | Value                          | Environments      |
   |-----------------------------------|--------------------------------|-------------------|
   | `SMTP_HOST`                       | `smtp.gmail.com`               | Production, Preview |
   | `SMTP_PORT`                       | `465`                          | Production, Preview |
   | `SMTP_SECURE`                     | `true`                         | Production, Preview |
   | `SMTP_USER`                       | `admin@reycorp.com.au`         | Production, Preview |
   | `SMTP_PASS`                       | your 16-char app password      | Production, Preview |
   | `SMTP_FROM_NAME`                  | `Rey Corporate Group`          | Production, Preview |
   | `NOTIFY_EMAIL`                    | `events@reycorp.com.au` (optional) | Production, Preview |
   | `GOOGLE_FORM_ID`                  | your form ID                   | Production, Preview |
   | `GOOGLE_FORM_ENTRY_FULL_NAME`     | entry number                   | Production, Preview |
   | `GOOGLE_FORM_ENTRY_PHONE`         | entry number                   | Production, Preview |
   | `GOOGLE_FORM_ENTRY_EMAIL`         | entry number                   | Production, Preview |
   | `GOOGLE_FORM_ENTRY_ADDRESS`       | entry number                   | Production, Preview |
   | `GOOGLE_FORM_ENTRY_REFERENCE`     | entry number (optional)        | Production, Preview |
   | `GOOGLE_FORM_ENTRY_SUBMITTED_AT`  | entry number (optional)        | Production, Preview |
   | `NEXT_PUBLIC_FORM_URL`            | your final URL (set after first deploy) | Production |

4. **Deploy**
   - Click **Deploy**.
   - Wait ~1–2 minutes. Vercel gives you a URL like  
     `https://reycorp-form-xxxxx.vercel.app`.

5. **(Optional) Custom domain**
   - In Vercel → Project → Settings → Domains → add `register.reycorp.com.au`.
   - Point a CNAME record at your DNS provider to `cname.vercel-dns.com`.
   - Update `NEXT_PUBLIC_FORM_URL` to the custom domain and redeploy (or just edit the env var and trigger a redeploy).

6. **Generate the QR code**
   Once you know the live URL:
   ```bash
   NEXT_PUBLIC_FORM_URL=https://register.reycorp.com.au npm run generate-qr
   ```
   This writes:
   - `public/reycorp-qr.png` — 1024×1024 PNG
   - `reycorp-qr.svg` — vector for print

## 5. Address autocomplete

The address section is four fields — street, suburb, state, postcode — wired
together so the person only has to get one of them right:

- **Suburb** is a live-search dropdown against a bundled dataset of ~18,500
  Australian suburbs/postcodes (`lib/au-localities.json`).
- **Postcode** also has a live dropdown.
- **State** is a fixed dropdown of the 8 Australian states/territories.
- **Street** stays a plain text field.

## Design notes

- Dark "checkpoint" aesthetic (obsidian + metallic gold, one cyan accent).
- Space Grotesk for the wordmark/headings, Inter for body/labels.
- Fully keyboard accessible, visible focus states, respects `prefers-reduced-motion`.

## Project structure

```
app/
  layout.js            Root layout, fonts, metadata
  globals.css          Design tokens + styling
  page.js              The registration form (client component)
  api/submit/route.js  Validates input, posts to Google Form, sends email
  api/localities/      Suburb/postcode autocomplete
lib/
  emailTemplate.js     Luxurious HTML/text email template
  sendEmail.js         Nodemailer transport + send helper
  googleForm.js        Posts submissions to Google Form
scripts/
  generate-qr.js       Generates the printable QR code for the live URL
.env.example           All required environment variables
```
