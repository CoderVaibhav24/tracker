// IncomeService.java
package com.demo.personalfinancetracker.service;

import com.demo.personalfinancetracker.auth.model.User;
import com.demo.personalfinancetracker.model.Income;
import com.demo.personalfinancetracker.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncomeService {

    @Autowired
    private IncomeRepository incomeRepository;

    public Income addIncome(Income income, User user) {
        income.setUser(user);
        return incomeRepository.save(income);
    }

    public List<Income> getAllIncome(User user) {
        return incomeRepository.findByUser(user);
    }

    public Income updateIncome(Long id, Income updatedIncome, User user) {
        Income income = incomeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Income not found"));
        income.setDescription(updatedIncome.getDescription());
        income.setAmount(updatedIncome.getAmount());
        income.setDate(updatedIncome.getDate());
        return incomeRepository.save(income);
    }

    public void deleteIncome(Long id, User user) {
        Income income = incomeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Income not found"));
        incomeRepository.delete(income);
    }
}
