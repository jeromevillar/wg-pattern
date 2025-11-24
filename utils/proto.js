const protobuf = require("protobufjs");
const path = require("path");



exports.loadProto = async (path) => {
    try {
        const root = await protobuf.load(path);
        console.log("✅ Proto loaded successfully");
        return root;
    } catch (err) {
        console.error("❌ Failed to load proto:", err);
        throw err;
    }
}
