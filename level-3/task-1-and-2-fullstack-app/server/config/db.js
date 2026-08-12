// server/config/db.js
import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[Database Error] Connection failure: ${error.message}`);
        process.exit(1);
    }
};

// Graceful shutdown listeners
process.on("SIGINT", async() => {
    await mongoose.connection.close();
    console.log("[Database] Mongoose connection closed via app termination");
    process.exit(0);
});