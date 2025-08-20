package com.financetracker.dto;

import java.math.BigDecimal;

public class DashboardResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal balance;
    private Double savingsRate;
    
    public DashboardResponse() {}
    
    public DashboardResponse(BigDecimal totalIncome, BigDecimal totalExpenses, BigDecimal balance, Double savingsRate) {
        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        this.balance = balance;
        this.savingsRate = savingsRate;
    }
    
    public BigDecimal getTotalIncome() { return totalIncome; }
    public void setTotalIncome(BigDecimal totalIncome) { this.totalIncome = totalIncome; }
    
    public BigDecimal getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(BigDecimal totalExpenses) { this.totalExpenses = totalExpenses; }
    
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    
    public Double getSavingsRate() { return savingsRate; }
    public void setSavingsRate(Double savingsRate) { this.savingsRate = savingsRate; }
}
