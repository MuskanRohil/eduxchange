package com.eduxchange.eduxchange;

import com.eduxchange.eduxchange.security.JwtUtil;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class EduxchangeApplication {

	public static void main(String[] args) { SpringApplication.run(EduxchangeApplication.class, args);
	}

	@Bean
	public JwtUtil jwtUtil(){
		return new JwtUtil();
	}
}
