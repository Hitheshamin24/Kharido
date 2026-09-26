import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minLength: 20,
    maxLength: 500,
  },
  images: {
    type: [
      {
        type: String,
      },
    ],
    validate: {
      validator: (images) => images.length <= 5,
      message: "A product should max 5 images ",
    },
    price: {
      type: Number,
      required: true,
    },
    sizes: [
      {
        size: {
          type: String,
          enum: ["XS", "S", "M", "L", "XL", "XXL"],
          required: true,
        },
        stock: {
          type: Number,
          min: 0,
          default: 0,
        },
      },
    ],
    seller: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
});


const productModel=mongoose.model("products",productSchema)
export default productModel