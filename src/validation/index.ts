import { ValidationRulesTypes } from '../contracts/validation/input-validation';
import { MixedValidationConstrains } from '../contracts/validation/input-validation-mixed';
import { StringValidationConstrains } from '../contracts/validation/input-validation-string';
import { NumberValidationConstrains } from '../contracts/validation/input-validation-number';

/**
 * ### String Validations Rules Builder
 * 📌You can add more needed and custom validation here. Don't worry this module is open to change, it's normal for now! 😉
 * @author <pino0071@gmail.com> Jose Aburto
 */
export class StringRulesBuilder {
  private constrains: StringValidationConstrains[] = [];

  private constructor() {
    this.constrains = [];
    this.required = this.required.bind(this);
    this.email = this.email.bind(this);
    this.min = this.min.bind(this);
    this.max = this.max.bind(this);
    this.lowercase = this.lowercase.bind(this);
    this.uppercase = this.uppercase.bind(this);
    this.matches = this.matches.bind(this);
    this.length = this.length.bind(this);
    this.securePassword = this.securePassword.bind(this);
    this.get = this.get.bind(this);
  }

  /**
   * Use it if you want to validate a string is present always.
   */
  public required(message: string): Omit<StringRulesBuilder, 'required'> {
    this.constrains.push({ method: 'required', params: { message } });
    return this;
  }

  public email(message: string): Omit<StringRulesBuilder, 'email'> {
    this.constrains.push({ method: 'matches', params: { value: /^$|^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message } });
    return this;
  }

  /**
   * Use it if you want to validate a the min of the string
   */
  public min(value: number, message: string): Omit<StringRulesBuilder, 'min'> {
    this.constrains.push({ method: 'min', params: { value, message } });
    return this;
  }

  /**
   * Use it if you want to validate a the max of the string
   */
  public max(value: number, message: string): Omit<StringRulesBuilder, 'max'> {
    this.constrains.push({ method: 'max', params: { value, message } });
    return this;
  }

  /**
   * Use it if you want to ensure a string lowercase
   */
  public lowercase(message: string): Omit<StringRulesBuilder, 'lowercase'> {
    this.constrains.push({ method: 'lowercase', params: { message } });
    return this;
  }

  /**
   * Use it if you want to ensure a string uppercase
   */
  public uppercase(message: string): Omit<StringRulesBuilder, 'uppercase'> {
    this.constrains.push({ method: 'uppercase', params: { message } });
    return this;
  }

  /**
   * Use it if you want to ensure a string matches a given pattern
   */
  public matches(regex: RegExp, message: string): Omit<StringRulesBuilder, 'matches'> {
    this.constrains.push({ method: 'matches', params: { value: regex, message } });
    return this;
  }

  /**
   * Use it if you want to ensure a string has a given length
   */
  public length(value: number, message: string): Omit<StringRulesBuilder, 'length'> {
    this.constrains.push({ method: 'length', params: { value, message } });
    return this;
  }

  /**
   * Use it if you want to validate a password to be strong
   *
   * **Custom validation**
   */
  public securePassword(message: string): Omit<StringRulesBuilder, 'securePassword'> {
    this.constrains.push({
      method: 'matches',
      params: { value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/, message },
    });
    return this;
  }

  /**
   * **Custom validation**
   *
   * Use it if you want to validate a NIF. https://www.exteriores.gob.es/Embajadas/telaviv/en/ServiciosConsulares/Paginas/Consular/NIF.aspx
   */
  public nif(message: string): Omit<StringRulesBuilder, 'nif'> {
    this.constrains.push({
      method: 'matches',
      params: { value: /^(?![0-9]{2})[a-zA-Z0-9]*[a-zA-Z0-9]/, message },
    });
    return this;
  }

  /**
   * If you are done, just use this to get
   * all the validation rules configuration and
   * use it into you controller.
   *
   * @example
   * {
   *  type: 'password'
   *  name : 'mypassword',
   *  validationRules: StringRulesBuilder.new().required('message').get(),
   * }
   */
  public get(): ValidationRulesTypes {
    return { type: 'string', constrains: this.constrains };
  }

  public static new(): StringRulesBuilder {
    return new StringRulesBuilder();
  }
}

