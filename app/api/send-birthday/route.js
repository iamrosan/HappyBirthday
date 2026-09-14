import nodemailer from 'nodemailer';

const sentYears = globalThis.__birthdayEmailSentYears ?? new Set();
globalThis.__birthdayEmailSentYears = sentYears;

export async function POST(request) {
  const { year } = await request.json().catch(() => ({}));
  const numericYear = Number(year);

  if (!Number.isInteger(numericYear)) {
    return Response.json({ error: 'A valid birthday year is required.' }, { status: 400 });
  }
  if (sentYears.has(numericYear)) {
    return Response.json({ success: true, alreadySent: true });
  }

  const user = process.env.GMAIL_USER;
  const password = process.env.GMAIL_APP_PASSWORD;
  const recipient = process.env.BIRTHDAY_EMAIL_TO;
  const siteUrl = new URL(request.url).origin;
  if (!user || !password || !recipient) {
    return Response.json({ error: 'Gmail environment variables are not configured.' }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass: password },
  });

  try {
    await transporter.sendMail({
      from: `Happy Birthday <${user}>`,
      to: recipient,
      subject: 'Happy Birthday Shradha! 🎉 ❤️',
      text: `Happy Birthday, Shradha! 🎉 ❤️

On this special day, I hope your heart is filled with happiness, your face with smiles, and your year with beautiful moments. You deserve all the love, laughter, and wonderful surprises life has to offer.

May every dream you hold close come true, and may the year ahead bring you countless reasons to smile. Keep shining and being the amazing person you are.

Wishing you the sweetest birthday and an unforgettable year ahead!

With lots of love ❤️
7th January ${numericYear}

See your birthday countdown here: ${siteUrl}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: auto; padding: 32px; color: #3b2431; background: #fff8fb; border-radius: 16px;">
          <h1 style="color: #c2386b; text-align: center;">Happy Birthday, Shradha! 🎉 ❤️</h1>
          <p>On this special day, I hope your heart is filled with happiness, your face with smiles, and your year with beautiful moments. You deserve all the love, laughter, and wonderful surprises life has to offer.</p>
          <p>May every dream you hold close come true, and may the year ahead bring you countless reasons to smile. Keep shining and being the amazing person you are.</p>
          <p>Wishing you the sweetest birthday and an unforgettable year ahead!</p>
          <p style="margin-top: 28px;">With lots of love ❤️</p>
          <p style="color: #8c6274;">7th January ${numericYear}</p>

          <p style="margin: 30px 0; text-align: center;">
            <a href="${siteUrl}" style="display: inline-block; padding: 12px 22px; color: white; background: #c2386b; border-radius: 8px; text-decoration: none;">See Your Birthday Countdown</a>
          </p>
        </div>`,
    });
    sentYears.add(numericYear);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Birthday email failed:', error);
    return Response.json({ error: 'Unable to send the birthday email.' }, { status: 500 });
  }
}
