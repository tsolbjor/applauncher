import { siGithub, siGithubcopilot, siSlack, type SimpleIcon } from "simple-icons";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  Cloud,
  FileStack,
  FolderKanban,
  Mail,
  MessageSquare,
  ShieldCheck,
  Users,
} from "lucide-react";

export type ToolCategory =
  | "Engineering"
  | "Collaboration"
  | "Analytics"
  | "Support"
  | "People";

export type ToolIcon =
  | { type: "simple"; icon: SimpleIcon }
  | { type: "lucide"; icon: LucideIcon };

export interface AppDefinition {
  type: "app";
  id: string;
  name: string;
  url: string;
  description: string;
  category: ToolCategory;
  icon: ToolIcon;
  keywords?: string[];
  pinned?: boolean;
}

export interface DestinationDefinition {
  type: "destination";
  id: string;
  parentId: string;
  name: string;
  url: string;
  description: string;
  keywords?: string[];
  pinned?: boolean;
}

export type LauncherItem = AppDefinition | DestinationDefinition;

export const apps: AppDefinition[] = [
  {
    type: "app",
    id: "outlook",
    name: "Outlook",
    url: "https://outlook.office.com",
    description: "Email, calendar, and meeting flow for the day.",
    category: "Collaboration",
    icon: { type: "lucide", icon: Mail },
    keywords: ["mail", "email", "calendar", "office", "microsoft 365"],
    pinned: true,
  },
  {
    type: "app",
    id: "teams",
    name: "Teams",
    url: "https://teams.microsoft.com/l/chat/0/0",
    description: "Calls, chat, channels, and internal collaboration.",
    category: "Collaboration",
    icon: { type: "lucide", icon: Users },
    keywords: ["chat", "meetings", "calls", "microsoft teams", "channels"],
    pinned: true,
  },
  {
    type: "app",
    id: "slack",
    name: "Slack",
    url: "slack://open?team=T354R8S02",
    description: "Cross-functional chat and fast-moving incident threads.",
    category: "Collaboration",
    icon: { type: "simple", icon: siSlack },
    keywords: ["chat", "comms", "messages", "channels"],
    pinned: true,
  },
  {
    type: "app",
    id: "sharepoint",
    name: "SharePoint",
    url: "https://fortedigital.sharepoint.com",
    description: "Company intranet, document hubs, and team sites.",
    category: "Collaboration",
    icon: { type: "lucide", icon: Building2 },
    keywords: ["docs", "files", "intranet", "sites", "knowledge"],
  },
  {
    type: "app",
    id: "onedrive",
    name: "OneDrive",
    url: "https://fortedigital-my.sharepoint.com/personal",
    description: "Personal and shared files across the Microsoft stack.",
    category: "Collaboration",
    icon: { type: "lucide", icon: FileStack },
    keywords: ["files", "storage", "documents", "drive"],
  },
  {
    type: "app",
    id: "azure-portal",
    name: "Azure Portal",
    url: "https://portal.azure.com",
    description: "Cloud resources, environments, and subscription management.",
    category: "Engineering",
    icon: { type: "lucide", icon: Cloud },
    keywords: ["azure", "cloud", "infra", "subscriptions", "resources"],
    pinned: true,
  },
  {
    type: "app",
    id: "azure-devops",
    name: "Azure DevOps",
    url: "https://dev.azure.com/fortedigital",
    description: "Boards, repos, pipelines, and release workflows.",
    category: "Engineering",
    icon: { type: "lucide", icon: FolderKanban },
    keywords: ["ado", "pipelines", "boards", "repos", "eng"],
  },
  {
    type: "app",
    id: "github",
    name: "GitHub",
    url: "https://github.com/fortedigital",
    description: "Repositories, pull requests, and engineering collaboration.",
    category: "Engineering",
    icon: { type: "simple", icon: siGithub },
    keywords: ["git", "code", "source", "pull requests", "eng"],
    pinned: true,
  },
  {
    type: "app",
    id: "github-copilot",
    name: "GitHub Copilot",
    url: "https://github.com/fortedigital/copilot",
    description: "AI-assisted coding, chat, and developer workflows.",
    category: "Engineering",
    icon: { type: "simple", icon: siGithubcopilot },
    keywords: ["ai", "assistant", "coding", "copilot"],
    pinned: true,
  },
  {
    type: "app",
    id: "power-bi",
    name: "Power BI",
    url: "https://app.powerbi.com",
    description: "Dashboards, KPIs, and operational reporting.",
    category: "Analytics",
    icon: { type: "lucide", icon: BarChart3 },
    keywords: ["bi", "analytics", "reporting", "dashboards", "data"],
    pinned: true,
  },
  {
    type: "app",
    id: "entra-admin-center",
    name: "Entra Admin Center",
    url: "https://entra.microsoft.com",
    description: "Identity, applications, access, and tenant controls.",
    category: "People",
    icon: { type: "lucide", icon: ShieldCheck },
    keywords: ["entra", "azure ad", "identity", "iam", "sso"],
  },
  {
    type: "app",
    id: "intune-admin-center",
    name: "Intune Admin Center",
    url: "https://intune.microsoft.com",
    description: "Device compliance, endpoint policies, and fleet management.",
    category: "Support",
    icon: { type: "lucide", icon: ShieldCheck },
    keywords: ["intune", "devices", "endpoint", "mdm", "compliance"],
  },
  {
    type: "app",
    id: "microsoft-365-admin",
    name: "Microsoft 365 Admin",
    url: "https://admin.microsoft.com",
    description: "Tenant-wide admin tasks, licenses, and service health.",
    category: "People",
    icon: { type: "lucide", icon: MessageSquare },
    keywords: ["m365", "office", "licenses", "tenant", "admin"],
  },
  {
    type: "app",
    id: "figma",
    name: "Figma",
    url: "https://www.figma.com/files/recently",
    description: "Design files, prototypes, and creative collaboration.",
    category: "Collaboration",
    icon: { type: "lucide", icon: MessageSquare },
    keywords: ["figma", "design", "prototypes", "ui", "ux"],
    pinned: true,
  },
  {
    type: "app",
    id: "chatgpt",
    name: "ChatGPT",
    url: "https://chat.openai.com",
    description: "AI assistant for writing, brainstorming, and problem-solving.",
    category: "Engineering",
    icon: { type: "lucide", icon: MessageSquare },
    keywords: ["chatgpt", "ai", "assistant", "writing", "brainstorming"],
    pinned: true,
  },
  {
    type: "app",
    id: "notion",
    name: "Notion",
    url: "https://www.notion.so",
    description: "Notes, wikis, and knowledge management for teams.",
    category: "Collaboration",
    icon: { type: "lucide", icon: MessageSquare },
    keywords: ["notion", "notes", "wiki", "knowledge", "docs"],
  },
  {
    type: "app",
    id: "claude",
    name: "Claude",
    url: "https://claude.ai/new",
    description: "AI assistant for writing, brainstorming, and problem-solving.",
    category: "Engineering",
    icon: { type: "lucide", icon: MessageSquare },
    keywords: ["claude", "ai", "assistant", "writing", "brainstorming"],
    pinned: true,
  },
  {
    type: "app",
    id: "microsoft-copilot",
    name: "Microsoft Copilot",
    url: "https://m365.cloud.microsoft/chat/",
    description: "AI assistant for writing, brainstorming, and problem-solving.",
    category: "Engineering",
    icon: { type: "lucide", icon: MessageSquare },
    keywords: ["microsoft copilot", "ai", "assistant", "writing", "brainstorming"],
  },
  {
    type: "app",
    id: "harvest",
    name: "Harvest",
    url: "https://fortedigital.harvestapp.com/time",
    description: "Time tracking for projects, clients, and internal initiatives.",
    category: "People",
    icon: { type: "lucide", icon: MessageSquare },
    keywords: ["harvest", "time tracking", "timesheets", "projects", "clients"],
  },
  {
    type: "app",
    id: "forte-time",
    name: "Forte Time",
    url: "https://time.fortedigital.com/time",
    description: "Alternative UI for Harvest time tracking with enhanced reporting and dashboards.",
    category: "People",
    icon: { type: "lucide", icon: MessageSquare },
    keywords: ["forte time", "time tracking", "harvest", "dashboard", "reporting"],
  },
];

