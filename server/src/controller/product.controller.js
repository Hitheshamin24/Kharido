import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.services.js";

export const addProductsController = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "At least one product image is required",
      });
    }

    const filesUrl = await Promise.all(
      req.files.map(async (file) => {
        const response = await uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
        });
        return response.url;
      }),
    );

    const product = await productModel.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      sizes: req.body.sizes,
      images: filesUrl,
      seller: req.user.userId,
    });

    return res.status(201).json({
      message: "product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while creating product",
      error: error.message,
    });
  }
};

export const getAllProduct = async (req, res) => {
  try {
    const products = await productModel.find();
    return res.status(200).json({
      message: "all products fetched successfully",
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while fetching product",
      error: error.message,
    });
  }
};

export const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findById(id);
    if (!product)
      return res.status(404).json({
        message: "product not found",
      });
    return res.status(200).json({
      message: "product fetched successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while fetching single product",
      error: error.message,
    });
  }
};

export const updateProductController = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findOneAndUpdate(
      { _id: id, seller: req.user.userId },
      { $set: req.body },
      { new: true, runValidators: true },
    );
    if (!product)
      return res.status(404).json({
        message: "product not found or unauthorized",
      });
    return res.status(200).json({
      message: "product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while updating product",
      error: error.message,
    });
  }
};

export const deleteProductController = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findOneAndDelete({
      _id: id,
      seller: req.user.userId,
    });
    if (!product) {
      return res.status(404).json({
        message: "product not found or unauthorized",
      });
    }
    return res.status(200).json({
      message: "product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while deleting product",
      error: error.message,
    });
  }
};
