package com.se.air_data;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AirDataApplication {

	public static void main(String[] args) {
		SpringApplication.run(AirDataApplication.class, args);
	}

}
