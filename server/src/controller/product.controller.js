import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.services.js";

export const addProductsController = async (req, res) => {
  console.log(req.files);
  console.log(req.body);
  const filesUrl = [];
  for (let i = 0; i < req.files.length; i++) {
    const response = await uploadFile({
      buffer: req.files[i].buffer,
      fileName: req.files[i].originalname,
    });
    console.log(response);
    filesUrl.push(response.url);
  }
  const product = await productModel.create({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    sizes: req.body.sizes,
    images: filesUrl,
    sellers: req.user.userId,
  });
  return res.status(201).json({
    message: "product created successfully",
    product,
  });
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
        message: "product not found ",
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
    const product = await productModel.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true },
    );
    return res.status(200).json({
      message: "product updated Successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while fetching single product",
      error: error.message,
    });
  }
};

export const deleteProductController = async (req, res) => {
  const { id } = req.params;
  try {
    await productModel.findByIdAndDelete(id);
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
