"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "bn" : "en");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2 hover:bg-accent transition-colors"
      title={language === "en" ? "Switch to Bangla" : "Switch to English"}
    >
      <Languages className="h-4 w-4" />
      <span className="font-semibold">{language === "en" ? "বাংলা" : "English"}</span>
    </Button>
  );
}
