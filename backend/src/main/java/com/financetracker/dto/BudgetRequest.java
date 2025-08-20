package com.financetracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;

public class BudgetRequest {
    @NotBlank
    private String category;
    
    @NotNull
    @DecimalMin(value = "0.0")
    private BigDecimal budgetLimit;
    
    @NotNull
    private Integer month;
    
    @NotNull
    private Integer year;
    
    public BudgetRequest() {}
    
    public BudgetRequest(String category, BigDecimal budgetLimit, Integer month, Integer year) {
        this.category = category;
        this.budgetLimit = budgetLimit;
        this.month = month;
        this.year = year;
    }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public BigDecimal getBudgetLimit() { return budgetLimit; }
    public void setBudgetLimit(BigDecimal budgetLimit) { this.budgetLimit = budgetLimit; }
    
    public Integer getMonth() { return month; }
    public void setMonth(Integer month) { this.month = month; }
    
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
}
