import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  // Not required anymore — a Google Sign-In user may never set a
  // password at all. Enforced conditionally instead: required only
  // when authProvider is "local" (see validator below).
  password: {
    type: String,
    required: function () {
      return this.authProvider === "local";
    }
  },

  // How this account was created / how it can log in. A user who
  // registered with email/password and later also signs in with Google
  // (same email) keeps authProvider "local" but gains a googleId too —
  // both paths then resolve to the same single account.
  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local"
  },

  googleId: {
    type: String,
    default: null,
    unique: true,
    sparse: true // allows many docs with googleId: null without a unique-index collision
  },

  // ---------------- PASSWORD RESET ----------------
  resetPasswordToken: {
    type: String,
    default: null
  },

  resetPasswordExpires: {
    type: Date,
    default: null
  },

  isVerified: {
  type: Boolean,
  default: false
},

refreshToken: {
  type: String,
  default: null
},

tokenVersion: {
  type: Number,
  default: 0
},

subscriptionCode: {
  type: String,
  default: null
},

// Paystack's per-subscription email token, required (along with the
// subscription code) to disable a subscription via their API.
subscriptionEmailToken: {
  type: String,
  default: null
},

// Prevents someone from cancelling and resubscribing repeatedly to keep
// reusing the launch discount — once true, they always pay full price.
usedLaunchOffer: {
  type: Boolean,
  default: false
},

// ---------------- REFERRAL SYSTEM ----------------
// Deliberately rewards with XP, not temporary Pro time — a time-limited
// Pro grant would need a background job to revoke it later, which is
// infrastructure we've intentionally deferred. XP has no expiry to
// manage and still gives a genuine, visible incentive via the
// leaderboard.
referralCode: {
  type: String,
  unique: true,
  sparse: true
},

referredBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null
},

referralCount: {
  type: Number,
  default: 0
},

// ---------------- NOTIFICATION PREFERENCES ----------------
notificationPreferences: {
  streakReminders: { type: Boolean, default: true }
},

subscriptionStatus: {
  type: String,
  default: "inactive" // active, cancelled
},

nextBillingDate: {
  type: Date,
  default: null
},
freeQuizCount: {
  type: Number,
  default: 0
},

lastQuizDate: {
  type: Date,
  default: null
},

isPremium: {
  type: Boolean,
  default: false
},

aiQuizAttempts: {
  type: Number,
  default: 0
},

// ---------------- CAMPUS / INSTITUTION PROFILE ----------------
// Deliberately simple, not a hard foreign-key relationship — a student
// picks an institution slug from the seeded list, OR types a free-text
// name if their institution isn't listed yet ("Other"). This keeps the
// platform genuinely open to any university, not locked to Miva.
campus: {
  institutionSlug: { type: String, default: null }, // e.g. "miva", or null if "Other"/unset
  institutionName: { type: String, default: null },  // always set once onboarded, even for "Other"
  school: { type: String, default: null },
  programme: { type: String, default: null },
  level: { type: String, default: null },
  onboarded: { type: Boolean, default: false }
},

}, { timestamps: true });

// Auto-generates a unique, shareable referral code on first save —
// based on the username so it's memorable, with a short random suffix
// to guarantee uniqueness even for common usernames.
userSchema.pre("save", async function (next) {
  if (!this.referralCode) {
    const base = (this.username || "student").replace(/[^a-zA-Z0-9]/g, "").slice(0, 12).toUpperCase();
    let candidate;
    let exists = true;

    while (exists) {
      const suffix = Math.floor(1000 + Math.random() * 9000);
      candidate = `${base}${suffix}`;
      exists = await mongoose.models.User.findOne({ referralCode: candidate });
    }

    this.referralCode = candidate;
  }
  next();
});

export default mongoose.model("User", userSchema);