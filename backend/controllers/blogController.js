import Blog from '../models/Blog.js';

export const getBlogs = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    } else if (!req.user || req.user.role !== 'admin') {
      filter.status = 'Published';
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({
      $or: [
        { slug: req.params.slug },
        { _id: req.params.slug.match(/^[0-9a-fA-F]{24}$/) ? req.params.slug : null }
      ]
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    blog.views = (blog.views || 0) + 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (req, res, next) => {
  try {
    const {
      title,
      content,
      excerpt = '',
      category = 'General Homeopathy',
      tags = [],
      author,
      coverImage = '',
      readTime = '4 min read',
      status = 'Published'
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      category,
      tags,
      author: author || { name: 'Dr. Bharathi', role: 'Chief Homeopathic Physician' },
      coverImage,
      readTime,
      status,
      views: 0,
      publishDate: new Date().toISOString().slice(0, 10)
    });

    res.status(201).json({
      success: true,
      message: 'Article created successfully and saved in MongoDB',
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const query = isMongoId ? { _id: req.params.id } : { $or: [{ slug: req.params.id }, { id: req.params.id }] };
    const blog = await Blog.findOneAndUpdate(query, req.body, { new: true });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Article updated in MongoDB',
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const query = isMongoId ? { _id: req.params.id } : { $or: [{ slug: req.params.id }, { id: req.params.id }] };
    const blog = await Blog.findOneAndDelete(query);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Article removed from MongoDB'
    });
  } catch (error) {
    next(error);
  }
};
