package com.maduraibiblecollege.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

  @GetMapping("/public")
  public String pub() { return "public ok"; }

  @PreAuthorize("hasRole('STUDENT')")
  @GetMapping("/student")
  public String student() { return "student ok"; }

  @PreAuthorize("hasRole('TEACHER')")
  @GetMapping("/teacher")
  public String teacher() { return "teacher ok"; }

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/admin")
  public String admin() { return "admin ok"; }
}
