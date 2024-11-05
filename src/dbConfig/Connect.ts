import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {}


async function Connect(): Promise<void> {
    if(connection.isConnected){
        console.log("Already Connected to the database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "", {});

        connection.isConnected = db.connections[0].readyState;

        console.log("Database sucessfully connected");
    } catch (error) {
        console.error("Database connection failed", error);
        process.exit(1);
    }
}

export default Connect;