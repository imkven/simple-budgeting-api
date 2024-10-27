import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidatorOptions,
  } from 'class-validator';

  const ISO_8601_FULL = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i
  
  @ValidatorConstraint({ name: 'IsStrongPassword', async: false })
  export class IsValidJSONDateTimeConstraint implements ValidatorConstraintInterface {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validate(jsonDateTime: string, _args: ValidationArguments) {
      return (
        typeof jsonDateTime === 'string' &&
        ISO_8601_FULL.test(jsonDateTime)
      );
    }
  
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    defaultMessage(_args: ValidationArguments) {
      return 'Expected ISO_8601 format';
    }
  }
  
  export function isValidJSONDateTime(validationOptions?: ValidatorOptions) {
    return function (object: NonNullable<unknown>, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [],
        validator: IsValidJSONDateTimeConstraint,
      });
    };
  }
  