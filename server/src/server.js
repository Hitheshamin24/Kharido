import app from "./app/app.js";
import { config } from "./config/config.js";
import { connectDB } from "./config/db.js";

await connectDB()
app.listen(config.PORT, () => {
  console.log(`server running on port ${config.PORT}`);
});
