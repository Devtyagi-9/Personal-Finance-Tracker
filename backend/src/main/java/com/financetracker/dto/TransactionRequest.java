package com.financetracker.dto;

import com.financetracker.model.Transaction;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionRequest {
    @NotBlank
    private String description;
    
    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal amount;
    
    @NotBlank
    private String category;
    
    @NotNull
    private LocalDate transactionDate;
    
    @NotNull
    private Transaction.TransactionType type;
    
    private String notes;
    
    public TransactionRequest() {}
    
    public TransactionRequest(String description, BigDecimal amount, String category, 
                             LocalDate transactionDate, Transaction.TransactionType type, String notes) {
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.transactionDate = transactionDate;
        this.type = type;
        this.notes = notes;
    }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }
    
    public Transaction.TransactionType getType() { return type; }
    public void setType(Transaction.TransactionType type) { this.type = type; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
