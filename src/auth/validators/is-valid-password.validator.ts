import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidatorOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsStrongPassword', async: false })
export class IsValidPasswordConstraint implements ValidatorConstraintInterface {
  /**
   * Validates whether the provided password meets the specified criteria.
   *
   * @param {string} password - The password to validate.
   * @param {ValidationArguments} _args - Additional validation arguments (unused).
   * @returns {boolean} True if the password is valid, false otherwise.
   *
   * The password must be a string between 6 and 20 characters long and include at least one
   * uppercase letter, one lowercase letter, one number, and one special character.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(password: string, _args: ValidationArguments) {
    return (
      typeof password === 'string' &&
      password.length > 5 &&
      password.length <= 20 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    return 'Password must be between 6 and 20 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character';
  }
}

export function IsStrongPassword(validationOptions?: ValidatorOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPasswordConstraint,
    });
  };
}
