import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "仓颉平台 - 知识蒸馏技能管理系统",
  description: "基于AI的知识蒸馏技能管理平台，集成代码审查、安全审计、提示工程和架构设计等专业技能",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
