import mongoose from "mongoose";
import Tutorial from "./models/tutorialModel.js";

const cleanDuplicates = async () => {
 try {
  await mongoose.connect("YOUR_MONGO_URI");

  const tutorials = await Tutorial.find().sort({ createdAt: -1 });

  const seen = new Map();
  const duplicates = [];

  tutorials.forEach((t) => {
    // remove timestamp at end of slug
    const baseSlug = t.slug.replace(/-\d+$/, "");

    if (!seen.has(baseSlug)) {
      seen.set(baseSlug, t._id); // keep latest
    } else {
      duplicates.push(t._id); // mark duplicate
    }
  });

  console.log("Duplicates found:", duplicates.length);

  if (duplicates.length > 0) {
    await Tutorial.deleteMany({ _id: { $in: duplicates } });
    console.log("Duplicates removed successfully ✅");
  } else {
    console.log("No duplicates found 👍");
  }

  process.exit();

 } catch (error) {
  console.error(error);
  process.exit(1);
 }
};

cleanDuplicates();