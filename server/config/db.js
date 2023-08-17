import mongoose from "mongoose";

const connectDB =  async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("conn.connection.host:", conn.connection.host); // (https://chat.openai.com/c/207d0c8e-97d1-4067-ae34-004533663cd0)
    } catch (error) {
        console.log("error db: ", error)
    }
}

export default connectDB