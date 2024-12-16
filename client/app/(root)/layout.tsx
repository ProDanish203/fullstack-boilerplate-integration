import { Header } from "@/components/shared";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="">
      <Header />
      <div className="">{children}</div>
    </main>
  );
}
