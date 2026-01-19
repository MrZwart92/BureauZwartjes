"use client";

import { useState } from "react";
import { Header } from "@/components/ui/Header";
import { Hero } from "@/components/landing/Hero";
import { MissionSection } from "@/components/landing/MissionSection";
import { USPSection } from "@/components/landing/USPSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { WorkflowSection } from "@/components/landing/WorkflowSection";
import { PromiseSection } from "@/components/landing/PromiseSection";
import { Footer } from "@/components/landing/Footer";
import { IntakeChat } from "@/components/chat/IntakeChat";

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  return (
    <>
      <Header />
      <main>
        <Hero onStartIntake={openChat} />
        <MissionSection />
        <USPSection />
        <PricingSection onStartIntake={openChat} />
        <WorkflowSection />
        <PromiseSection />
        <Footer onStartIntake={openChat} />
      </main>
      <IntakeChat isOpen={isChatOpen} onClose={closeChat} />
    </>
  );
}
