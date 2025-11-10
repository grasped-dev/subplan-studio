
import type { Standard } from '../types';
import { mapGradeToApiFormat } from '../constants';

// Simple in-memory cache to avoid re-fetching
const standardsCache = new Map<string, any>();

const API_BASE_URL = 'https://subplan-api-159768434829.us-west1.run.app';

/**
 * Fetches the unique standard categories for a given grade level.
 * Example endpoint: /categories?grade=5
 */
export const getCategoriesForGrade = async (grade: string): Promise<string[]> => {
    const apiGrade = mapGradeToApiFormat(grade);
    const cacheKey = `categories-${grade}`;
    if (standardsCache.has(cacheKey)) {
        console.log(`Returning cached categories for ${grade}`);
        return standardsCache.get(cacheKey);
    }
    
    console.log(`Fetching categories for grade: ${grade} (API format: ${apiGrade})`);
    const url = `${API_BASE_URL}/categories?grade=${encodeURIComponent(apiGrade)}`;
    console.log(`Full API URL: ${url}`);
    
    try {
        const response = await fetch(url);
        console.log(`Response status: ${response.status}`);
        
        const responseBody = await response.text();
        console.log("Full API response for categories:", responseBody);

        if (!response.ok) {
            console.error(`API Error Response: ${responseBody}`);
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        
        let categories: any;
        try {
            categories = JSON.parse(responseBody);
        } catch(e) {
            console.error("Failed to parse categories JSON:", e);
            console.error("Response body that failed parsing:", responseBody);
            return [];
        }

        if (!Array.isArray(categories) || !categories.every(item => typeof item === 'string')) {
            console.error("API response for categories is not in the expected format (array of strings). Received:", categories);
            return [];
        }
        
        console.log(`Received ${categories.length} categories:`, categories);
        
        standardsCache.set(cacheKey, categories);
        return categories;
    } catch (error) {
        console.error("Failed to fetch categories from API:", error);
        return [];
    }
};

/**
 * Fetches standards for a given grade and category.
 * Example endpoint: /standards?grade=5&category=Math
 */
export const getStandards = async (grade: string, category: string): Promise<Standard[]> => {
    const apiGrade = mapGradeToApiFormat(grade);
    const cacheKey = `standards-${grade}-${category}`;
    if (standardsCache.has(cacheKey)) {
        console.log(`Returning cached standards for ${grade} - ${category}`);
        return standardsCache.get(cacheKey);
    }

    console.log(`Fetching standards for grade: ${grade} (API format: ${apiGrade}), category: ${category}`);
    const url = `${API_BASE_URL}/standards?grade=${encodeURIComponent(apiGrade)}&category=${encodeURIComponent(category)}`;
    console.log(`Full API URL: ${url}`);
    
    try {
        const response = await fetch(url);
        console.log(`Response status: ${response.status}`);
        
        const responseBody = await response.text();
        console.log("Full API response for standards:", responseBody);

        if (!response.ok) {
            console.error(`API Error Response: ${responseBody}`);
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        
        let data: any;
        try {
            data = JSON.parse(responseBody);
        } catch(e) {
            console.error("Failed to parse standards JSON:", e);
            console.error("Response body that failed parsing:", responseBody);
            return [];
        }
        
        if (!Array.isArray(data)) {
            console.error(`Expected array for standards but got:`, data);
            return [];
        }
        
        const standards: Standard[] = data
            .map(std => {
                if (typeof std !== 'object' || std === null) {
                    console.warn('Invalid item in standards array (not an object):', std);
                    return null;
                }
                const id = std.standard_code || std.id;
                const description = std.description;
                if (typeof id !== 'string' || typeof description !== 'string') {
                    console.warn('Invalid standard item structure (missing id or description):', std);
                    return null;
                }
                return { id, description };
            })
            .filter((s): s is Standard => s !== null);

        if (standards.length !== data.length) {
            console.log("Filtered out some invalid standard items from the API response.");
        }
        
        console.log(`Successfully parsed ${standards.length} standards.`);
        
        standardsCache.set(cacheKey, standards);
        return standards;
    } catch (error) {
        console.error("Failed to fetch standards from API:", error);
        return [];
    }
};
