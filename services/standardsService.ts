import type { Standard } from '../types';

// Simple in-memory cache to avoid re-fetching
const standardsCache = new Map<string, any>();

const API_BASE_URL = 'https://subplan-api-159768434829.us-west1.run.app';

/**
 * Fetches the unique standard categories for a given grade level.
 * Example endpoint: /categories?grade=5
 */
export const getCategoriesForGrade = async (grade: string): Promise<string[]> => {
    const cacheKey = `categories-${grade}`;
    if (standardsCache.has(cacheKey)) {
        return standardsCache.get(cacheKey);
    }
    
    console.log(`Fetching categories for grade: ${grade}`);
    try {
        const response = await fetch(`${API_BASE_URL}/categories?grade=${encodeURIComponent(grade)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categories: string[] = await response.json();
        standardsCache.set(cacheKey, categories);
        return categories;
    } catch (error) {
        console.error("Failed to fetch categories from API:", error);
        return []; // Return empty array on error
    }
};

/**
 * Fetches standards for a given grade and category.
 * Example endpoint: /standards?grade=5&category=Math
 */
export const getStandards = async (grade: string, category: string): Promise<Standard[]> => {
    const cacheKey = `standards-${grade}-${category}`;
    if (standardsCache.has(cacheKey)) {
        return standardsCache.get(cacheKey);
    }

    console.log(`Fetching standards for grade: ${grade}, category: ${category}`);
    try {
        const response = await fetch(`${API_BASE_URL}/standards?grade=${encodeURIComponent(grade)}&category=${encodeURIComponent(category)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Array<{ standard_code: string; description: string; }> = await response.json();
        
        const standards: Standard[] = data.map(std => ({
            id: std.standard_code,
            description: std.description,
        }));
        
        standardsCache.set(cacheKey, standards);
        return standards;
    } catch (error) {
        console.error("Failed to fetch standards from API:", error);
        return []; // Return empty array on error
    }
};