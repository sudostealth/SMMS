"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Mail, Globe, Heart } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface DeveloperInfo {
  name: string;
  university: string;
  role: string;
  email: string;
  portfolio: string;
  github: string;
  linkedin: string;
  photo?: string;
}

export default function Footer() {
  const { t } = useLanguage();
  const [developer, setDeveloper] = useState<DeveloperInfo | null>(null);
  const [githubAvatar, setGithubAvatar] = useState<string>("");

  useEffect(() => {
    // Fetch developer info
    fetch("/developer.json")
      .then((res) => res.json())
      .then((data) => {
        setDeveloper(data);
        
        // Extract GitHub username and fetch avatar
        const githubUsername = data.github.split("/").pop();
        if (githubUsername) {
          fetch(`https://api.github.com/users/${githubUsername}`)
            .then((res) => res.json())
            .then((githubData) => {
              setGithubAvatar(githubData.avatar_url);
            })
            .catch(() => {
              // Fallback to placeholder
              setGithubAvatar("/avatar.jpg");
            });
        }
      })
      .catch(() => {
        // Fallback data
        setDeveloper({
          name: "Developer",
          university: "Green University",
          role: "Full Stack Developer",
          email: "dev@example.com",
          portfolio: "#",
          github: "#",
          linkedin: "#",
        });
      });
  }, []);

  if (!developer) return null;

  return (
    <footer className="relative bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-800 overflow-hidden shrink-0 mt-auto">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] animate-pulse"></div>
      </div>

      <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Developer Info with Animation */}
          <Link href="/developer" className="flex items-center gap-4 group justify-center md:justify-start flex-1 cursor-pointer">
            <div className="relative">
              {githubAvatar && (
                <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden ring-2 ring-primary/50 group-hover:ring-primary transition-all duration-300 group-hover:scale-110 shadow-lg shadow-primary/20">
                  <Image
                    src={githubAvatar}
                    alt={developer.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
            </div>
            <div className="text-left">
              <p className="text-[10px] sm:text-xs text-primary font-medium mb-0.5 uppercase tracking-wider">{t("developedBy")}</p>
              <h3 className="font-bold text-base sm:text-lg group-hover:text-primary transition-colors bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 group-hover:from-primary group-hover:to-green-400">
                {developer.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{developer.role}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500">{developer.university}</p>
            </div>
          </Link>

          {/* Center - Made with love */}
          <div className="text-center space-y-1 sm:space-y-2 flex-1">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1 sm:mb-2 group cursor-default text-sm">
              <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{t("madeWith")}</span>
              <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 animate-pulse group-hover:scale-125 transition-transform" />
              <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{t("inBangladesh")}</span>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500">
              © {new Date().getFullYear()} GUSMP Attendance. All rights reserved.
            </p>
          </div>

          {/* Social Links with hover animations */}
          <div className="flex justify-center md:justify-end gap-3 sm:gap-4 flex-1">
            <Link
              href={developer.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2.5 sm:p-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-primary dark:hover:bg-primary transition-all duration-300 hover:scale-110 hover:-rotate-6 hover:shadow-lg hover:shadow-primary/30 border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary"
            >
              <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] sm:text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 whitespace-nowrap pointer-events-none border border-gray-700">
                {t("portfolio")}
              </span>
            </Link>
            <Link
              href={developer.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2.5 sm:p-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-900 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-lg hover:shadow-gray-900/10 dark:hover:shadow-white/10 border border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-gray-500"
            >
              <Github className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] sm:text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 whitespace-nowrap pointer-events-none border border-gray-700">
                {t("github")}
              </span>
            </Link>
            <Link
              href={developer.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2.5 sm:p-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-blue-600 dark:hover:bg-blue-600 transition-all duration-300 hover:scale-110 hover:-rotate-6 hover:shadow-lg hover:shadow-blue-500/30 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-400"
            >
              <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] sm:text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 whitespace-nowrap pointer-events-none border border-gray-700">
                {t("linkedin")}
              </span>
            </Link>
            <Link
              href={`mailto:${developer.email}`}
              className="group relative p-2.5 sm:p-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-red-500 dark:hover:bg-red-500 transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-lg hover:shadow-red-500/30 border border-gray-200 dark:border-gray-700 hover:border-red-400 dark:hover:border-red-400"
            >
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] sm:text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 whitespace-nowrap pointer-events-none border border-gray-700">
                {t("email")}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
