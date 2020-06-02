package com.tms.v1.repository;

import com.tms.v1.domain.InvoiceItem;
import java.util.Set;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the InvoiceItem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InvoiceItemRepository extends JpaRepository<InvoiceItem, Long> {
    Set<InvoiceItem> findByInvoice_Id(Long id);
}
