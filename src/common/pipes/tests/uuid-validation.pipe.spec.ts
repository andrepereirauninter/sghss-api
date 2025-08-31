import { isUUID } from 'class-validator';

import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UUIDValidationPipe } from '../uuid-validation.pipe';

jest.mock('class-validator', () => ({
  isUUID: jest.fn(),
}));

describe('UUIDValidationPipe', () => {
  let pipe: UUIDValidationPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UUIDValidationPipe],
    }).compile();

    pipe = module.get<UUIDValidationPipe>(UUIDValidationPipe);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    const mockMetadata: ArgumentMetadata = {
      type: 'param',
      data: 'id',
      metatype: String,
    };

    const mockMetadataWithUserId: ArgumentMetadata = {
      type: 'param',
      data: 'userId',
      metatype: String,
    };

    const mockMetadataWithoutData: ArgumentMetadata = {
      type: 'param',
      data: undefined,
      metatype: String,
    };

    it('should return the value if it is a valid UUID v4', () => {
      const validUUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      (isUUID as jest.Mock).mockReturnValue(true);

      const result = pipe.transform(validUUID, mockMetadata);

      expect(result).toBe(validUUID);
      expect(isUUID).toHaveBeenCalledWith(validUUID, 4);
    });

    it('should throw BadRequestException with dynamic parameter name for invalid UUID', () => {
      const invalidUUID = 'invalid-uuid';
      (isUUID as jest.Mock).mockReturnValue(false);

      expect(() => pipe.transform(invalidUUID, mockMetadata)).toThrow(
        BadRequestException,
      );
      expect(() => pipe.transform(invalidUUID, mockMetadata)).toThrow(
        'id deve ser um UUID válido',
      );
    });

    it('should use different parameter name in error message', () => {
      const invalidUUID = 'invalid-uuid';
      (isUUID as jest.Mock).mockReturnValue(false);

      expect(() => pipe.transform(invalidUUID, mockMetadataWithUserId)).toThrow(
        BadRequestException,
      );
      expect(() => pipe.transform(invalidUUID, mockMetadataWithUserId)).toThrow(
        'userId deve ser um UUID válido',
      );
    });

    it('should use fallback message when parameter name is not provided', () => {
      const invalidUUID = 'invalid-uuid';
      (isUUID as jest.Mock).mockReturnValue(false);

      expect(() =>
        pipe.transform(invalidUUID, mockMetadataWithoutData),
      ).toThrow(BadRequestException);
      expect(() =>
        pipe.transform(invalidUUID, mockMetadataWithoutData),
      ).toThrow('parâmetro deve ser um UUID válido');
    });

    it('should throw BadRequestException for null value', () => {
      (isUUID as jest.Mock).mockReturnValue(false);

      expect(() => pipe.transform(null!, mockMetadata)).toThrow(
        BadRequestException,
      );
      expect(() => pipe.transform(null!, mockMetadata)).toThrow(
        'id deve ser um UUID válido',
      );
    });

    it('should throw BadRequestException for undefined value', () => {
      (isUUID as jest.Mock).mockReturnValue(false);

      expect(() => pipe.transform(undefined!, mockMetadata)).toThrow(
        BadRequestException,
      );
      expect(() => pipe.transform(undefined!, mockMetadata)).toThrow(
        'id deve ser um UUID válido',
      );
    });

    it('should throw BadRequestException for empty string', () => {
      (isUUID as jest.Mock).mockReturnValue(false);

      expect(() => pipe.transform('', mockMetadata)).toThrow(
        BadRequestException,
      );
      expect(() => pipe.transform('', mockMetadata)).toThrow(
        'id deve ser um UUID válido',
      );
    });

    it('should validate UUID v4 specifically', () => {
      const uuidV1 = 'd9428888-122b-11e1-b85c-61cd3cbb3210';
      (isUUID as jest.Mock).mockImplementation((value, version) => {
        return (
          version === 4 && value === 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
        );
      });

      expect(() => pipe.transform(uuidV1, mockMetadata)).toThrow(
        BadRequestException,
      );
    });

    it('should accept valid UUID v4 strings', () => {
      const validUUIDs = [
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        '550e8400-e29b-41d4-a716-446655440000',
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
      ];

      (isUUID as jest.Mock).mockReturnValue(true);

      validUUIDs.forEach((uuid) => {
        expect(() => pipe.transform(uuid, mockMetadata)).not.toThrow();
        expect(pipe.transform(uuid, mockMetadata)).toBe(uuid);
      });
    });

    it('should reject invalid UUID formats', () => {
      const invalidUUIDs = [
        'not-a-uuid',
        '12345',
        'f47ac10b-58cc-4372-a567-0e02b2c3d47',
        'f47ac10b-58cc-4372-a567-0e02b2c3d4799',
        'f47ac10b_58cc_4372_a567_0e02b2c3d479',
        'f47ac10b-58cc-4372-a567-0e02b2c3d479-invalid',
      ];

      (isUUID as jest.Mock).mockReturnValue(false);

      invalidUUIDs.forEach((uuid) => {
        expect(() => pipe.transform(uuid, mockMetadata)).toThrow(
          BadRequestException,
        );
        expect(() => pipe.transform(uuid, mockMetadata)).toThrow(
          'id deve ser um UUID válido',
        );
      });
    });
  });
});
