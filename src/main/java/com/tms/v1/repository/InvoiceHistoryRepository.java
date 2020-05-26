package com.tms.v1.repository;

import com.tms.v1.domain.InvoiceHistory;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the InvoiceHistory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InvoiceHistoryRepository extends JpaRepository<InvoiceHistory, Long> {
}
