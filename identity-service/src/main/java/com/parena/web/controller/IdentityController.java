package com.parena.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/identity")
public class IdentityController {

    @GetMapping
    public String sayHello() {
        return "hello";
    }
}
