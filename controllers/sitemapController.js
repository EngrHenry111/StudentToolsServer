import { SitemapStream, streamToPromise } from "sitemap";
import Tutorial from "../models/tutorialModel.js";
import Publisher from "../models/Publisher.js";
import Listing from "../models/Listing.js";

export const generateSitemap = async (req, res) => {
 try {

  // Only published tutorials belong in the sitemap. Drafts should never be
  // advertised to Google.
  const tutorials = await Tutorial.find({ status: "published" });

  // Same rule for the marketplace: only active publishers and published
  // listings are advertised — a suspended publisher or a draft listing
  // has no business being submitted for indexing (Task 4).
  const publishers = await Publisher.find({ status: "active" }).select("slug updatedAt createdAt");
  const publisherById = new Map(publishers.map((p) => [String(p._id), p]));

  const listings = await Listing.find({ status: "published" })
   .select("slug publisher updatedAt createdAt")
   .lean();

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
   { url: "/age-calculator", changefreq: "monthly", priority: 0.8, lastmod: "2026-10-26" },
   { url: "/age-tracker", changefreq: "monthly", priority: 0.7, lastmod: "2026-10-26" },
   { url: "/engineering-tools", changefreq: "monthly", priority: 0.8, lastmod: "2026-10-27" },
   { url: "/engineering-tools/resistor-color-code", changefreq: "monthly", priority: 0.7, lastmod: "2026-10-27" },
   { url: "/engineering-tools/smd-resistor-code", changefreq: "monthly", priority: 0.7, lastmod: "2026-10-27" },
   { url: "/engineering-tools/capacitor-code", changefreq: "monthly", priority: 0.7, lastmod: "2026-10-27" },
   { url: "/engineering-tools/ohms-law-calculator", changefreq: "monthly", priority: 0.7, lastmod: "2026-10-27" },
   { url: "/engineering-tools/series-parallel-calculator", changefreq: "monthly", priority: 0.7, lastmod: "2026-10-27" },
   { url: "/engineering-tools/voltage-divider-calculator", changefreq: "monthly", priority: 0.7, lastmod: "2026-10-27" },
   { url: "/engineering-tools/led-resistor-calculator", changefreq: "monthly", priority: 0.7, lastmod: "2026-10-27" },
   { url: "/engineering-tools/555-timer-calculator", changefreq: "monthly", priority: 0.7, lastmod: "2026-10-27" },
   { url: "/engineering-tools/solar-system-calculator", changefreq: "monthly", priority: 0.8, lastmod: "2026-10-27" },
   { url: "/engineering-tools/inverter-size-calculator", changefreq: "monthly", priority: 0.8, lastmod: "2026-10-27" },
   { url: "/engineering-tools/battery-backup-calculator", changefreq: "monthly", priority: 0.8, lastmod: "2026-10-27" },
   { url: "/cgpa-converter", changefreq: "monthly", priority: 0.8, lastmod: "2026-10-27" },
   { url: "/aggregate-score-calculator", changefreq: "monthly", priority: 0.9, lastmod: "2026-10-27" },
   { url: "/jamb-cbt-practice", changefreq: "monthly", priority: 0.9, lastmod: "2026-10-27" },
  // Slugs mirror SUBJECTS in the client's src/utils/cbt/index.js.
  ...["mathematics", "physics", "chemistry", "biology"].map((slug) => ({
    url: `/jamb-cbt-practice/${slug}`, changefreq: "monthly", priority: 0.8, lastmod: "2026-10-27"
  })),
  // Slugs mirror UNIVERSITIES in the client's src/utils/aggregate.js.
   ...["unilag", "ui", "oau", "unn", "uniben", "uniport", "unilorin", "lasu", "abu", "unical"].map((slug) => ({
     url: `/aggregate-score-calculator/${slug}`, changefreq: "monthly", priority: 0.8, lastmod: "2026-10-27"
   })),

   { url: "/study-planner", changefreq: "weekly", priority: 0.7 },
   { url: "/scholarships", changefreq: "weekly", priority: 0.7 },

   { url: "/admission-predictor", changefreq: "monthly", priority: 0.7 },
   { url: "/ai-tutor", changefreq: "weekly", priority: 0.7 },
   { url: "/tutorials/math-calculator", changefreq: "weekly", priority: 0.7 },
   { url: "/quiz", changefreq: "weekly", priority: 0.7 },
   { url: "/marketplace", changefreq: "daily", priority: 0.8 },

   { url: "/about", changefreq: "yearly", priority: 0.5 },
   { url: "/contact", changefreq: "yearly", priority: 0.5 },
   { url: "/privacy-policy", changefreq: "yearly", priority: 0.3 },
   { url: "/terms", changefreq: "yearly", priority: 0.3 },
   { url: "/author", changefreq: "yearly", priority: 0.5 }
  ];

  // lastmod must be the date the page's content last changed. Stamping "now"
  // on every request teaches Google to ignore our lastmod values entirely,
  // including the real ones on tutorials. Bump this (or set a per-page
  // lastmod) when these pages change.
  const STATIC_LASTMOD = "2026-10-24";

  staticPages.forEach((page) => {
   smStream.write({
    url: page.url,
    changefreq: page.changefreq,
    priority: page.priority,
    lastmod: page.lastmod || STATIC_LASTMOD
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

  // Publisher storefronts
  publishers.forEach(publisher => {
   if (!publisher.slug) return;

   smStream.write({
    url: `/publishers/${publisher.slug}`,
    changefreq: "weekly",
    priority: 0.7,
    lastmod: publisher.updatedAt || publisher.createdAt
   });
  });

  // Individual published listings — a listing's publisher may have been
  // suspended after the listing was published, so only emit a listing
  // URL when its publisher is still active too.
  listings.forEach(listing => {
   const publisher = publisherById.get(String(listing.publisher));
   if (!publisher || !listing.slug) return;

   smStream.write({
    url: `/publishers/${publisher.slug}/${listing.slug}`,
    changefreq: "weekly",
    priority: 0.75,
    lastmod: listing.updatedAt || listing.createdAt
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
