package com.se.payment_gateway.paymentTransaction;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "payment_transactions")
public class PaymentTransaction {
    @Id
    private String id;

    @Indexed
    private String emailId;
    
    private int amount;
    private LocalDateTime timestamp;
    private String status;
    
    // Razorpay specific fields
    @Indexed(unique = true)
    private String razorpayOrderId;
    
    @Indexed(unique = true)
    private String razorpayPaymentId;
    
    private String razorpaySignature;
    private String paymentMethod;
    private String currency;
    
	public PaymentTransaction() {
		super();
	}

	public PaymentTransaction(String id, String emailId, int amount, LocalDateTime timestamp, String status,
			String razorpayOrderId, String razorpayPaymentId, String razorpaySignature, String paymentMethod,
			String currency) {
		super();
		this.id = id;
		this.emailId = emailId;
		this.amount = amount;
		this.timestamp = timestamp;
		this.status = status;
		this.razorpayOrderId = razorpayOrderId;
		this.razorpayPaymentId = razorpayPaymentId;
		this.razorpaySignature = razorpaySignature;
		this.paymentMethod = paymentMethod;
		this.currency = currency;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public int getAmount() {
		return amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}

	public LocalDateTime getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getRazorpayOrderId() {
		return razorpayOrderId;
	}

	public void setRazorpayOrderId(String razorpayOrderId) {
		this.razorpayOrderId = razorpayOrderId;
	}

	public String getRazorpayPaymentId() {
		return razorpayPaymentId;
	}

	public void setRazorpayPaymentId(String razorpayPaymentId) {
		this.razorpayPaymentId = razorpayPaymentId;
	}

	public String getRazorpaySignature() {
		return razorpaySignature;
	}

	public void setRazorpaySignature(String razorpaySignature) {
		this.razorpaySignature = razorpaySignature;
	}

	public String getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	@Override
	public String toString() {
		return "PaymentTransaction [id=" + id + ", emailId=" + emailId + ", amount=" + amount + ", timestamp="
				+ timestamp + ", status=" + status + ", razorpayOrderId=" + razorpayOrderId + ", razorpayPaymentId="
				+ razorpayPaymentId + ", razorpaySignature=" + razorpaySignature + ", paymentMethod=" + paymentMethod
				+ ", currency=" + currency + "]";
	}
}