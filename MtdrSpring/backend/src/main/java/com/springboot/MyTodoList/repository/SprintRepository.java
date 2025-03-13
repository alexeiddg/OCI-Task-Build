package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
@EnableTransactionManagement
public interface SprintRepository extends JpaRepository<Sprint,Long> {

    @Query("SELECT s FROM Sprint s WHERE s.project.projectId = :projectId")
    List<Sprint> findByProjectId(Long projectId);

    @Query("SELECT SUM(s.totalTasks) FROM Sprint s WHERE s.sprintId = :sprintId")
    Integer getTotalTasksInSprint(Long sprintId);

    @Query("SELECT SUM(s.completedTasks) FROM Sprint s WHERE s.sprintId = :sprintId")
    Integer getCompletedTasksInSprint(Long sprintId);
}
