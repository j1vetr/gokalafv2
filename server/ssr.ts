import type { Request, Response, NextFunction, Express } from "express";
import fs from "fs";
import path from "path";
import { storage } from "./storage";
import {
  generateHomeMeta,
  generatePackagesMeta,
  generateArticlesListMeta,
  generateArticleDetailMeta,
  generateAboutMeta,
  generateToolsMeta,
  generateVkiToolMeta,
  generateCalorieToolMeta,
  generateTdeeToolMeta,
  generateMacroToolMeta,
  generateIdealKiloToolMeta,
  generateVucutYagiToolMeta,
  generateOneRepMaxToolMeta,
  generateSuTuketimiToolMeta,
  generateKalpAtisiToolMeta,
  generateProteinToolMeta,
  generateDinlenmeToolMeta,
  injectMeta,
  injectBody,
} from "./seo/meta-inject";
import {
  renderHome,
  renderPackages,
  renderArticlesList,
  renderArticleDetail,
  renderAbout,
  renderTools,
  renderVkiTool,
  renderCalorieTool,
  renderTdeeTool,
  renderMacroTool,
  renderIdealKiloTool,
  renderVucutYagiTool,
  renderOneRepMaxTool,
  renderSuTuketimiTool,
  renderKalpAtisiTool,
  renderProteinTool,
  renderDinlenmeTool,
  render404,
} from "./render";
import { log } from "./index";

const BOT_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'yandex',
  'baiduspider',
  'duckduckbot',
  'slurp',
  'facebookexternalhit',
  'facebot',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
  'applebot',
  'pinterest',
  'redditbot',
  'discordbot',
  'slackbot',
];

const BOT_REGEX = /bot|crawler|spider|scraper|prerender/i;

let cachedIndexHtml: string | null = null;

function getIndexHtml(): string {
  if (cachedIndexHtml && process.env.NODE_ENV === "production") {
    return cachedIndexHtml;
  }

  const dirname = import.meta.dirname;
  const indexPath = process.env.NODE_ENV === "production"
    ? path.resolve(dirname, "public", "index.html")
    : path.resolve(dirname, "..", "client", "index.html");

  if (!fs.existsSync(indexPath)) {
    throw new Error(`index.html not found at ${indexPath}`);
  }

  cachedIndexHtml = fs.readFileSync(indexPath, "utf-8");
  return cachedIndexHtml;
}

export function isBot(userAgent: string | undefined): boolean {
  if (!userAgent) return false;
  
  const ua = userAgent.toLowerCase();
  
  if (BOT_USER_AGENTS.some(bot => ua.includes(bot))) {
    return true;
  }
  
  return BOT_REGEX.test(ua);
}

export function shouldServeSSR(req: Request): boolean {
  if (req.query._ssr === "true") {
    return true;
  }
  
  if (req.query._ssr === "false") {
    return false;
  }
  
  return isBot(req.headers["user-agent"]);
}

type RouteHandler = (req: Request, res: Response) => Promise<void>;

const SSR_ROUTES: Array<{ pattern: RegExp; handler: RouteHandler }> = [
  {
    pattern: /^\/$/,
    handler: handleHome,
  },
  {
    pattern: /^\/paketler\/?$/,
    handler: handlePackages,
  },
  {
    pattern: /^\/yazilar\/?$/,
    handler: handleArticlesList,
  },
  {
    pattern: /^\/yazilar\/([^\/]+)\/?$/,
    handler: handleArticleDetail,
  },
  {
    pattern: /^\/hakkimizda\/?$/,
    handler: handleAbout,
  },
  {
    pattern: /^\/araclar\/?$/,
    handler: handleTools,
  },
  {
    pattern: /^\/araclar\/vki\/?$/,
    handler: handleVkiTool,
  },
  {
    pattern: /^\/araclar\/kalori\/?$/,
    handler: handleCalorieTool,
  },
  {
    pattern: /^\/araclar\/tdee\/?$/,
    handler: handleTdeeTool,
  },
  {
    pattern: /^\/araclar\/makro\/?$/,
    handler: handleMacroTool,
  },
  {
    pattern: /^\/araclar\/ideal-kilo\/?$/,
    handler: handleIdealKiloTool,
  },
  {
    pattern: /^\/araclar\/vucut-yagi\/?$/,
    handler: handleVucutYagiTool,
  },
  {
    pattern: /^\/araclar\/bir-tekrar-max\/?$/,
    handler: handleOneRepMaxTool,
  },
  {
    pattern: /^\/araclar\/su-tuketimi\/?$/,
    handler: handleSuTuketimiTool,
  },
  {
    pattern: /^\/araclar\/kalp-atisi\/?$/,
    handler: handleKalpAtisiTool,
  },
  {
    pattern: /^\/araclar\/protein\/?$/,
    handler: handleProteinTool,
  },
  {
    pattern: /^\/araclar\/dinlenme\/?$/,
    handler: handleDinlenmeTool,
  },
];

async function handleHome(req: Request, res: Response): Promise<void> {
  const meta = generateHomeMeta();
  const body = renderHome();
  sendSSRResponse(res, meta, body);
}

