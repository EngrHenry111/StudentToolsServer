import Institution from "../models/Institution.js";
import User from "../models/User.js";

// ---------------- PUBLIC ----------------

export const listInstitutions = async (req, res) => {
  try {
    const institutions = await Institution.find({ active: true }).sort({ name: 1 });
    res.json(institutions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- STUDENT: save their own campus profile ----------------

export const saveCampusProfile = async (req, res) => {
  try {
    const { institutionSlug, institutionName, school, programme, level } = req.body;

    if (!programme) {
      return res.status(400).json({ message: "Programme is required" });
    }

    // "Other" path: institutionSlug is null, but they typed a name —
    // this is what keeps the platform open to any university, not
    // locked to only the ones we've seeded so far.
    let resolvedName = institutionName;

    if (institutionSlug) {
      const institution = await Institution.findOne({ slug: institutionSlug, active: true });
      if (!institution) {
        return res.status(400).json({ message: "Unknown institution" });
      }
      resolvedName = institution.name;
    }

    if (!resolvedName) {
      return res.status(400).json({ message: "Institution name is required" });
    }

    req.user.campus = {
      institutionSlug: institutionSlug || null,
      institutionName: resolvedName,
      school: school || null,
      programme,
      level: level || null,
      onboarded: true
    };

    await req.user.save();

    res.json({ message: "Campus profile saved", campus: req.user.campus });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- ADMIN: manage institutions ----------------

export const adminCreateInstitution = async (req, res) => {
  try {
    const { name, slug, schools } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: "name and slug are required" });
    }

    const institution = await Institution.create({ name, slug, schools: schools || [] });
    res.status(201).json(institution);

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "An institution with that slug already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};

export const adminListInstitutions = async (req, res) => {
  try {
    const institutions = await Institution.find().sort({ name: 1 });
    res.json(institutions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminUpdateInstitution = async (req, res) => {
  try {
    const updated = await Institution.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Institution not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminDeleteInstitution = async (req, res) => {
  try {
    const deleted = await Institution.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Institution not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
