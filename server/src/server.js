import app from "./app/app.js";
import { connectDB } from "./config/db.js";

connectDB();

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running locally on port ${PORT}`);
  });
}

export default app;