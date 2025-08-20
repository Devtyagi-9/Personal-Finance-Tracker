package com.financetracker.repository;

import com.financetracker.model.Budget;
import com.financetracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserOrderByCategory(User user);
    
    List<Budget> findByUserAndMonthAndYear(User user, Integer month, Integer year);
    
    Optional<Budget> findByUserAndCategoryAndMonthAndYear(User user, String category, Integer month, Integer year);
}
