import { IsDecimal, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { isValidJSONDateTime } from "src/validators";

export class CreateIncomeDto {
    @IsOptional()
    @IsString()
    description?: string;

    @IsDecimal({ force_decimal: true, decimal_digits: '1,2' })
    amount: number;

    @isValidJSONDateTime()
    date: Date;
}
