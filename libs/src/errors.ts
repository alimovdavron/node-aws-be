interface IProductServiceError {
    statusCode: number,
    message: string
}

export class ProductServiceError extends Error implements IProductServiceError {
    statusCode: number;
    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class ValidationError extends ProductServiceError implements IProductServiceError {
    constructor(message: string) {
        super(400, `ValidationError: ${message}`);
    }
}
