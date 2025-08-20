package com.financetracker.controller;

import com.financetracker.dto.TransactionRequest;
import com.financetracker.model.Transaction;
import com.financetracker.model.User;
import com.financetracker.repository.UserRepository;
import com.financetracker.service.TransactionService;
import com.financetracker.service.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TransactionController {
    
    @Autowired
    private TransactionService transactionService;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions(Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<Transaction> transactions = transactionService.getAllTransactionsByUser(user);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<Transaction>> getTransactionsByDateRange(
            Authentication authentication,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        User user = getCurrentUser(authentication);
        List<Transaction> transactions = transactionService.getTransactionsByUserAndDateRange(user, startDate, endDate);
        return ResponseEntity.ok(transactions);
    }
    
    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@Valid @RequestBody TransactionRequest transactionRequest,
                                                       Authentication authentication) {
        User user = getCurrentUser(authentication);
        
        Transaction transaction = new Transaction(
            transactionRequest.getDescription(),
            transactionRequest.getAmount(),
            transactionRequest.getCategory(),
            transactionRequest.getTransactionDate(),
            transactionRequest.getType(),
            transactionRequest.getNotes(),
            user
        );
        
        Transaction savedTransaction = transactionService.createTransaction(transaction);
        return ResponseEntity.ok(savedTransaction);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Long id,
                                                       @Valid @RequestBody TransactionRequest transactionRequest,
                                                       Authentication authentication) {
        User user = getCurrentUser(authentication);
        
        Transaction updatedTransaction = new Transaction(
            transactionRequest.getDescription(),
            transactionRequest.getAmount(),
            transactionRequest.getCategory(),
            transactionRequest.getTransactionDate(),
            transactionRequest.getType(),
            transactionRequest.getNotes(),
            user
        );
        
        Transaction savedTransaction = transactionService.updateTransaction(id, updatedTransaction);
        return ResponseEntity.ok(savedTransaction);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.ok().build();
    }
    
    private User getCurrentUser(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return userRepository.findById(userPrincipal.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
