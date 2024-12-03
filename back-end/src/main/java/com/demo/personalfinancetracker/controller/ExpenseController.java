// ExpenseController.java
package com.demo.personalfinancetracker.controller;

import com.demo.personalfinancetracker.auth.model.User;
import com.demo.personalfinancetracker.model.Expense;
import com.demo.personalfinancetracker.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/expenses")
public class ExpenseController {
    @Autowired
    private ExpenseService expenseService;

    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return expenseService.addExpense(expense, user);
    }

    @GetMapping
    public List<Expense> getExpenses(@RequestParam(required = false) LocalDate startDate,
                                     @RequestParam(required = false) LocalDate endDate) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return expenseService.getExpenses(user, startDate, endDate);
    }

    @GetMapping("/total")
    public Double getTotalAmount(@RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return expenseService.getTotalAmount(user, startDate, endDate);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense expenseDetails) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Expense updatedExpense = expenseService.updateExpense(id, expenseDetails, user);
        return ResponseEntity.ok(updatedExpense);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteExpense(@PathVariable Long id) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean deleted = expenseService.deleteExpense(id, user);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", deleted);
        return ResponseEntity.ok(response);
    }
}
