import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HealthController } from './health.controller.js';
import type { HealthService } from './health.service.js';

describe('HealthController', () => {
  const healthService = {
    getLiveness: vi.fn(),
    getReadiness: vi.fn(),
  };

  let healthController: HealthController;

  beforeEach(() => {
    vi.clearAllMocks();

    healthController = new HealthController(
      healthService as unknown as HealthService,
    );
  });

  describe('checkLiveness', () => {
    it('should return liveness status from HealthService', () => {
      healthService.getLiveness.mockReturnValue({
        status: 'ok',
        service: 'devflow-api',
      });

      const result = healthController.checkLiveness();

      expect(result).toEqual({
        status: 'ok',
        service: 'devflow-api',
      });

      expect(healthService.getLiveness).toHaveBeenCalledOnce();
    });
  });

  describe('checkReadiness', () => {
    it('should return readiness status from HealthService', async () => {
      healthService.getReadiness.mockResolvedValue({
        status: 'ready',
        checks: {
          database: 'connected',
          redis: 'connected',
        },
      });

      const result = await healthController.checkReadiness();

      expect(result).toEqual({
        status: 'ready',
        checks: {
          database: 'connected',
          redis: 'connected',
        },
      });

      expect(healthService.getReadiness).toHaveBeenCalledOnce();
    });
  });
});
