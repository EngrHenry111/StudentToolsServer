import { SitemapStream, streamToPromise } from "sitemap";
import Tutorial from "../models/tutorialModel.js";

export const generateSitemap = async (req, res) => {

 try {

  const tutorials = await Tutorial.find();

  const smStream = new SitemapStream({
   hostname: "https://student-toolsngsch.vercel.app"
  });

  // Static pages
  const staticPages = [
   "/",
   "/tutorials",
   "/cgpa-calculator",
   "/waec-calculator",
   "/jamb-calculator",
   "/study-planner",
   "/scholarships",

    "/cgpa-calculator-nigeria",
    "/how-to-calculate-cgpa",
    "/waec-grading-system",
    "/jamb-score-calculator-nigeria",


   "/about",
   "/contact",
   "/privacy-policy",
   "/terms",
   "/author"
  ];

  staticPages.forEach(page => {
   smStream.write({
    url: page,
    changefreq: "weekly",
    priority: 0.8
   });
  });

  // Dynamic tutorial pages
  tutorials.forEach(tutorial => {
   smStream.write({
    url: `/tutorial/${tutorial.slug}`,
    changefreq: "weekly",
    priority: 0.7
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



// import { SitemapStream, streamToPromise } from "sitemap";
// import Tutorial from "../models/tutorialModel.js";

// export const generateSitemap = async (req, res) => {

//  try {

//   const tutorials = await Tutorial.find();

//   const sitemap = new SitemapStream({
//    hostname: "student-toolsngsch.vercel.app"
//   });

//   // Static pages
//   sitemap.write({ url: "/", changefreq: "daily", priority: 1 });
//   sitemap.write({ url: "/tutorials", changefreq: "weekly", priority: 0.8 });
//   sitemap.write({ url: "/about", changefreq: "monthly", priority: 0.5 });
//   sitemap.write({ url: "/contact", changefreq: "monthly", priority: 0.5 });
//   sitemap.write({ url: "/privacy-policy", changefreq: "monthly", priority: 0.3 });

//   // Dynamic tutorial pages
//   tutorials.forEach((tutorial) => {
//    sitemap.write({
//     url: `/tutorial/${tutorial.slug}`,
//     changefreq: "weekly",
//     priority: 0.7
//    });
//   });

//   sitemap.end();

//   const xml = await streamToPromise(sitemap);

//   res.header("Content-Type", "application/xml");
//   res.send(xml.toString());

//  } catch (error) {

//   res.status(500).json({
//    message: error.message
//   });

//  }

// };