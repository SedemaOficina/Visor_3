import { describe, it, expect } from 'vitest';
import {
    isConservationSoil,
    isUrbanSoil,
    isOutsideCDMX,
    isANP,
    hasZoningData,
    shouldShowNormativeInstrument,
    shouldShowActivitiesCatalog
} from './zoningRules';

describe('Zoning Rules Domain Logic', () => {

    describe('isConservationSoil', () => {
        it('returns true for CONSERVATION_SOIL status', () => {
            expect(isConservationSoil({ status: 'CONSERVATION_SOIL' })).toBe(true);
        });
        it('returns false for anything else', () => {
            expect(isConservationSoil({ status: 'URBAN_SOIL' })).toBe(false);
            expect(isConservationSoil(null)).toBe(false);
        });
    });

    describe('isUrbanSoil', () => {
        it('returns true for URBAN_SOIL status', () => {
            expect(isUrbanSoil({ status: 'URBAN_SOIL' })).toBe(true);
        });
    });

    describe('isOutsideCDMX', () => {
        it('returns true for OUTSIDE_CDMX status', () => {
            expect(isOutsideCDMX({ status: 'OUTSIDE_CDMX' })).toBe(true);
        });
    });

    describe('isANP', () => {
        it('returns true if zoningKey is ANP', () => {
            expect(isANP({ zoningKey: 'ANP' })).toBe(true);
        });
        it('returns true if isANP flag is true', () => {
            expect(isANP({ isANP: true })).toBe(true);
        });
        it('returns false otherwise', () => {
            expect(isANP({ zoningKey: 'RE', isANP: false })).toBe(false);
        });
    });

    describe('hasZoningData', () => {
        it('returns false for NODATA or missing key', () => {
            expect(hasZoningData({ zoningKey: 'NODATA' })).toBe(false);
            expect(hasZoningData({})).toBe(false);
        });
        it('returns true for valid keys', () => {
            expect(hasZoningData({ zoningKey: 'RE' })).toBe(true);
            expect(hasZoningData({ zoningKey: 'H 2/30' })).toBe(true);
        });
    });

    describe('shouldShowNormativeInstrument', () => {
        it('shows for SC', () => {
            expect(shouldShowNormativeInstrument({ status: 'CONSERVATION_SOIL' })).toBe(true);
        });
        it('shows for Urban', () => {
            expect(shouldShowNormativeInstrument({ status: 'URBAN_SOIL' })).toBe(true);
        });
        it('does NOT show for Outside or No Data (unlessstatus is strictly NO_DATA which usually isnt a status)', () => {
            expect(shouldShowNormativeInstrument({ status: 'OUTSIDE_CDMX' })).toBe(false);
        });
    });

    describe('shouldShowActivitiesCatalog', () => {
        it('shows for Conservation Soil', () => {
            expect(shouldShowActivitiesCatalog({ status: 'CONSERVATION_SOIL' })).toBe(true);
        });
        it('hides for Urban Soil (PDU)', () => {
            expect(shouldShowActivitiesCatalog({ status: 'URBAN_SOIL' })).toBe(false);
        });
        it('hides if isPDU flag is present', () => {
            expect(shouldShowActivitiesCatalog({ status: 'CONSERVATION_SOIL', isPDU: true })).toBe(false);
        });
        it('hides if noActivitiesCatalog flag is present', () => {
            expect(shouldShowActivitiesCatalog({ status: 'CONSERVATION_SOIL', noActivitiesCatalog: true })).toBe(false);
        });
    });

});
