export type ProfileSkill = {
  name: string;
  category: "frontend" | "backend" | "infra" | "product";
  color: string;
};

export type FeaturedProject = {
  name: string;
  description: string;
  url: string;
};

export type ProfileLink = {
  label: string;
  href: string;
};

export type ProfileData = {
  name: string;
  handle: string;
  title: string;
  summary: string;
  sourceNote: string;
  focus: string[];
  skills: ProfileSkill[];
  projects: FeaturedProject[];
  links: ProfileLink[];
};

export const profileData: ProfileData = {
  name: "Ishigami Yuki",
  handle: "F0gr1",
  title: "Full-stack Web Developer",
  summary:
    "Builds clean and usable web apps with TypeScript, React, Next.js, NestJS, Docker, and database-backed APIs. Public work focuses on SNS, chat, dashboards, task tools, and simple architecture.",
  sourceNote: "Profile content uses public GitHub profile information only.",
  focus: [
    "Frontend: React, Next.js, and UI implementation",
    "Backend: NestJS, APIs, and real-time features",
    "Infra: Docker, databases, and local development workflows",
    "Product: SNS, chat, dashboard, and task-management tools",
  ],
  skills: [
    { name: "TypeScript", category: "frontend", color: "#60a5fa" },
    { name: "React", category: "frontend", color: "#22d3ee" },
    { name: "Next.js", category: "frontend", color: "#f8fafc" },
    { name: "NestJS", category: "backend", color: "#fb7185" },
    { name: "Node.js", category: "backend", color: "#86efac" },
    { name: "Docker", category: "infra", color: "#38bdf8" },
    { name: "PostgreSQL", category: "infra", color: "#818cf8" },
    { name: "MySQL", category: "infra", color: "#fbbf24" },
  ],
  projects: [
    {
      name: "nest-chat",
      description: "Chat-focused backend project using the NestJS ecosystem.",
      url: "https://github.com/F0gr1/nest-chat",
    },
    {
      name: "habit-tracker",
      description: "Habit and progress tracking product experiment.",
      url: "https://github.com/F0gr1/habit-tracker",
    },
    {
      name: "nextSNS",
      description: "SNS-style web application built around Next.js patterns.",
      url: "https://github.com/F0gr1/nextSNS",
    },
    {
      name: "3d-profile",
      description: "Interactive 3D profile portfolio using React and Three.js.",
      url: "https://github.com/F0gr1/3d-profile",
    },
  ],
  links: [
    {
      label: "GitHub profile",
      href: "https://github.com/F0gr1",
    },
  ],
};
