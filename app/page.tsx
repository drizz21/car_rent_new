'use client';

import React from 'react';
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import CTASection from "./components/home/CTASection";
import DisplaySection from "./components/home/DisplaySection";
import FasilitasSection from "./components/home/FasilitasSection";
import FiturSection from "./components/home/FiturSection";
import KendaraanSection from "./components/home/KendaraanSection";


export default function Home() {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] overflow-x-hidden">
      <Header />
      <main className="overflow-x-hidden">
        <DisplaySection />
        <FiturSection />
        <FasilitasSection />
        <KendaraanSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}