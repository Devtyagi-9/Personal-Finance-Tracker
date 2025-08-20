package com.financetracker.controller;

import com.financetracker.dto.BudgetRequest;
import com.financetracker.model.Budget;
import com.financetracker.model.User;
import com.financetracker.repository.UserRepository;
import com.financetracker.service.BudgetService;
import com.financetracker.service.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BudgetController {
    
    @Autowired
    private BudgetService budgetService;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<List<Budget>> getAllBudgets(Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<Budget> budgets = budgetService.getAllBudgetsByUser(user);
        return ResponseEntity.ok(budgets);
    }
    
    @GetMapping("/month/{month}/year/{year}")
    public ResponseEntity<List<Budget>> getBudgetsByMonth(
            @PathVariable Integer month,
            @PathVariable Integer year,
            Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<Budget> budgets = budgetService.getBudgetsByUserAndMonth(user, month, year);
        return ResponseEntity.ok(budgets);
    }
    
    @PostMapping
    public ResponseEntity<Budget> createOrUpdateBudget(@Valid @RequestBody BudgetRequest budgetRequest,
                                                      Authentication authentication) {
        User user = getCurrentUser(authentication);
        
        Budget budget = new Budget(
            budgetRequest.getCategory(),
            budgetRequest.getBudgetLimit(),
            budgetRequest.getMonth(),
            budgetRequest.getYear(),
            user
        );
        
        Budget savedBudget = budgetService.createOrUpdateBudget(budget);
        return ResponseEntity.ok(savedBudget);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(@PathVariable Long id,
                                              @Valid @RequestBody BudgetRequest budgetRequest,
                                              Authentication authentication) {
        User user = getCurrentUser(authentication);
        
        Budget existingBudget = budgetService.getBudgetById(id);
        existingBudget.setCategory(budgetRequest.getCategory());
        existingBudget.setBudgetLimit(budgetRequest.getBudgetLimit());
        existingBudget.setMonth(budgetRequest.getMonth());
        existingBudget.setYear(budgetRequest.getYear());
        
        Budget savedBudget = budgetService.createOrUpdateBudget(existingBudget);
        return ResponseEntity.ok(savedBudget);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.ok().build();
    }
    
    private User getCurrentUser(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return userRepository.findById(userPrincipal.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
