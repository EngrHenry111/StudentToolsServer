import { SitemapStream, streamToPromise } from "sitemap";
import Tutorial from "../models/tutorialModel.js";

export const generateSitemap = async (req, res) => {
 try {

  const tutorials = await Tutorial.find();

  const smStream = new SitemapStream({
   hostname: "https://studenttoolsng.com"
  });

  // Static pages (FIXED URLs)
  const staticPages = [
   { url: "/", priority: 1.0 },
   { url: "/tutorials", priority: 0.9 },
   { url: "/cgpa-calculator", priority: 0.9 },
   { url: "/waec-grade-calculator", priority: 0.9 },
   { url: "/jamb-score-calculator", priority: 0.9 },
   { url: "/gpa-class-calculator", priority: 0.8 },

   { url: "/study-planner", priority: 0.7 },
   { url: "/scholarships", priority: 0.7 },

   { url: "/admission-prediction", priority: 0.7 },
   { url: "/ai-tutor", priority: 0.7 },
   { url: "/tutorials/math-calculator", priority: 0.7 },
   { url: "/quiz", priority: 0.7 },

   { url: "/about", priority: 0.5 },
   { url: "/contact", priority: 0.5 },
   { url: "/privacy-policy", priority: 0.3 },
   { url: "/terms", priority: 0.3 },
   { url: "/author", priority: 0.5 }
  ];

  staticPages.forEach(page => {
   smStream.write({
    url: page.url,
    changefreq: "weekly",
    priority: page.priority,
    lastmod: new Date().toISOString()
   });
  });

  // Dynamic tutorials
  tutorials.forEach(tutorial => {
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