async function handlePackages(req: Request, res: Response): Promise<void> {
  const packages = await storage.getAllPackages();
  const meta = generatePackagesMeta(packages);
  const body = renderPackages(packages);
  sendSSRResponse(res, meta, body);
}

async function handleArticlesList(req: Request, res: Response): Promise<void> {
  const articles = await storage.getPublishedArticles();
  const meta = generateArticlesListMeta(articles);
  const body = renderArticlesList(articles);
  sendSSRResponse(res, meta, body);
}

async function handleArticleDetail(req: Request, res: Response): Promise<void> {
  const match = req.path.match(/^\/yazilar\/([^\/]+)\/?$/);
  const slug = match ? match[1] : null;
  
  if (!slug) {
    send404Response(res);
    return;
  }
  
  const article = await storage.getArticleBySlug(slug);
  
  if (!article || article.status !== 'published') {
    send404Response(res);
    return;
  }
  
  const meta = generateArticleDetailMeta(article);
  const body = renderArticleDetail(article);
  sendSSRResponse(res, meta, body);
}

async function handleAbout(req: Request, res: Response): Promise<void> {
  const meta = generateAboutMeta();
  const body = renderAbout();
  sendSSRResponse(res, meta, body);
}

async function handleTools(req: Request, res: Response): Promise<void> {
  const meta = generateToolsMeta();
  const body = renderTools();
  sendSSRResponse(res, meta, body);
}

async function handleVkiTool(req: Request, res: Response): Promise<void> {
  const meta = generateVkiToolMeta();
  const body = renderVkiTool();
  sendSSRResponse(res, meta, body);
}

async function handleCalorieTool(req: Request, res: Response): Promise<void> {
  const meta = generateCalorieToolMeta();
  const body = renderCalorieTool();
  sendSSRResponse(res, meta, body);
}

async function handleTdeeTool(req: Request, res: Response): Promise<void> {
  const meta = generateTdeeToolMeta();
  const body = renderTdeeTool();
  sendSSRResponse(res, meta, body);
}

async function handleMacroTool(req: Request, res: Response): Promise<void> {
  const meta = generateMacroToolMeta();
  const body = renderMacroTool();
  sendSSRResponse(res, meta, body);
}

async function handleIdealKiloTool(req: Request, res: Response): Promise<void> {
  const meta = generateIdealKiloToolMeta();
  const body = renderIdealKiloTool();
  sendSSRResponse(res, meta, body);
}

async function handleVucutYagiTool(req: Request, res: Response): Promise<void> {
  const meta = generateVucutYagiToolMeta();
  const body = renderVucutYagiTool();
  sendSSRResponse(res, meta, body);
}

async function handleOneRepMaxTool(req: Request, res: Response): Promise<void> {
  const meta = generateOneRepMaxToolMeta();
  const body = renderOneRepMaxTool();
  sendSSRResponse(res, meta, body);
}

async function handleSuTuketimiTool(req: Request, res: Response): Promise<void> {
  const meta = generateSuTuketimiToolMeta();
  const body = renderSuTuketimiTool();
  sendSSRResponse(res, meta, body);
}

async function handleKalpAtisiTool(req: Request, res: Response): Promise<void> {
  const meta = generateKalpAtisiToolMeta();
  const body = renderKalpAtisiTool();
  sendSSRResponse(res, meta, body);
}

async function handleProteinTool(req: Request, res: Response): Promise<void> {
  const meta = generateProteinToolMeta();
  const body = renderProteinTool();
  sendSSRResponse(res, meta, body);
}

async function handleDinlenmeTool(req: Request, res: Response): Promise<void> {
  const meta = generateDinlenmeToolMeta();
  const body = renderDinlenmeTool();
  sendSSRResponse(res, meta, body);
}

function sendSSRResponse(
  res: Response,
  meta: ReturnType<typeof generateHomeMeta>,
  body: string
): void {
  try {
    let html = getIndexHtml();
    html = injectMeta(html, meta);
    html = injectBody(html, body);
    
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
    res.send(html);
  } catch (error) {
    console.error("SSR render error:", error);
    res.status(500).send("Internal Server Error");
  }
}

function send404Response(res: Response): void {
  try {
    let html = getIndexHtml();
    const meta = generateHomeMeta();
    meta.title = "Sayfa Bulunamadı | Gokalaf";
    meta.description = "Aradığınız sayfa bulunamadı.";
    
    html = injectMeta(html, meta);
    html = injectBody(html, render404());
    
    res.status(404);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (error) {
    console.error("SSR 404 render error:", error);
    res.status(404).send("Not Found");
  }
}

export function ssrMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!shouldServeSSR(req)) {
    return next();
  }
  
  if (req.path.startsWith("/api") || 
      req.path.startsWith("/assets") ||
      req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|mp4|webm|json|webmanifest)$/)) {
    return next();
  }
  
  for (const route of SSR_ROUTES) {
    if (route.pattern.test(req.path)) {
      const start = Date.now();
      
      route.handler(req, res)
        .then(() => {
          log(`SSR ${req.path} in ${Date.now() - start}ms`);
        })
        .catch((error) => {
          console.error(`SSR error for ${req.path}:`, error);
          next();
        });
      
      return;
    }
  }
  
  next();
}

export function initSSR(app: Express): void {
  app.use(ssrMiddleware);
  log("SSR middleware initialized");
}
