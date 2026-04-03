package com.akshaya.bank.repository;
import com.akshaya.bank.entity.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;
@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount,Long> {
    Optional<BankAccount> findByAccountNumber(String accountNumber);
    List<BankAccount> findByUserId(Long userId);
    boolean existsByAccountNumber(String accountNumber);
}
