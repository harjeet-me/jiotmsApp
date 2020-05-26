package com.tms.v1.web.rest;

import com.tms.v1.JiotmsappApp;
import com.tms.v1.domain.TransactionsRecord;
import com.tms.v1.repository.TransactionsRecordRepository;
import com.tms.v1.service.TransactionsRecordService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.tms.v1.domain.enumeration.TransactionType;
/**
 * Integration tests for the {@link TransactionsRecordResource} REST controller.
 */
@SpringBootTest(classes = JiotmsappApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class TransactionsRecordResourceIT {

    private static final TransactionType DEFAULT_TX_TYPE = TransactionType.CREDIT;
    private static final TransactionType UPDATED_TX_TYPE = TransactionType.INVOICE;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Double DEFAULT_TX_AMMOUNT = 1D;
    private static final Double UPDATED_TX_AMMOUNT = 2D;

    private static final Instant DEFAULT_CREATED_ON = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_ON = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_UPDATED_ON = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UPDATED_ON = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_UPDATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_UPDATED_BY = "BBBBBBBBBB";

    @Autowired
    private TransactionsRecordRepository transactionsRecordRepository;

    @Autowired
    private TransactionsRecordService transactionsRecordService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTransactionsRecordMockMvc;

    private TransactionsRecord transactionsRecord;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TransactionsRecord createEntity(EntityManager em) {
        TransactionsRecord transactionsRecord = new TransactionsRecord()
            .txType(DEFAULT_TX_TYPE)
            .description(DEFAULT_DESCRIPTION)
            .txAmmount(DEFAULT_TX_AMMOUNT)
            .createdOn(DEFAULT_CREATED_ON)
            .createdBy(DEFAULT_CREATED_BY)
            .updatedOn(DEFAULT_UPDATED_ON)
            .updatedBy(DEFAULT_UPDATED_BY);
        return transactionsRecord;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TransactionsRecord createUpdatedEntity(EntityManager em) {
        TransactionsRecord transactionsRecord = new TransactionsRecord()
            .txType(UPDATED_TX_TYPE)
            .description(UPDATED_DESCRIPTION)
            .txAmmount(UPDATED_TX_AMMOUNT)
            .createdOn(UPDATED_CREATED_ON)
            .createdBy(UPDATED_CREATED_BY)
            .updatedOn(UPDATED_UPDATED_ON)
            .updatedBy(UPDATED_UPDATED_BY);
        return transactionsRecord;
    }

    @BeforeEach
    public void initTest() {
        transactionsRecord = createEntity(em);
    }

    @Test
    @Transactional
    public void createTransactionsRecord() throws Exception {
        int databaseSizeBeforeCreate = transactionsRecordRepository.findAll().size();
        // Create the TransactionsRecord
        restTransactionsRecordMockMvc.perform(post("/api/transactions-records").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(transactionsRecord)))
            .andExpect(status().isCreated());

        // Validate the TransactionsRecord in the database
        List<TransactionsRecord> transactionsRecordList = transactionsRecordRepository.findAll();
        assertThat(transactionsRecordList).hasSize(databaseSizeBeforeCreate + 1);
        TransactionsRecord testTransactionsRecord = transactionsRecordList.get(transactionsRecordList.size() - 1);
        assertThat(testTransactionsRecord.getTxType()).isEqualTo(DEFAULT_TX_TYPE);
        assertThat(testTransactionsRecord.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testTransactionsRecord.getTxAmmount()).isEqualTo(DEFAULT_TX_AMMOUNT);
        assertThat(testTransactionsRecord.getCreatedOn()).isEqualTo(DEFAULT_CREATED_ON);
        assertThat(testTransactionsRecord.getCreatedBy()).isEqualTo(DEFAULT_CREATED_BY);
        assertThat(testTransactionsRecord.getUpdatedOn()).isEqualTo(DEFAULT_UPDATED_ON);
        assertThat(testTransactionsRecord.getUpdatedBy()).isEqualTo(DEFAULT_UPDATED_BY);
    }

    @Test
    @Transactional
    public void createTransactionsRecordWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = transactionsRecordRepository.findAll().size();

        // Create the TransactionsRecord with an existing ID
        transactionsRecord.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTransactionsRecordMockMvc.perform(post("/api/transactions-records").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(transactionsRecord)))
            .andExpect(status().isBadRequest());

        // Validate the TransactionsRecord in the database
        List<TransactionsRecord> transactionsRecordList = transactionsRecordRepository.findAll();
        assertThat(transactionsRecordList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllTransactionsRecords() throws Exception {
        // Initialize the database
        transactionsRecordRepository.saveAndFlush(transactionsRecord);

        // Get all the transactionsRecordList
        restTransactionsRecordMockMvc.perform(get("/api/transactions-records?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(transactionsRecord.getId().intValue())))
            .andExpect(jsonPath("$.[*].txType").value(hasItem(DEFAULT_TX_TYPE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].txAmmount").value(hasItem(DEFAULT_TX_AMMOUNT.doubleValue())))
            .andExpect(jsonPath("$.[*].createdOn").value(hasItem(DEFAULT_CREATED_ON.toString())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].updatedOn").value(hasItem(DEFAULT_UPDATED_ON.toString())))
            .andExpect(jsonPath("$.[*].updatedBy").value(hasItem(DEFAULT_UPDATED_BY)));
    }
    
    @Test
    @Transactional
    public void getTransactionsRecord() throws Exception {
        // Initialize the database
        transactionsRecordRepository.saveAndFlush(transactionsRecord);

        // Get the transactionsRecord
        restTransactionsRecordMockMvc.perform(get("/api/transactions-records/{id}", transactionsRecord.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(transactionsRecord.getId().intValue()))
            .andExpect(jsonPath("$.txType").value(DEFAULT_TX_TYPE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.txAmmount").value(DEFAULT_TX_AMMOUNT.doubleValue()))
            .andExpect(jsonPath("$.createdOn").value(DEFAULT_CREATED_ON.toString()))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.updatedOn").value(DEFAULT_UPDATED_ON.toString()))
            .andExpect(jsonPath("$.updatedBy").value(DEFAULT_UPDATED_BY));
    }
    @Test
    @Transactional
    public void getNonExistingTransactionsRecord() throws Exception {
        // Get the transactionsRecord
        restTransactionsRecordMockMvc.perform(get("/api/transactions-records/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTransactionsRecord() throws Exception {
        // Initialize the database
        transactionsRecordService.save(transactionsRecord);

        int databaseSizeBeforeUpdate = transactionsRecordRepository.findAll().size();

        // Update the transactionsRecord
        TransactionsRecord updatedTransactionsRecord = transactionsRecordRepository.findById(transactionsRecord.getId()).get();
        // Disconnect from session so that the updates on updatedTransactionsRecord are not directly saved in db
        em.detach(updatedTransactionsRecord);
        updatedTransactionsRecord
            .txType(UPDATED_TX_TYPE)
            .description(UPDATED_DESCRIPTION)
            .txAmmount(UPDATED_TX_AMMOUNT)
            .createdOn(UPDATED_CREATED_ON)
            .createdBy(UPDATED_CREATED_BY)
            .updatedOn(UPDATED_UPDATED_ON)
            .updatedBy(UPDATED_UPDATED_BY);

        restTransactionsRecordMockMvc.perform(put("/api/transactions-records").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedTransactionsRecord)))
            .andExpect(status().isOk());

        // Validate the TransactionsRecord in the database
        List<TransactionsRecord> transactionsRecordList = transactionsRecordRepository.findAll();
        assertThat(transactionsRecordList).hasSize(databaseSizeBeforeUpdate);
        TransactionsRecord testTransactionsRecord = transactionsRecordList.get(transactionsRecordList.size() - 1);
        assertThat(testTransactionsRecord.getTxType()).isEqualTo(UPDATED_TX_TYPE);
        assertThat(testTransactionsRecord.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTransactionsRecord.getTxAmmount()).isEqualTo(UPDATED_TX_AMMOUNT);
        assertThat(testTransactionsRecord.getCreatedOn()).isEqualTo(UPDATED_CREATED_ON);
        assertThat(testTransactionsRecord.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testTransactionsRecord.getUpdatedOn()).isEqualTo(UPDATED_UPDATED_ON);
        assertThat(testTransactionsRecord.getUpdatedBy()).isEqualTo(UPDATED_UPDATED_BY);
    }

    @Test
    @Transactional
    public void updateNonExistingTransactionsRecord() throws Exception {
        int databaseSizeBeforeUpdate = transactionsRecordRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTransactionsRecordMockMvc.perform(put("/api/transactions-records").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(transactionsRecord)))
            .andExpect(status().isBadRequest());

        // Validate the TransactionsRecord in the database
        List<TransactionsRecord> transactionsRecordList = transactionsRecordRepository.findAll();
        assertThat(transactionsRecordList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTransactionsRecord() throws Exception {
        // Initialize the database
        transactionsRecordService.save(transactionsRecord);

        int databaseSizeBeforeDelete = transactionsRecordRepository.findAll().size();

        // Delete the transactionsRecord
        restTransactionsRecordMockMvc.perform(delete("/api/transactions-records/{id}", transactionsRecord.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TransactionsRecord> transactionsRecordList = transactionsRecordRepository.findAll();
        assertThat(transactionsRecordList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
