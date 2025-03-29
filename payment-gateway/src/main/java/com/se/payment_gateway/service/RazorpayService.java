package com.se.payment_gateway.service;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.razorpay.Order;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

@Service
public class RazorpayService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    public String createOrder(int amount) throws RazorpayException {
        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount * 100);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_" + System.currentTimeMillis());
        orderRequest.put("payment_capture", 1);

        Order order = client.orders.create(orderRequest);
        return order.toString();
    }

    public boolean verifyPayment(String orderId, String paymentId, String signature) {
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", orderId);
            options.put("razorpay_payment_id", paymentId);
            options.put("razorpay_signature", signature);
            
            return Utils.verifyPaymentSignature(options, keySecret);
        } catch (Exception e) {
            System.err.println("Payment verification failed: " + e.getMessage());
            return false;
        }
    }
    
    public Map<String, Object> getPaymentDetails(String paymentId) {
        Map<String, Object> paymentDetails = new HashMap<>();
        
        try {
            RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);
            Payment payment = razorpay.payments.fetch(paymentId);
            
            JSONObject paymentJson = payment.toJson();
            
            // Extract basic payment details
            if (paymentJson.has("id")) paymentDetails.put("id", paymentJson.getString("id"));
            if (paymentJson.has("amount")) paymentDetails.put("amount", paymentJson.getInt("amount"));
            if (paymentJson.has("currency")) paymentDetails.put("currency", paymentJson.getString("currency"));
            if (paymentJson.has("status")) paymentDetails.put("status", paymentJson.getString("status"));
            if (paymentJson.has("method")) paymentDetails.put("method", paymentJson.getString("method"));
            if (paymentJson.has("email")) paymentDetails.put("email", paymentJson.getString("email"));
            if (paymentJson.has("contact")) paymentDetails.put("contact", paymentJson.getString("contact"));
            
        } catch (RazorpayException e) {
            System.err.println("Error fetching payment details: " + e.getMessage());
        }
        
        return paymentDetails;
    }
}