
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div>RootLayout</div>
        {children}
      </body>
    </html>
  );
}
