package com.se.payment_gateway;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.core.KafkaTemplate;

@SpringBootTest
class PaymentGatewayApplicationTests {
	
	@Mock
	private KafkaTemplate<String, String> kafkaTemplate;

	@Test
	void contextLoads() {
		System.out.println("Chalega");
	}

}
