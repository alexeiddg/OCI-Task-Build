package com.springboot.MyTodoList.service.interfaces;

import com.springboot.MyTodoList.model.TaskMetric;

import java.util.Optional;

public interface TaskMetricService {
    Optional<TaskMetric> getMetricById(Long id);
    TaskMetric saveTaskMetric(TaskMetric taskMetric);
    void deleteMetric(Long id);

    // Developer Performance
    int getTotalAssignedTasksByDeveloper(Long developerId);
    int getCompletedTasksByDeveloper(Long developerId);
    Long getAvgCompletionTimeByDeveloper(Long developerId);
    int getTotalBugsFixedByDeveloper(Long developerId);
    int getTotalFeaturesCompletedByDeveloper(Long developerId);
    float calculateSprintCompletionRateByDeveloper(Long developerId, Long sprintId);
    float calculateEfficiencyScoreByDeveloper(Long developerId);

    // Team Performance
    int getTotalAssignedTasksByTeam(Long teamId);
    int getCompletedTasksByTeam(Long teamId);
    Long getAvgCompletionTimeByTeam(Long teamId);
    int getTotalBugsFixedByTeam(Long teamId);
    int getTotalFeaturesCompletedByTeam(Long teamId);
    float calculateSprintCompletionRateByTeam(Long teamId, Long sprintId);
    float calculateEfficiencyScoreByTeam(Long teamId);

    // Project & Sprint Performance
    int getTotalAssignedTasksByProject(Long projectId);
    int getCompletedTasksByProject(Long projectId);
    float calculateSprintVelocity(Long sprintId);
    float calculateSprintCompletionRateByProject(Long projectId);
    float calculateEfficiencyScoreByProject(Long projectId);
}
