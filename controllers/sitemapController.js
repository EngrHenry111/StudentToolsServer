import { SitemapStream, streamToPromise } from "sitemap";
import Tutorial from "../models/tutorialModel.js";
import { tutorialCategoryList } from "../services/tutorialCategories.js";

// Only these category listing pages have a real, working route (/:category)
// and clean data. Everything else in the DB category/topic fields is
// freeform and frequently malformed (full sentences, trailing punctuation,
// "cgpa tutorials" style values), so we do NOT expose those as crawlable
// URLs — they were the bulk of the "Discovered - currently not indexed"
// soft-404s in Search Console.
const INDEXABLE_CATEGORIES = tutorialCategoryList;

export const generateSitemap = async (req, res) => {
 try {

  // Only published tutorials belong in the sitemap. Drafts should never be
  // advertised to Google.
  const tutorials = await Tutorial.find({ status: "published" });

  const presentCategories = new Set(
   tutorials
    .map(t => (t.category || "").toLowerCase().trim())
    .filter(cat => INDEXABLE_CATEGORIES.includes(cat))
  );

  const smStream = new SitemapStream({
   hostname: "https://studenttoolsng.com"
  });

  // Static pages (FIXED URLs)
  const staticPages = [
   { url: "/", changefreq: "daily", priority: 1.0 },

   { url: "/tutorials", changefreq: "daily", priority: 0.9 },

   { url: "/cgpa-calculator", changefreq: "monthly", priority: 0.9 },
   { url: "/waec-grade-calculator", changefreq: "monthly", priority: 0.9 },
   { url: "/jamb-score-calculator", changefreq: "monthly", priority: 0.9 },
   { url: "/gpa-class-calculator", changefreq: "monthly", priority: 0.8 },

   { url: "/study-planner", changefreq: "weekly", priority: 0.7 },
   { url: "/scholarships", changefreq: "weekly", priority: 0.7 },

   { url: "/admission-predictor", changefreq: "monthly", priority: 0.7 },
   { url: "/ai-tutor", changefreq: "weekly", priority: 0.7 },
   { url: "/tutorials/math-calculator", changefreq: "weekly", priority: 0.7 },
   { url: "/quiz", changefreq: "weekly", priority: 0.7 },

   { url: "/about", changefreq: "yearly", priority: 0.5 },
   { url: "/contact", changefreq: "yearly", priority: 0.5 },
   { url: "/privacy-policy", changefreq: "yearly", priority: 0.3 },
   { url: "/terms", changefreq: "yearly", priority: 0.3 },
   { url: "/author", changefreq: "yearly", priority: 0.5 }
  ];

  staticPages.forEach((page) => {
   smStream.write({
    url: page.url,
    changefreq: page.changefreq,
    priority: page.priority,
    lastmod: new Date().toISOString()
   });
  });

  // Category listing pages (whitelisted, clean data only)
  presentCategories.forEach(cat => {
   smStream.write({
    url: `/${cat}`,
    changefreq: "weekly",
    priority: 0.7
   });
  });

  // Individual published tutorial articles — the real content
  tutorials.forEach(tutorial => {
   if (!tutorial.slug) return;

   smStream.write({
    url: `/tutorial/${tutorial.slug}`,
    changefreq: "weekly",
    priority: 0.8,
    lastmod: tutorial.updatedAt || tutorial.createdAt
   });
  });

  smStream.end();

  const sitemapOutput = await streamToPromise(smStream);

  res.header("Content-Type", "application/xml");
  res.send(sitemapOutput.toString());

 } catch (error) {
  res.status(500).json({
   message: error.message
  });
 }
};
