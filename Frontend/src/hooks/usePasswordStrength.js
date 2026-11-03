
import { useMemo } from "react";

const usePasswordStrength = (password = "") => {
    const result = useMemo(() => {
        const checks = [
            {
                label: "At least 8 characters",
                passed: password.length >= 8,
            },
            {
                label: "One uppercase letter",
                passed: /[A-Z]/.test(password),
            },
            {
                label: "One lowercase letter",
                passed: /[a-z]/.test(password),
            },
            {
                label: "One number",
                passed: /[0-9]/.test(password),
            },
            {
                label: "One special character",
                passed: /[^A-Za-z0-9]/.test(password),
            },
        ];

        const score = checks.filter(
            (check) => check.passed
        ).length;

        let label = "Very weak";

        if (score >= 5) {
            label = "Strong";
        } else if (score >= 4) {
            label = "Good";
        } else if (score >= 3) {
            label = "Fair";
        } else if (score >= 1) {
            label = "Weak";
        }

        return { checks, score, label };
    }, [password]);

    return result;
};

export default usePasswordStrength;
