import nodemailer from 'nodemailer';

const sentDeliveries = globalThis.__birthdayEmailSentDeliveries ?? new Set();
globalThis.__birthdayEmailSentDeliveries = sentDeliveries;

export async function POST(request) {
  const { year } = await request.json().catch(() => ({}));
  const numericYear = Number(year);

  if (!Number.isInteger(numericYear)) {
    return Response.json({ error: 'A valid birthday year is required.' }, { status: 400 });
  }
  const user = process.env.GMAIL_USER;
  const password = process.env.GMAIL_APP_PASSWORD;
  const recipients = process.env.BIRTHDAY_EMAIL_TO
    ?.split(',')
    .map((email) => email.trim())
    .filter(Boolean);
  const siteUrl = new URL(request.url).origin;
  if (!user || !password || !recipients?.length) {
    return Response.json({ error: 'Gmail environment variables are not configured.' }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass: password },
  });

  const message = {
      from: `Happy Birthday <${user}>`,
      subject: 'Happy Birthday Shradha! 🎉 ❤️',
      text: `Happy Birthday, Shradha! 🎉 ❤️

On this special day, I hope your heart is filled with happiness, your face with smiles, and your year with beautiful moments. You deserve all the love, laughter, and wonderful surprises life has to offer.

May every dream you hold close come true, and may the year ahead bring you countless reasons to smile. Keep shining and being the amazing person you are.

Wishing you the sweetest birthday and an unforgettable year ahead!

With lots of love ❤️
@rosansht
7th January ${numericYear}

See your birthday countdown here: ${siteUrl}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: auto; padding: 32px; color: #3b2431; background: #fff8fb; border-radius: 16px;">
          <h1 style="color: #c2386b; text-align: center;">Happy Birthday, Shradha! 🎉 ❤️</h1>
          <p>On this special day, I hope your heart is filled with happiness, your face with smiles, and your year with beautiful moments. You deserve all the love, laughter, and wonderful surprises life has to offer.</p>
          <p>May every dream you hold close come true, and may the year ahead bring you countless reasons to smile. Keep shining and being the amazing person you are.</p>
          <p>Wishing you the sweetest birthday and an unforgettable year ahead!</p>
          <p style="margin-top: 28px; margin-bottom: 4px;">With lots of love ❤️</p>
          <p style="margin-top: 0; color: #c2386b;">@rosansht</p>
          <p style="color: #8c6274;">7th January ${numericYear}</p>

          <p style="margin: 30px 0; text-align: center;">
            <a href="${siteUrl}" style="display: inline-block; padding: 12px 22px; color: white; background: #c2386b; border-radius: 8px; text-decoration: none;">See Your Birthday Countdown</a>
          </p>
        </div>`,
  };

  const pendingRecipients = recipients.filter(
    (recipient) => !sentDeliveries.has(`${numericYear}:${recipient.toLowerCase()}`),
  );
  if (!pendingRecipients.length) {
    return Response.json({ success: true, alreadySent: true, sent: 0 });
  }

  const results = await Promise.allSettled(
    pendingRecipients.map(async (recipient) => {
      await transporter.sendMail({ ...message, to: recipient });
      sentDeliveries.add(`${numericYear}:${recipient.toLowerCase()}`);
    }),
  );
  const failed = results.filter((result) => result.status === 'rejected');

  if (failed.length) {
    failed.forEach((result) => console.error('Birthday email failed:', result.reason));
    return Response.json(
      {
        error: 'Email delivery failed for one or more recipients.',
        sent: results.length - failed.length,
        failed: failed.length,
      },
      { status: 502 },
    );
  }

  return Response.json({ success: true, sent: results.length });
}
