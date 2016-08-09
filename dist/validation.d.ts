/**
 * Represents a validation rule
 */
export declare class ValidationRule implements IValidationRule {
    protected conditions: Array<Function>;
    fromValue: any;
    toValue: any;
    params: Object;
    private _invalidMessage;
    constructor(params?: any);
    /**
     * Retrieves the invalid message for the ValidationRule
     */
    invalidMessage: string;
    /**
     * Checks if the ValidationRule is valid
     */
    isValid(fromValue: any, toValue: any): Boolean;
    /**
     * Ads an invalid message to the ValidationRule
     */
    addInvalidMessage(message: String): void;
}
/**
 * ValidationRule implementation
 */
export interface IValidationRule {
    params: any;
    invalidMessage: String;
    validate(): any;
}
export declare class LengthValidator extends ValidationRule {
    protected conditions: Array<Function>;
}
/**
 * RegExpValidator
 */
export declare class RegExpValidator extends ValidationRule {
    protected conditions: Array<Function>;
}
/**
 * EmailValidator
 */
export declare class EmailValidator extends ValidationRule {
    protected conditions: Array<Function>;
}
/**
 * RequiredValidator
 */
export declare class RequiredValidator extends ValidationRule {
    protected conditions: Array<Function>;
}
export declare class AllowedValueSwitchValidator extends ValidationRule {
    protected conditions: Array<Function>;
}
