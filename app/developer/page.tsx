"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Github, Linkedin, Mail, Globe, Calendar, Award } from "lucide-react";
import { DarkGradientBg } from "./components/dark-gradient-bg";

export default function DeveloperPage() {
  const [developer, setDeveloper] = useState<any>(null);

  useEffect(() => {
    fetch("/developer.json")
      .then((res) => res.json())
      .then((data) => setDeveloper(data));
  }, []);

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
  });

  if (!developer) return <div className="min-h-screen bg-black" />;

  return (
    <DarkGradientBg>
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
      </div>

      <section
        ref={ref}
        className="mx-auto flex flex-col items-center overflow-hidden px-4 text-white min-h-[250vh]"
      >
        {/* Hero Section */}
        <div className="relative flex w-full max-w-6xl flex-col items-center justify-center gap-8 text-center pt-[15vh]">
          {/* Header Logos */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-8 mb-8"
          >
            <div className="bg-white p-3 rounded-xl shadow-lg shadow-white/5">
              <Image src={developer.universityLogo} alt="University Logo" width={100} height={40} className="h-10 w-auto" />
            </div>
            <div className="bg-white p-3 rounded-xl shadow-lg shadow-white/5">
              <Image src={developer.departmentLogo} alt="Department Logo" width={80} height={40} className="h-10 w-auto" />
            </div>
          </motion.div>

          {/* Profile Image */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="relative"
          >
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-xl overflow-hidden border-4 border-black ring-4 ring-white/10 bg-zinc-800 shadow-2xl">
              <Image
                src={developer.profileImage}
                alt={developer.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/40 to-transparent"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4 relative z-10"
          >
            <h1 className="font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-emerald-200">
              {developer.name}
            </h1>
            <p className="text-xl md:text-3xl font-medium text-cyan-400/80">
              {developer.role}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base text-white/60 font-mono mt-4">
              <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">ID: {developer.id}</span>
              <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">Batch: {developer.batch}</span>
              <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">{developer.department}</span>
            </div>
          </motion.div>

          <p className="font-mono text-xs md:text-sm text-white/40 mt-12 animate-bounce">
            Scroll down to discover more
          </p>

          {/* Background Animated Path */}
          <LinePath
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-20 pointer-events-none"
            scrollYProgress={scrollYProgress}
          />
        </div>

        {/* Content Section revealing on scroll */}
        <div className="w-full max-w-5xl translate-y-[30vh] pb-32 z-10 space-y-24">

          {/* Motivation & Quote */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-8"
          >
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <h3 className="text-2xl font-semibold mb-4 text-emerald-400">Motivation</h3>
              <p className="text-white/80 leading-relaxed text-lg">"{developer.motivation}"</p>
            </div>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-900/40 to-emerald-900/40 border border-cyan-500/20 backdrop-blur-sm">
              <h3 className="text-2xl font-semibold mb-4 text-cyan-400">Message to You</h3>
              <p className="text-white/90 leading-relaxed text-lg italic">"{developer.inspiringText}"</p>
            </div>
          </motion.div>

          {/* Mentorship Info */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="p-8 md:p-12 rounded-4xl bg-black/40 border border-white/10 backdrop-blur-md w-full relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>

            <h2 className="text-3xl md:text-5xl font-bold mb-10 flex items-center gap-4">
              <Award className="w-10 h-10 text-emerald-400" />
              Mentorship Experience
            </h2>

            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-4 text-xl md:text-2xl text-white/80 border-b border-white/10 pb-6">
                <Calendar className="w-6 h-6 text-cyan-400" />
                <span>{developer.mentorship.duration}</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {developer.mentorship.departments.map((dept: any, index: number) => (
                  <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-3xl font-bold text-cyan-400 mb-2">{dept.times}x</div>
                    <div className="text-white/70">{dept.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-wrap justify-center gap-6 pt-12"
          >
            <SocialLink href={developer.github} icon={<Github className="w-6 h-6" />} label="GitHub" />
            <SocialLink href={developer.linkedin} icon={<Linkedin className="w-6 h-6" />} label="LinkedIn" />
            <SocialLink href={developer.portfolio} icon={<Globe className="w-6 h-6" />} label="Portfolio" />
            <SocialLink href={`mailto:${developer.email}`} icon={<Mail className="w-6 h-6" />} label="Email" />
          </motion.div>

          {/* Footer Text */}
          <div className="text-center pt-24 pb-8 text-white/30 font-mono text-sm">
            <p>Designed & Developed with ❤️ by {developer.name}</p>
            <p className="mt-2">© {new Date().getFullYear()} GUSMP Attendance System</p>
          </div>
        </div>
      </section>
    </DarkGradientBg>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
    >
      <div className="text-white/70 group-hover:text-cyan-400 transition-colors">
        {icon}
      </div>
      <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 text-sm text-cyan-400 transition-opacity duration-300 pointer-events-none">
        {label}
      </span>
    </Link>
  );
}

const LinePath = ({
  className,
  scrollYProgress,
}: {
  className: string;
  scrollYProgress: any;
}) => {
  const pathLength = useTransform(scrollYProgress, [0, 1], [0.1, 1]);

  return (
    <svg
      width="1278"
      height="2319"
      viewBox="0 0 1278 2319"
      fill="none"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <motion.path
        d="M876.605 394.131C788.982 335.917 696.198 358.139 691.836 416.303C685.453 501.424 853.722 498.43 941.95 409.714C1016.1 335.156 1008.64 186.907 906.167 142.846C807.014 100.212 712.699 198.494 789.049 245.127C889.053 306.207 986.062 116.979 840.548 43.3233C743.932 -5.58141 678.027 57.1682 672.279 112.188C666.53 167.208 712.538 172.943 736.353 163.088C760.167 153.234 764.14 120.924 746.651 93.3868C717.461 47.4252 638.894 77.8642 601.018 116.979C568.164 150.908 557 201.079 576.467 246.924C593.342 286.664 630.24 310.55 671.68 302.614C756.114 286.446 729.747 206.546 681.86 186.442C630.54 164.898 492 209.318 495.026 287.644C496.837 334.494 518.402 366.466 582.455 367.287C680.013 368.538 771.538 299.456 898.634 292.434C1007.02 286.446 1192.67 309.384 1242.36 382.258C1266.99 418.39 1273.65 443.108 1247.75 474.477C1217.32 511.33 1149.4 511.259 1096.84 466.093C1044.29 420.928 1029.14 380.576 1033.97 324.172C1038.31 273.428 1069.55 228.986 1117.2 216.384C1152.2 207.128 1186.81 213.629 1194.45 245.127C1201.49 281.062 1132.22 280.104 1100.44 272.673C1065.32 264.464 1044.22 234.837 1032.77 201.413C1019.29 162.061 1029.71 131.126 1056.44 100.965C1086.19 67.4032 1143.96 54.5526 1175.78 86.1513C1207.02 117.17 1186.81 143.379 1156.22 166.691C1112.57 199.959 1052.57 186.238 999.784 155.164C957.312 130.164 899.171 63.7054 931.284 26.3214C952.068 2.12513 996.288 3.87363 1007.22 43.58C1018.15 83.2749 1003.56 122.644 975.969 163.376C948.377 204.107 907.272 255.122 913.558 321.045C919.727 385.734 990.968 497.068 1063.84 503.35C1111.46 507.456 1166.79 511.984 1175.68 464.527C1191.52 379.956 1101.26 334.985 1030.29 377.017C971.109 412.064 956.297 483.647 953.797 561.655C947.587 755.413 1197.56 941.828 936.039 1140.66C745.771 1285.32 321.926 950.737 134.536 1202.19C-6.68295 1391.68 -53.4837 1655.38 131.935 1760.5C478.381 1956.91 1124.19 1515 1201.28 1997.83C1273.66 2451.23 100.805 1864.7 303.794 2668.89"
        stroke="#22D3EE"
        strokeWidth="20"
        style={{
          pathLength,
          strokeDashoffset: useTransform(pathLength, (value) => 1 - value),
        }}
      />
    </svg>
  );
};
