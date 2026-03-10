import HeroImage from "../models/heroImageModel.js";

export const getHeroImages = async (req, res) => {
  try {
    const heroImage = await HeroImage.findOne().sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      heroImages: heroImage || { images: [] },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch hero images",
      error: error.message,
    });
  }
};

export const uploadHeroImages = async (req, res) => {
  try {
    const uploaded = Array.isArray(req.files) ? req.files : [];
    const imageUrls = uploaded.map((file) => file.path).filter(Boolean).slice(0, 3);

    if (imageUrls.length !== 3) {
      return res.status(400).json({
        success: false,
        message: "Please upload exactly 3 images",
      });
    }

    let heroImage = await HeroImage.findOne();
    if (!heroImage) {
      heroImage = await HeroImage.create({
        images: imageUrls,
        createdBy: req.user?._id || null,
      });
    } else {
      heroImage.images = imageUrls;
      heroImage.createdBy = req.user?._id || heroImage.createdBy;
      await heroImage.save();
    }

    return res.status(200).json({
      success: true,
      message: "Hero images updated successfully",
      heroImages: heroImage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload hero images",
      error: error.message,
    });
  }
};