/**
 * ### Number Validations Rules Builder
 * 📌You can add more needed and custom validation here. Don't worry this module is open to change, it's normal for now! 😉
 * @author <pino0071@gmail.com> Jose Aburto
 */
export class NumberRulesBuilder {
  private constrains: NumberValidationConstrains[] = [];

  /**
   * Use it if you want to validate a number is present always.
   */
  public required(message: string): Omit<NumberRulesBuilder, 'required'> {
    this.constrains.push({ method: 'required', params: { message } });
    return this;
  }

  /**
   * Set the minimum value allowed. The `min` interpolation can be used in the message argument.
   */
  public min(value: number, message: string): Omit<NumberRulesBuilder, 'min'> {
    this.constrains.push({ method: 'min', params: { value, message } });
    return this;
  }

  /**
   * Set the maximum value allowed. The `max` interpolation can be used in the message argument.
   */
  public max(value: number, message: string): Omit<NumberRulesBuilder, 'max'> {
    this.constrains.push({ method: 'max', params: { value, message } });
    return this;
  }

  /**
   * Value must be less than max. The `less` interpolation can be used in the `message` argument.
   */
  public lessThan(value: number, message: string): Omit<NumberRulesBuilder, 'lessThan'> {
    this.constrains.push({ method: 'lessThan', params: { value, message } });
    return this;
  }

  /**
   * Value must be strictly greater than min. The `more` interpolation can be used in the `message` argument.
   */
  public moreThan(value: number, message: string): Omit<NumberRulesBuilder, 'moreThan'> {
    this.constrains.push({ method: 'moreThan', params: { value, message } });
    return this;
  }

  /**
   * Value must be a positive number.
   */
  public positive(message: string): Omit<NumberRulesBuilder, 'positive'> {
    this.constrains.push({ method: 'positive', params: { message } });
    return this;
  }
  /**
   * Value must be a negative number.
   */
  public negative(message: string): Omit<NumberRulesBuilder, 'negative'> {
    this.constrains.push({ method: 'negative', params: { message } });
    return this;
  }

  /**
   * If you are done, just use this to get
   * all the validation rules configuration and
   * use it into you controller.
   *
   * @example
   * {
   *  type: 'number'
   *  name : 'money',
   *  validationRules: NumberRulesBuilder.new().min(1000, 'please, give more money to your brother! xD').get(),
   * }
   */
  public get(): ValidationRulesTypes {
    return { type: 'number', constrains: this.constrains };
  }

  public static new(): NumberRulesBuilder {
    return new NumberRulesBuilder();
  }
}

/**
 * ### Mixed Validations Rules Builder
 * @author <pino0071@gmail.com> Jose Aburto
 */
export class MixedRulesBuilder {
  private constrains: MixedValidationConstrains[] = [];

  private constructor() {
    this.constrains = [];
  }

  /**
   * Use it if you want to validate required the value
   */
  public required(message: string): Omit<MixedRulesBuilder, 'required'> {
    this.constrains.push({ method: 'required', params: { message } });
    return this;
  }

  /**
   * Use it if you want to validate a range of values not included
   */
  public notOneOf(value: any[], message: string): Omit<MixedRulesBuilder, 'notOneOf'> {
    this.constrains.push({ method: 'notOneOf', params: { value, message } });
    return this;
  }

  /**
   * Use it if you want to validate a range of values included
   */
  public oneOf(value: any[], message: string): Omit<MixedRulesBuilder, 'oneOf'> {
    this.constrains.push({ method: 'oneOf', params: { value, message } });
    return this;
  }

  /**
   * If you are done, just use this to get
   * all the validation rules configuration and
   * use it into you controller.
   *
   * @example
   * {
   *  type: 'password'
   *  name : 'mypassword',
   *  validationRules: MixedRulesBuilder.new().required('message').get(),
   * }
   */
  public get(): ValidationRulesTypes {
    return { type: 'mixed', constrains: this.constrains };
  }

  public static new(): MixedRulesBuilder {
    return new MixedRulesBuilder();
  }
}

export class ValidationRulesBuilder {
  public static string(): StringRulesBuilder {
    return StringRulesBuilder.new();
  }

  public static number(): NumberRulesBuilder {
    return NumberRulesBuilder.new();
  }

  public static mixed(): MixedRulesBuilder {
    return MixedRulesBuilder.new();
  }
}
