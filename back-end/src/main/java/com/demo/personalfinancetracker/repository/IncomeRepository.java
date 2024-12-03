// IncomeRepository.java
package com.demo.personalfinancetracker.repository;

import com.demo.personalfinancetracker.auth.model.User;
import com.demo.personalfinancetracker.model.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByUser(User user);
    Optional<Income> findByIdAndUser(Long id, User user);
}
