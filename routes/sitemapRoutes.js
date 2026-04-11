import express from "express";
import { generateSitemap } from "../controllers/sitemapController.js";

const router = express.Router();

router.get("/sitemap", generateSitemap);


export default router;



// import express from "express";
// import { generateSitemap } from "../controllers/sitemapController.js";

// const router = express.Router();

// router.get("/sitemap.xml", generateSitemap);

// export default router;