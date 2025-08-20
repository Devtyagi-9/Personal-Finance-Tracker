package com.financetracker.service;

import com.financetracker.model.Budget;
import com.financetracker.model.User;
import com.financetracker.repository.BudgetRepository;
import com.financetracker.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {
    
    @Autowired
    private BudgetRepository budgetRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    public List<Budget> getAllBudgetsByUser(User user) {
        return budgetRepository.findByUserOrderByCategory(user);
    }
    
    public List<Budget> getBudgetsByUserAndMonth(User user, Integer month, Integer year) {
        return budgetRepository.findByUserAndMonthAndYear(user, month, year);
    }
    
    public Budget createOrUpdateBudget(Budget budget) {
        Optional<Budget> existingBudget = budgetRepository.findByUserAndCategoryAndMonthAndYear(
            budget.getUser(), budget.getCategory(), budget.getMonth(), budget.getYear());
        
        if (existingBudget.isPresent()) {
            Budget existing = existingBudget.get();
            existing.setBudgetLimit(budget.getBudgetLimit());
            return budgetRepository.save(existing);
        } else {
            // Calculate current spent amount for this category and month
            BigDecimal spentAmount = transactionRepository.sumExpenseAmountByCategoryAndMonth(
                budget.getUser(), budget.getCategory(), budget.getMonth(), budget.getYear());
            budget.setSpentAmount(spentAmount != null ? spentAmount : BigDecimal.ZERO);
            return budgetRepository.save(budget);
        }
    }
    
    public void deleteBudget(Long id) {
        budgetRepository.deleteById(id);
    }
    
    public void updateSpentAmount(User user, String category, BigDecimal amount, Integer month, Integer year) {
        Optional<Budget> budgetOpt = budgetRepository.findByUserAndCategoryAndMonthAndYear(user, category, month, year);
        
        if (budgetOpt.isPresent()) {
            Budget budget = budgetOpt.get();
            budget.setSpentAmount(budget.getSpentAmount().add(amount));
            budgetRepository.save(budget);
        }
    }
    
    public Budget getBudgetById(Long id) {
        return budgetRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Budget not found"));
    }
}
