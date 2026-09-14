import '../src/style.css';

export const metadata = {
  title: 'Happy Birthday — Home',
  description: 'A birthday countdown for Shradha',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bonheur+Royale&family=Handlee&family=Overlock&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
