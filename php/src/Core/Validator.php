<?php

namespace App\Core;

class Validator
{
    private array $errors = [];

    public function validate(array $data, array $rules): bool
    {
        $this->errors = [];

        foreach ($rules as $field => $fieldRules) {
            $value = $data[$field] ?? null;

            foreach ($fieldRules as $rule) {
                $error = $this->checkRule($field, $value, $rule);
                if ($error !== null) {
                    $this->errors[$field] = $error;
                    break;
                }
            }
        }

        return empty($this->errors);
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    private function checkRule(string $field, mixed $value, string $rule): ?string
    {
        $parts = explode(':', $rule, 2);
        $ruleName = $parts[0];
        $param = $parts[1] ?? null;

        return match ($ruleName) {
            'required' => $this->checkRequired($field, $value),
            'email'    => $this->checkEmail($field, $value),
            'min'      => $this->checkMin($field, $value, (int) $param),
            'max'      => $this->checkMax($field, $value, (int) $param),
            'date'     => $this->checkDate($field, $value),
            'time'     => $this->checkTime($field, $value),
            'in'       => $this->checkIn($field, $value, $param),
            'numeric'  => $this->checkNumeric($field, $value),
            default    => null,
        };
    }

    private function checkRequired(string $field, mixed $value): ?string
    {
        if ($value === null || $value === '') {
            return "Väli '{$field}' on kohustuslik.";
        }
        return null;
    }

    private function checkEmail(string $field, mixed $value): ?string
    {
        if ($value !== null && $value !== '' && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
            return "Väli '{$field}' peab olema kehtiv e-posti aadress.";
        }
        return null;
    }

    private function checkMin(string $field, mixed $value, int $min): ?string
    {
        if ($value !== null && strlen((string) $value) < $min) {
            return "Väli '{$field}' peab olema vähemalt {$min} tähemärki.";
        }
        return null;
    }

    private function checkMax(string $field, mixed $value, int $max): ?string
    {
        if ($value !== null && strlen((string) $value) > $max) {
            return "Väli '{$field}' ei tohi olla pikem kui {$max} tähemärki.";
        }
        return null;
    }

    private function checkDate(string $field, mixed $value): ?string
    {
        if ($value !== null && $value !== '') {
            $date = \DateTime::createFromFormat('Y-m-d', $value);
            if (!$date || $date->format('Y-m-d') !== $value) {
                return "Väli '{$field}' peab olema kuupäev (YYYY-MM-DD).";
            }
        }
        return null;
    }

    private function checkTime(string $field, mixed $value): ?string
    {
        if ($value !== null && $value !== '' && !preg_match('/^\d{2}:\d{2}$/', $value)) {
            return "Väli '{$field}' peab olema kellaaeg (HH:MM).";
        }
        return null;
    }

    private function checkIn(string $field, mixed $value, ?string $options): ?string
    {
        if ($value !== null && $value !== '' && $options !== null) {
            $allowed = explode(',', $options);
            if (!in_array($value, $allowed, true)) {
                return "Väli '{$field}' sisaldab lubamatu väärtust.";
            }
        }
        return null;
    }

    private function checkNumeric(string $field, mixed $value): ?string
    {
        if ($value !== null && $value !== '' && !is_numeric($value)) {
            return "Väli '{$field}' peab olema number.";
        }
        return null;
    }
}
