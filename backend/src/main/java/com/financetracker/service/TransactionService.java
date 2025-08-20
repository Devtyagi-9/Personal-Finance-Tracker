package com.financetracker.service;

import com.financetracker.model.Transaction;
import com.financetracker.model.User;
import com.financetracker.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private BudgetService budgetService;
    
    public List<Transaction> getAllTransactionsByUser(User user) {
        return transactionRepository.findByUserOrderByTransactionDateDesc(user);
    }
    
    public List<Transaction> getTransactionsByUserAndDateRange(User user, LocalDate startDate, LocalDate endDate) {
        return transactionRepository.findByUserAndTransactionDateBetweenOrderByTransactionDateDesc(user, startDate, endDate);
    }
    
    public Transaction createTransaction(Transaction transaction) {
        Transaction savedTransaction = transactionRepository.save(transaction);
        
        // Update budget spent amount if it's an expense
        if (transaction.getType() == Transaction.TransactionType.EXPENSE) {
            budgetService.updateSpentAmount(
                transaction.getUser(),
                transaction.getCategory(),
                transaction.getAmount(),
                transaction.getTransactionDate().getMonthValue(),
                transaction.getTransactionDate().getYear()
            );
        }
        
        return savedTransaction;
    }
    
    public Transaction updateTransaction(Long id, Transaction updatedTransaction) {
        Transaction existingTransaction = transactionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        // If the transaction type, amount, or category changed, update budget accordingly
        if (existingTransaction.getType() == Transaction.TransactionType.EXPENSE) {
            // Subtract old amount from budget
            budgetService.updateSpentAmount(
                existingTransaction.getUser(),
                existingTransaction.getCategory(),
                existingTransaction.getAmount().negate(),
                existingTransaction.getTransactionDate().getMonthValue(),
                existingTransaction.getTransactionDate().getYear()
            );
        }
        
        existingTransaction.setDescription(updatedTransaction.getDescription());
        existingTransaction.setAmount(updatedTransaction.getAmount());
        existingTransaction.setCategory(updatedTransaction.getCategory());
        existingTransaction.setTransactionDate(updatedTransaction.getTransactionDate());
        existingTransaction.setType(updatedTransaction.getType());
        existingTransaction.setNotes(updatedTransaction.getNotes());
        
        Transaction saved = transactionRepository.save(existingTransaction);
        
        // Add new amount to budget if it's an expense
        if (saved.getType() == Transaction.TransactionType.EXPENSE) {
            budgetService.updateSpentAmount(
                saved.getUser(),
                saved.getCategory(),
                saved.getAmount(),
                saved.getTransactionDate().getMonthValue(),
                saved.getTransactionDate().getYear()
            );
        }
        
        return saved;
    }
    
    public void deleteTransaction(Long id) {
        Transaction transaction = transactionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        // If it's an expense, subtract from budget spent amount
        if (transaction.getType() == Transaction.TransactionType.EXPENSE) {
            budgetService.updateSpentAmount(
                transaction.getUser(),
                transaction.getCategory(),
                transaction.getAmount().negate(),
                transaction.getTransactionDate().getMonthValue(),
                transaction.getTransactionDate().getYear()
            );
        }
        
        transactionRepository.deleteById(id);
    }
    
    public BigDecimal getTotalIncomeByUser(User user) {
        BigDecimal income = transactionRepository.sumAmountByUserAndType(user, Transaction.TransactionType.INCOME);
        return income != null ? income : BigDecimal.ZERO;
    }
    
    public BigDecimal getTotalExpensesByUser(User user) {
        BigDecimal expenses = transactionRepository.sumAmountByUserAndType(user, Transaction.TransactionType.EXPENSE);
        return expenses != null ? expenses : BigDecimal.ZERO;
    }
    
    public BigDecimal getTotalIncomeByUserAndDateRange(User user, LocalDate startDate, LocalDate endDate) {
        BigDecimal income = transactionRepository.sumAmountByUserAndTypeAndDateBetween(
            user, Transaction.TransactionType.INCOME, startDate, endDate);
        return income != null ? income : BigDecimal.ZERO;
    }
    
    public BigDecimal getTotalExpensesByUserAndDateRange(User user, LocalDate startDate, LocalDate endDate) {
        BigDecimal expenses = transactionRepository.sumAmountByUserAndTypeAndDateBetween(
            user, Transaction.TransactionType.EXPENSE, startDate, endDate);
        return expenses != null ? expenses : BigDecimal.ZERO;
    }
}
