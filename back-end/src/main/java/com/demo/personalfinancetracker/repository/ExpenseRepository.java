// ExpenseRepository.java
package com.demo.personalfinancetracker.repository;

import com.demo.personalfinancetracker.auth.model.User;
import com.demo.personalfinancetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUser(User user);
    List<Expense> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);
    Optional<Expense> findByIdAndUser(Long id, User user);
}
