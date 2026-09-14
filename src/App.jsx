'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import logo from '../img/logo.png';

const SPECIAL_BIRTHDAYS = new Set(['1 7 2025', '7 1 2025', '7 jan 2025', 'jan 7 2025']);

function nextJanuarySeventh() {
  const now = new Date();
  const date = new Date(now.getFullYear(), 0, 7);
  if (date <= now) date.setFullYear(date.getFullYear() + 1);
  return date;
}

function getTimeLeft(target) {
  const distance = target.getTime() - Date.now();
  if (distance <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance % 86_400_000) / 3_600_000),
    minutes: Math.floor((distance % 3_600_000) / 60_000),
    seconds: Math.floor((distance % 60_000) / 1_000),
    passed: false,
  };
}

const pad = (value) => String(value).padStart(2, '0');
const INITIAL_TIME_LEFT = { days: 0, hours: 0, minutes: 0, seconds: 0, passed: false };

function TikTokEmbed() {
  useEffect(() => {
    if (document.querySelector('script[data-tiktok-embed]')) return;
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    script.dataset.tiktokEmbed = 'true';
    document.body.appendChild(script);
  }, []);

  return (
    <div className="tiktok-wrapper">
      <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@sandyasubedi/video/6692702449460841733" data-video-id="6692702449460841733">
        <section>
          <a target="_blank" rel="noreferrer" href="https://www.tiktok.com/@shradhastha">@shradhastha</a>
          <p>Please wait… Content is loading! ❤</p>
        </section>
      </blockquote>
    </div>
  );
}

export default function App() {
  const defaultBirthday = useRef(nextJanuarySeventh());
  const [input, setInput] = useState('');
  const [birthday, setBirthday] = useState(defaultBirthday.current);
  const [customBirthday, setCustomBirthday] = useState(false);
  const [showShradha, setShowShradha] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_LEFT);
  const alerted = useRef(false);
  const emailedYear = useRef(null);

  useEffect(() => {
    const updateCountdown = () => {
      const next = getTimeLeft(birthday);
      setTimeLeft(next);
      if (next.passed && !customBirthday) {
        const completedYear = defaultBirthday.current.getFullYear();
        if (emailedYear.current !== completedYear) {
          emailedYear.current = completedYear;
          fetch('/api/send-birthday', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ year: completedYear }),
          }).catch((error) => console.error('Birthday email request failed:', error));
        }
        const nextYear = new Date(defaultBirthday.current);
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        defaultBirthday.current = nextYear;
        setBirthday(nextYear);
      } else if (next.passed && !alerted.current) {
        window.alert('Oops! This birthday has already passed.');
        alerted.current = true;
      }
    };
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [birthday, customBirthday]);

  const startCountdown = (event) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) return setError('Please enter a birthday.');
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return setError('Please use a date such as “Jan 7, 2027”.');

    parsed.setHours(0, 0, 0, 0);
    setBirthday(parsed);
    setCustomBirthday(true);
    setShowShradha(SPECIAL_BIRTHDAYS.has(value.toLowerCase()));
    setError('');
    alerted.current = false;
  };

  const units = [['Days', timeLeft.days], ['Hours', timeLeft.hours], ['Mins', timeLeft.minutes], ['Sec', timeLeft.seconds]];

  return (
    <main>
      <div className="logo">
        <Image src={logo} alt="Birthday logo" width={100} height={100} priority />
      </div>
      <div className="wrapper">
        <header className="coming-soon-div">
          <h1>
            {customBirthday
              ? `Happy Birthday ${showShradha ? 'Shradha' : 'to you'}!!!`
              : <>Happy Birthday Shradha <span className="birthday-emojis">🎉 ❤️</span></>}
          </h1>
          {!customBirthday && <h6>7th Jan {birthday.getFullYear()}</h6>}
        </header>
        <section className="time-box" aria-label="Birthday countdown">
          <div className="countdown">
            {units.map(([label, value]) => (
              <div className="time" key={label}><p>{label}</p><span>{pad(value)}</span></div>
            ))}
          </div>
          <div className="content">
            Now or Never.<br />Enter your birthday and start the countdown now.
            <form className="submit-div" onSubmit={startCountdown}>
              <input type="text" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Your birthday (e.g. Jan 7, 2027)" aria-label="Birthday" />
              <button className="btn" type="submit">Let's Go</button>
            </form>
            {error && <p className="error" role="alert">{error}</p>}
          </div>
        </section>
      </div>
      {showShradha && <TikTokEmbed />}
    </main>
  );
}
