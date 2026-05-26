import mongoose from 'mongoose';

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_CONNECTION);
        console.log("Connected to the database");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
};

export default dbConnect;