import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

export const getErrorMessage = (err: unknown): string => {
    let error = err;
    if (error instanceof Error) {
        // Handle standard JavaScript errors
        return error.message;
    } else if (typeof error === 'string') {
        // Handle string errors
        return error;
    } else if (typeof error === 'object' && error !== null) {
        // Handle nested RTK mutation errors (error + meta structure)
        if ('error' in error) {
            error = (error as { error: FetchBaseQueryError | SerializedError }).error;
        }
        // Handle FetchBaseQueryError
        if (typeof error === 'object' && error !== null && 'status' in error) {
            const fetchError = error as FetchBaseQueryError;
            if (fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data) {
                return (fetchError.data as { message?: string }).message || 'Unknown server error';
            }
            return `HTTP Error (${fetchError.status})`;
        }
        // Handle SerializedError
        if (typeof error === 'object' && error !== null && 'message' in error) {
            const serializedError = error as SerializedError;
            return serializedError.message || 'Unknown client error';
        }
        // Handle generic object errors
        const errorMessage = (error as { message?: string }).message;
        return errorMessage ? errorMessage : 'Unknown error';
    }
    // Fallback for unknown error types
    return 'Unknown error';
};
