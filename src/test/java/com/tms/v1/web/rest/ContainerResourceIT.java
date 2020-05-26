package com.tms.v1.web.rest;

import com.tms.v1.JiotmsappApp;
import com.tms.v1.domain.Container;
import com.tms.v1.repository.ContainerRepository;
import com.tms.v1.service.ContainerService;

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

/**
 * Integration tests for the {@link ContainerResource} REST controller.
 */
@SpringBootTest(classes = JiotmsappApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class ContainerResourceIT {

    private static final String DEFAULT_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Integer DEFAULT_SIZE = 1;
    private static final Integer UPDATED_SIZE = 2;

    private static final Instant DEFAULT_CREATED_ON = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_ON = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_UPDATED_ON = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UPDATED_ON = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_UPDATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_UPDATED_BY = "BBBBBBBBBB";

    @Autowired
    private ContainerRepository containerRepository;

    @Autowired
    private ContainerService containerService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restContainerMockMvc;

    private Container container;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Container createEntity(EntityManager em) {
        Container container = new Container()
            .number(DEFAULT_NUMBER)
            .description(DEFAULT_DESCRIPTION)
            .size(DEFAULT_SIZE)
            .createdOn(DEFAULT_CREATED_ON)
            .createdBy(DEFAULT_CREATED_BY)
            .updatedOn(DEFAULT_UPDATED_ON)
            .updatedBy(DEFAULT_UPDATED_BY);
        return container;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Container createUpdatedEntity(EntityManager em) {
        Container container = new Container()
            .number(UPDATED_NUMBER)
            .description(UPDATED_DESCRIPTION)
            .size(UPDATED_SIZE)
            .createdOn(UPDATED_CREATED_ON)
            .createdBy(UPDATED_CREATED_BY)
            .updatedOn(UPDATED_UPDATED_ON)
            .updatedBy(UPDATED_UPDATED_BY);
        return container;
    }

    @BeforeEach
    public void initTest() {
        container = createEntity(em);
    }

    @Test
    @Transactional
    public void createContainer() throws Exception {
        int databaseSizeBeforeCreate = containerRepository.findAll().size();
        // Create the Container
        restContainerMockMvc.perform(post("/api/containers").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(container)))
            .andExpect(status().isCreated());

        // Validate the Container in the database
        List<Container> containerList = containerRepository.findAll();
        assertThat(containerList).hasSize(databaseSizeBeforeCreate + 1);
        Container testContainer = containerList.get(containerList.size() - 1);
        assertThat(testContainer.getNumber()).isEqualTo(DEFAULT_NUMBER);
        assertThat(testContainer.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testContainer.getSize()).isEqualTo(DEFAULT_SIZE);
        assertThat(testContainer.getCreatedOn()).isEqualTo(DEFAULT_CREATED_ON);
        assertThat(testContainer.getCreatedBy()).isEqualTo(DEFAULT_CREATED_BY);
        assertThat(testContainer.getUpdatedOn()).isEqualTo(DEFAULT_UPDATED_ON);
        assertThat(testContainer.getUpdatedBy()).isEqualTo(DEFAULT_UPDATED_BY);
    }

    @Test
    @Transactional
    public void createContainerWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = containerRepository.findAll().size();

        // Create the Container with an existing ID
        container.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restContainerMockMvc.perform(post("/api/containers").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(container)))
            .andExpect(status().isBadRequest());

        // Validate the Container in the database
        List<Container> containerList = containerRepository.findAll();
        assertThat(containerList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllContainers() throws Exception {
        // Initialize the database
        containerRepository.saveAndFlush(container);

        // Get all the containerList
        restContainerMockMvc.perform(get("/api/containers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(container.getId().intValue())))
            .andExpect(jsonPath("$.[*].number").value(hasItem(DEFAULT_NUMBER)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].size").value(hasItem(DEFAULT_SIZE)))
            .andExpect(jsonPath("$.[*].createdOn").value(hasItem(DEFAULT_CREATED_ON.toString())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].updatedOn").value(hasItem(DEFAULT_UPDATED_ON.toString())))
            .andExpect(jsonPath("$.[*].updatedBy").value(hasItem(DEFAULT_UPDATED_BY)));
    }
    
    @Test
    @Transactional
    public void getContainer() throws Exception {
        // Initialize the database
        containerRepository.saveAndFlush(container);

        // Get the container
        restContainerMockMvc.perform(get("/api/containers/{id}", container.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(container.getId().intValue()))
            .andExpect(jsonPath("$.number").value(DEFAULT_NUMBER))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.size").value(DEFAULT_SIZE))
            .andExpect(jsonPath("$.createdOn").value(DEFAULT_CREATED_ON.toString()))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.updatedOn").value(DEFAULT_UPDATED_ON.toString()))
            .andExpect(jsonPath("$.updatedBy").value(DEFAULT_UPDATED_BY));
    }
    @Test
    @Transactional
    public void getNonExistingContainer() throws Exception {
        // Get the container
        restContainerMockMvc.perform(get("/api/containers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateContainer() throws Exception {
        // Initialize the database
        containerService.save(container);

        int databaseSizeBeforeUpdate = containerRepository.findAll().size();

        // Update the container
        Container updatedContainer = containerRepository.findById(container.getId()).get();
        // Disconnect from session so that the updates on updatedContainer are not directly saved in db
        em.detach(updatedContainer);
        updatedContainer
            .number(UPDATED_NUMBER)
            .description(UPDATED_DESCRIPTION)
            .size(UPDATED_SIZE)
            .createdOn(UPDATED_CREATED_ON)
            .createdBy(UPDATED_CREATED_BY)
            .updatedOn(UPDATED_UPDATED_ON)
            .updatedBy(UPDATED_UPDATED_BY);

        restContainerMockMvc.perform(put("/api/containers").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedContainer)))
            .andExpect(status().isOk());

        // Validate the Container in the database
        List<Container> containerList = containerRepository.findAll();
        assertThat(containerList).hasSize(databaseSizeBeforeUpdate);
        Container testContainer = containerList.get(containerList.size() - 1);
        assertThat(testContainer.getNumber()).isEqualTo(UPDATED_NUMBER);
        assertThat(testContainer.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testContainer.getSize()).isEqualTo(UPDATED_SIZE);
        assertThat(testContainer.getCreatedOn()).isEqualTo(UPDATED_CREATED_ON);
        assertThat(testContainer.getCreatedBy()).isEqualTo(UPDATED_CREATED_BY);
        assertThat(testContainer.getUpdatedOn()).isEqualTo(UPDATED_UPDATED_ON);
        assertThat(testContainer.getUpdatedBy()).isEqualTo(UPDATED_UPDATED_BY);
    }

    @Test
    @Transactional
    public void updateNonExistingContainer() throws Exception {
        int databaseSizeBeforeUpdate = containerRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restContainerMockMvc.perform(put("/api/containers").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(container)))
            .andExpect(status().isBadRequest());

        // Validate the Container in the database
        List<Container> containerList = containerRepository.findAll();
        assertThat(containerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteContainer() throws Exception {
        // Initialize the database
        containerService.save(container);

        int databaseSizeBeforeDelete = containerRepository.findAll().size();

        // Delete the container
        restContainerMockMvc.perform(delete("/api/containers/{id}", container.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Container> containerList = containerRepository.findAll();
        assertThat(containerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
