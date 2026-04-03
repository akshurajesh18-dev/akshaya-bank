package com.akshaya.bank.repository;
import com.akshaya.bank.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface TransactionRepository extends JpaRepository<Transaction,Long> {
    List<Transaction> findByAccountIdOrderByCreatedAtDesc(Long accountId);
    List<Transaction> findTop10ByAccountIdOrderByCreatedAtDesc(Long accountId);
    @Query("SELECT t FROM Transaction t WHERE t.account.user.id=:userId ORDER BY t.createdAt DESC")
    List<Transaction> findAllByUserId(Long userId);
}
