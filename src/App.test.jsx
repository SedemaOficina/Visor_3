import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Smoke Test', () => {
    it('renders the application title', async () => {
        render(<App />);

        // 1. Check for loading state first
        expect(screen.getByText(/Cargando visor.../i)).toBeInTheDocument();

        // 2. Wait for loading to finish and main content to appear
        const titleElements = await screen.findAllByText(/Visor de Consulta/i);
        expect(titleElements.length).toBeGreaterThan(0);
    });
});
