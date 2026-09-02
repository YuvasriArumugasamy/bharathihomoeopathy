import { demoBlogs } from './blogs';

export const initialAdminBlogs = demoBlogs.map((b, idx) => ({
  id: b.id,
  title: b.title,
  slug: b.slug,
  shortDescription: b.excerpt,
  content: b.content,
  featuredImage: b.image,
  category: b.category,
  tags: b.tags,
  author: b.author,
  status: idx === 0 ? "Published" : (idx === 1 ? "Published" : (idx === 2 ? "Scheduled" : "Draft")),
  publishDate: b.publishedAt,
  views: (idx + 1) * 34,
  isFeatured: b.featured,
  createdAt: b.publishedAt,
  updatedAt: b.publishedAt
}));

export const initialAdminBlogCategories = [
  { id: "bcat-1", name: "Homeopathy", description: "Homeopathic clinical guidance and principles", status: "Active" },
  { id: "bcat-2", name: "Wellness", description: "Holistic nutrition, habits and longevity", status: "Active" },
  { id: "bcat-3", name: "Healthy Living", description: "Seasonal adaptation and natural living", status: "Active" },
  { id: "bcat-4", name: "Lifestyle", description: "Stress management and daily balance", status: "Active" },
  { id: "bcat-5", name: "Clinic Updates", description: "Clinic events and announcements", status: "Active" },
  { id: "bcat-6", name: "Product Information", description: "Ingredient safety and dosage guidelines", status: "Active" }
];
