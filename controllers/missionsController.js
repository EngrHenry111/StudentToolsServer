import { getMissionsStatus } from "../services/dailyMissionsService.js";

export const getTodaysMissions = async (req, res) => {
  try {
    const missions = await getMissionsStatus(req.user._id);
    res.json(missions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
