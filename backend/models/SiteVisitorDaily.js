import mongoose from 'mongoose';

const siteVisitorDailySchema = new mongoose.Schema(
  {
    visit_date: {
      type: String, // 'YYYY-MM-DD'
      required: true,
      index: true,
    },
    visitor_key: {
      type: String,
      required: true,
      index: true,
    },
    page_views: {
      type: Number,
      default: 1,
    },
    last_seen: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index ensuring 1 unique visitor record per day
siteVisitorDailySchema.index({ visit_date: 1, visitor_key: 1 }, { unique: true });

const SiteVisitorDaily = mongoose.model('SiteVisitorDaily', siteVisitorDailySchema);

export default SiteVisitorDaily;

