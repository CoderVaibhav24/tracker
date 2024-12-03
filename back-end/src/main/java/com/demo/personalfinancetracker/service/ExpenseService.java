// ExpenseService.java
package com.demo.personalfinancetracker.service;

import com.demo.personalfinancetracker.auth.model.User;
import com.demo.personalfinancetracker.exception.ResourceNotFoundException;
import com.demo.personalfinancetracker.model.Expense;
import com.demo.personalfinancetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseService {
    @Autowired
    private ExpenseRepository expenseRepository;

    public Expense addExpense(Expense expense, User user) {
        expense.setUser(user);
        return expenseRepository.save(expense);
    }

    public List<Expense> getExpenses(User user, LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null) {
            return expenseRepository.findByUserAndDateBetween(user, startDate, endDate);
        }
        return expenseRepository.findByUser(user);
    }

    public Double getTotalAmount(User user, LocalDate startDate, LocalDate endDate) {
        List<Expense> expenses = expenseRepository.findByUserAndDateBetween(user, startDate, endDate);
        return expenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();
    }

    public boolean deleteExpense(Long id, User user) {
        Expense expense = expenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found for this id :: " + id));
        expenseRepository.delete(expense);
        return true;
    }

    public Expense updateExpense(Long id, Expense expenseDetails, User user) {
        Expense expense = expenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found for this id :: " + id));
        expense.setDescription(expenseDetails.getDescription());
        expense.setAmount(expenseDetails.getAmount());
        expense.setDate(expenseDetails.getDate());
        return expenseRepository.save(expense);
    }
}
