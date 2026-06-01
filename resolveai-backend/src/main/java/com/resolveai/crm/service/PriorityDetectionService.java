package com.resolveai.crm.service;

import com.resolveai.crm.entity.Priority;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
public class PriorityDetectionService {

    private static final List<String> HIGH_KEYWORDS = List.of(
            "payment failed", "payment issue", "unable to pay", "refund not received",
            "account hacked", "unauthorized", "data breach", "security issue",
            "urgent", "critical", "emergency", "fraud", "scam", "not working",
            "system down", "cannot access", "blocked", "suspended"
    );

    private static final List<String> LOW_KEYWORDS = List.of(
            "feature suggestion", "suggestion", "idea", "improvement", "nice to have",
            "future", "consider", "would be great", "goodwill", "thank you",
            "appreciate", "feedback"
    );

    public Priority detect(String title, String description) {
        String combined = (title + " " + description).toLowerCase(Locale.ROOT);

        for (String kw : HIGH_KEYWORDS) {
            if (combined.contains(kw)) {
                return Priority.HIGH;
            }
        }
        for (String kw : LOW_KEYWORDS) {
            if (combined.contains(kw)) {
                return Priority.LOW;
            }
        }
        return Priority.MEDIUM;
    }
}
