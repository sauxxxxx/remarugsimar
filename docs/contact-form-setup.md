# Contact form setup

The "Start a project" form posts to `/api/contact` on the site. That route filters out bots and
forwards real enquiries to a Google Apps Script web app, which emails them to your Gmail with the
visitor as Reply-To. Visitors don't need a Google account.

## 1. Create the Apps Script (about 2 minutes)

1. Sign in to the Google account that should receive enquiries, and open https://script.google.com.
2. Click **New project** and name it "Portfolio contact".
3. Replace the contents of `Code.gs` with `scripts/contact-apps-script.gs` from this repo, then save.
4. Make a long random secret, for example by running `node -e "console.log(crypto.randomUUID()+crypto.randomUUID())"`.
5. Open **Project Settings** (gear icon) → **Script properties** → **Add script property**:
   - `SHARED_SECRET` = the secret from step 4.
   - Optional: `SHEET_ID` = the ID of a Google Sheet to log enquiries in (the long part of its URL
     between `/d/` and `/edit`). Add a header row such as
     `Date | Name | Email | About | Message | Page` if you like.
6. Click **Deploy** → **New deployment** → type **Web app**:
   - **Execute as:** Me
   - **Who has access:** Anyone
7. Click **Deploy**, approve the permissions it asks for (sending email as you, and Sheets if you set
   `SHEET_ID`), and copy the **Web app URL** (it ends in `/exec`).
8. Open that URL in your browser. You should see `{"ok":true,"service":"portfolio-contact"}`.

If you edit the script later, use **Deploy → Manage deployments → Edit → New version** so the
URL stays the same.

## 2. Add the environment variables

In Vercel → the project → **Settings → Environment Variables**, add these for Production (and
Preview if you want to test there), then redeploy:

| Name | Value |
| --- | --- |
| `CONTACT_APPS_SCRIPT_URL` | The Web app URL from step 7 |
| `CONTACT_APPS_SCRIPT_SECRET` | The same secret as `SHARED_SECRET` |

For local testing, put the same two lines in `.env.local`.

## 3. Test it

Open the site, click **Start a project**, and send yourself a message. It should arrive in your
Gmail within a few seconds, with Reply going to the address typed in the form.

Until the variables are set, the form shows an error and points visitors to the email links under it.

## Spam protection

- A hidden field that people never see; bots that fill it are dropped silently.
- Messages sent within 2.5 seconds of opening the form are dropped silently.
- At most 5 messages per visitor IP every 10 minutes (per server instance).
- The Apps Script ignores any request without the shared secret, so its public URL can't be used
  directly.

If spam still gets through, add Cloudflare Turnstile to the form and verify its token in
`src/app/api/contact/route.ts`.

## Limits

A free Gmail account can send about 100 emails a day through Apps Script; Google Workspace
accounts get more. Each enquiry uses one.
