package com.demo.personalfinancetracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
		"com.demo.personalfinancetracker",
		"com.demo.personalfinancetracker.auth"
})
public class PersonalfinancetrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(PersonalfinancetrackerApplication.class, args);
	}
}
