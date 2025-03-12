package com.springboot.MyTodoList.service.interfaces;

import com.springboot.MyTodoList.model.TaskAudit;

import java.util.List;
import java.util.Optional;

public interface TaskAuditService {
    Optional<TaskAudit> getAuditEntryById(Long auditId);
    TaskAudit saveAuditEntry(TaskAudit taskAudit);
    void deleteAuditEntry(Long auditId);

    // Retrieving Task History
    List<TaskAudit> getAuditEntriesForTask(Long taskId);
    List<TaskAudit> getAuditEntriesByUser(Long userId);
    List<TaskAudit> getAuditEntriesByChangeType(String changeType);
    List<TaskAudit> getAuditEntriesByDateRange(String startDate, String endDate);

    // Generating Task Reports
    List<TaskAudit> getRecentChanges(int limit);
    long countChangesByTask(Long taskId);
    long countChangesByUser(Long userId);
}
