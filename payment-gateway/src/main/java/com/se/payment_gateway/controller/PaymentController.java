package com.se.payment_gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.se.payment_gateway.kafka.service.PaymentEventProducer;
import com.se.payment_gateway.service.RazorpayService;

@RestController
@RequestMapping("/api/payment-gateway")
public class PaymentController {

    private final RazorpayService razorpayService;
    private final PaymentEventProducer paymentEventProducer;

    public PaymentController(RazorpayService razorpayService, PaymentEventProducer paymentEventProducer) {
        this.razorpayService = razorpayService;
        this.paymentEventProducer = paymentEventProducer;
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
            @RequestHeader("Authorization") String jwtToken
    ) {
        boolean isValid = razorpayService.verifyPayment(orderId, paymentId, signature);

        if (isValid) {
            try {
                // Pass all Razorpay details along with the JWT token
                paymentEventProducer.sendPaymentVerificationEvent(jwtToken, orderId, paymentId, signature);
                return ResponseEntity.ok("Payment Verified and Premium Request Submitted");
            } catch (Exception e) {
                System.out.println("Inside catch ----------------");
                System.out.println("Error : "+e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Failed to process premium request: " + e.getMessage());
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Payment Verification Failed");
        }
    }
}