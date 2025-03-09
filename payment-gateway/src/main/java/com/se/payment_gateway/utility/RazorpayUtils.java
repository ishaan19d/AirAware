package com.se.payment_gateway.utility;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class RazorpayUtils {

    private static final String HMAC_SHA256 = "HmacSHA256";

    public static boolean verifySignature(String orderId, String paymentId, String signature, String secret) {
        try {
            String data = orderId + "|" + paymentId; // Concatenating orderId and paymentId
            Mac mac = Mac.getInstance(HMAC_SHA256);
            mac.init(new SecretKeySpec(secret.getBytes("UTF-8"), HMAC_SHA256));
            byte[] hash = mac.doFinal(data.getBytes("UTF-8"));

            // Convert byte array to hexadecimal string
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0'); // Pad with leading zero if needed
                hexString.append(hex);
            }
            String expectedSignature = hexString.toString();

            return expectedSignature.equals(signature);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}