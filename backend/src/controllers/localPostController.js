const LocalPost = require('../models/LocalPost');
const { ApiError } = require('../utils/ApiError');

exports.getLocalPosts = async (req, res, next) => {
  try {
    const { city, postType, tags, page, limit } = req.validated || {};
    const filter = { isHidden: false };
    if (city) filter.city = new RegExp(city, 'i');
    if (postType) filter.postType = postType;
    if (tags && tags.length) filter.tags = { $in: tags };

    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      LocalPost.find(filter).populate('userId', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      LocalPost.countDocuments(filter)
    ]);
    res.json({ success: true, data: posts, total, page, limit });
  } catch (err) {
    next(err);
  }
};

exports.getLocalPostById = async (req, res, next) => {
  try {
    const post = await LocalPost.findOne({ _id: req.params.id, isHidden: false })
      .populate('userId', 'name');
    if (!post) return next(new ApiError(404, 'Post not found'));
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

exports.createLocalPost = async (req, res, next) => {
  try {
    const v = req.validated;
    const post = await LocalPost.create({
      userId: req.user._id,
      city: v.city,
      postType: v.postType,
      title: v.title,
      content: v.content,
      tags: v.tags || []
    });
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

exports.upvotePost = async (req, res, next) => {
  try {
    const post = await LocalPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    if (!post) return next(new ApiError(404, 'Post not found'));
    res.json({ success: true, data: { upvotes: post.upvotes } });
  } catch (err) {
    next(err);
  }
};