export const destinations: DestinationDefinition[] = [
  {
    type: "destination",
    id: "slack-readme-oslo",
    parentId: "slack",
    name: "readme-oslo",
    url: "slack://channel?team=T354R8S02&id=C0ANN2UJ4BH",
    description: "Internal channel for announcements, updates, and company news.",
    keywords: ["announcements", "company news", "updates", "oslo"],
    pinned: true,
  },
  {
    type: "destination",
    id: "power-bi-forte-pulse",
    parentId: "power-bi",
    name: "Forte Pulse",
    url: "https://app.powerbi.com/groups/me/apps/44969b7b-abeb-432f-8f5c-47a26b8b3e36/reports/0bde2ea0-9633-4df0-9273-6a3c171b767e/57933e9980158042e7d2?experience=power-bi",
    description: "Operational dashboard for support queues and SLAs.",
    keywords: ["pulse", "kpi", "finance", "operations", "dashboard"],
    pinned: true,
  },
  {
    type: "destination",
    id: "harvest-timesheet",
    parentId: "harvest",
    name: "Timesheet",
    url: "https://fortedigital.harvestapp.com/time",
    description: "Jump directly into daily time tracking.",
    keywords: ["time", "tracking", "timesheet", "hours"],
    pinned: true,
  },
  {
    type: "destination",
    id: "teams-chat",
    parentId: "teams",
    name: "Chat",
    url: "https://teams.microsoft.com/l/chat/0/0",
    description: "Open direct conversations and recent chats.",
    keywords: ["chat", "messages", "conversations"],
  },
  {
    type: "destination",
    id: "github-pulls",
    parentId: "github",
    name: "Pull Requests",
    url: "https://github.com/pulls",
    description: "Review open pull requests across repositories.",
    keywords: ["prs", "reviews", "pull requests"],
  },
  {
    type: "destination",
    id: "azure-devops-boards",
    parentId: "azure-devops",
    name: "Boards",
    url: "https://dev.azure.com/fortedigital",
    description: "Open boards and sprint planning views.",
    keywords: ["boards", "backlog", "sprint", "tickets"],
  },
];

export const items: LauncherItem[] = [...apps, ...destinations];

export const appById = new Map(apps.map((app) => [app.id, app]));
