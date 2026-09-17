import { SitemapStream, streamToPromise } from "sitemap";
import Tutorial from "../models/tutorialModel.js";

export const generateSitemap = async (req, res) => {
 try {

  // Only published tutorials belong in the sitemap. Drafts should never be
  // advertised to Google.
  const tutorials = await Tutorial.find({ status: "published" });

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

  // Category listing pages (/:category, /:category/:topic, ...) are
  // intentionally NOT included here. Tutorials.jsx marks every one of them
  // noindex,follow (they're thin listing pages, not real content) — listing
  // a noindexed URL in the sitemap tells Google "please index this" while
  // the page itself says "don't", which is exactly the kind of conflicting
  // signal that produces "Duplicate, Google chose different canonical" and
  // "Duplicate without user-selected canonical" in Search Console. A
  // sitemap should only ever contain URLs we actually want indexed.

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
