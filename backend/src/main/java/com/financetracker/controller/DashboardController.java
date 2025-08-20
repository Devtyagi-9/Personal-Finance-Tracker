package com.financetracker.controller;

import com.financetracker.dto.DashboardResponse;
import com.financetracker.model.User;
import com.financetracker.repository.UserRepository;
import com.financetracker.service.TransactionService;
import com.financetracker.service.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DashboardController {
    
    @Autowired
    private TransactionService transactionService;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboardData(Authentication authentication) {
        User user = getCurrentUser(authentication);
        
        BigDecimal totalIncome = transactionService.getTotalIncomeByUser(user);
        BigDecimal totalExpenses = transactionService.getTotalExpensesByUser(user);
        BigDecimal balance = totalIncome.add(totalExpenses); // expenses are negative
        
        Double savingsRate = 0.0;
        if (totalIncome.compareTo(BigDecimal.ZERO) > 0) {
            savingsRate = balance.divide(totalIncome, 4, RoundingMode.HALF_UP)
                               .multiply(BigDecimal.valueOf(100))
                               .doubleValue();
        }
        
        DashboardResponse response = new DashboardResponse(totalIncome, totalExpenses, balance, savingsRate);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<DashboardResponse> getDashboardDataByDateRange(
            Authentication authentication,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        User user = getCurrentUser(authentication);
        
        BigDecimal totalIncome = transactionService.getTotalIncomeByUserAndDateRange(user, startDate, endDate);
        BigDecimal totalExpenses = transactionService.getTotalExpensesByUserAndDateRange(user, startDate, endDate);
        BigDecimal balance = totalIncome.add(totalExpenses); // expenses are negative
        
        Double savingsRate = 0.0;
        if (totalIncome.compareTo(BigDecimal.ZERO) > 0) {
            savingsRate = balance.divide(totalIncome, 4, RoundingMode.HALF_UP)
                               .multiply(BigDecimal.valueOf(100))
                               .doubleValue();
        }
        
        DashboardResponse response = new DashboardResponse(totalIncome, totalExpenses, balance, savingsRate);
        return ResponseEntity.ok(response);
    }
    
    private User getCurrentUser(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return userRepository.findById(userPrincipal.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
