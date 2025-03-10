package com.se.payment_gateway.controller;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.se.payment_gateway.service.RazorpayService;

@RestController
@RequestMapping("/api/payment-gateway")
public class PaymentController {

    private final RazorpayService razorpayService;

    public PaymentController(RazorpayService razorpayService) {
        this.razorpayService = razorpayService;
    }

    @PostMapping("/create-order")
    public String createOrder(@RequestParam("amount") int amount) {
        try {
            System.out.println("Amount=--------- "+amount);
            return razorpayService.createOrder(amount);
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @RequestParam("orderId") String orderId,
            @RequestParam("paymentId") String paymentId,
            @RequestParam("signature") String signature,
            @RequestHeader("Authorization") String jwtToken // Extract JWT token from the header
    ) {
        boolean isValid = razorpayService.verifyPayment(orderId, paymentId, signature);

        if (isValid) {
            try {
                markUserAsPremium(jwtToken); // Pass the JWT token to mark the user as premium
                return ResponseEntity.ok("Payment Verified and User Marked as Premium");
            } catch (Exception e) {
            	System.out.println("Inside catch ----------------");
            	System.out.println("Error : "+e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Failed to mark user as premium: " + e.getMessage());
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Payment Verification Failed");
        }
    }
    
    public void markUserAsPremium(String jwtToken) {
        String userServiceUrl = "http://localhost/api/mark-premium";
        
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(userServiceUrl))
                .method("PATCH", HttpRequest.BodyPublishers.ofString("{}"))
                .header("Authorization", jwtToken)
                .header("Content-Type", "application/json")
                .build();
                
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() == 200) {
                System.out.println("User marked as premium successfully!");
            } else {
                System.out.println("Failed to mark user as premium. Response code: " + response.statusCode());
                System.out.println("Response body: " + response.body());
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error marking user as premium: " + e.getMessage());
        }
    }
}