import admin from "../config/firebaseAdmin.js";
import User from "../models/user.model.js";

export const sendMessageNotification = async (
    tokens,
    sender,
    chatId,
    message,
    userId = null
) => {
    try {
        if (!tokens || tokens.length === 0) {
            return { success: false, error: "No tokens" };
        }

        const tokenArray = Array.isArray(tokens) ? tokens : [tokens];

        const results = [];
        const invalidTokens = [];
        let successCount = 0;
        let failureCount = 0;

        for (const token of tokenArray) {
            try {
                const payload = {
                    token,
                    notification: {
                        title: `New message from ${sender}`,
                        body: message
                    },
                    webpush: {
                        fcmOptions: {
                            link: `${process.env.CLIENT_URL}/feed`
                        }
                    }
                };

                const res = await admin.messaging().send(payload);
                successCount++;
                results.push({ success: true, messageId: res });
            } catch (tokenError) {
                const errorCode = tokenError.code;
                if (errorCode === 'messaging/registration-token-not-registered' ||
                    errorCode === 'messaging/invalid-registration-token') {
                    invalidTokens.push(token);
                } else {
                    console.error(`Failed to send notification: ${tokenError.message}`);
                }
                failureCount++;
                results.push({ success: false, error: tokenError.message });
            }
        }

        // Clean up invalid tokens
        if (invalidTokens.length > 0 && userId) {
            try {
                await User.findByIdAndUpdate(userId, {
                    $pull: { fcmTokens: { $in: invalidTokens } }
                });
            } catch (cleanupError) {
                console.error("Error cleaning up tokens:", cleanupError.message);
            }
        }

        return {
            success: successCount > 0,
            successCount,
            failureCount,
            results
        };
    } catch (error) {
        console.error("Error in sendMessageNotification:", error.message);
        return { success: false, error: error.message };
    }
};