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
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white border-t border-gray-700 overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Developer Info with Animation */}
          <div className="flex items-center gap-4 group justify-center md:justify-start">
            <div className="relative">
              {githubAvatar && (
                <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/50 group-hover:ring-primary transition-all duration-300 group-hover:scale-110 shadow-lg shadow-primary/20">
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
              <p className="text-xs text-primary font-medium mb-0.5 uppercase tracking-wider">{t("developedBy")}</p>
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:from-primary group-hover:to-green-400">
                {developer.name}
              </h3>
              <p className="text-sm text-gray-400">{developer.role}</p>
              <p className="text-xs text-gray-500">{developer.university}</p>
            </div>
          </div>

          {/* Center - Made with love */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2 group cursor-default">
              <span className="text-gray-400 group-hover:text-white transition-colors">{t("madeWith")}</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse group-hover:scale-125 transition-transform" />
              <span className="text-gray-400 group-hover:text-white transition-colors">{t("inBangladesh")}</span>
            </div>
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} GUSMP Attendance. All rights reserved.
            </p>
          </div>

          {/* Social Links with hover animations */}
          <div className="flex justify-center md:justify-end gap-4">
            <Link
              href={developer.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 bg-gray-800 rounded-full hover:bg-primary transition-all duration-300 hover:scale-110 hover:-rotate-6 hover:shadow-lg hover:shadow-primary/30 border border-gray-700 hover:border-primary"
            >
              <Globe className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 whitespace-nowrap pointer-events-none border border-gray-700">
                {t("portfolio")}
              </span>
            </Link>
            <Link
              href={developer.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-lg hover:shadow-white/10 border border-gray-700 hover:border-gray-500"
            >
              <Github className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 whitespace-nowrap pointer-events-none border border-gray-700">
                {t("github")}
              </span>
            </Link>
            <Link
              href={developer.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 bg-gray-800 rounded-full hover:bg-blue-600 transition-all duration-300 hover:scale-110 hover:-rotate-6 hover:shadow-lg hover:shadow-blue-500/30 border border-gray-700 hover:border-blue-400"
            >
              <Linkedin className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 whitespace-nowrap pointer-events-none border border-gray-700">
                {t("linkedin")}
              </span>
            </Link>
            <Link
              href={`mailto:${developer.email}`}
              className="group relative p-3 bg-gray-800 rounded-full hover:bg-red-500 transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-lg hover:shadow-red-500/30 border border-gray-700 hover:border-red-400"
            >
              <Mail className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 whitespace-nowrap pointer-events-none border border-gray-700">
                {t("email")}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
