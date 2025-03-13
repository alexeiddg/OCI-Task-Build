package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.AppUser;
import com.springboot.MyTodoList.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
@EnableTransactionManagement
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT p FROM Project p JOIN p.developers d WHERE d = :developer")
    List<Project> findByDevelopersContaining(AppUser developer);

    List<Project> findByManager(AppUser manager);
}
