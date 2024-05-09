export enum ErrorType {
    INTERNAL_SERVER_ERROR = 'InternalServerError',
    TIMED_OUT = 'TimedOut',
    FILE_NOT_FOUND = 'FileNotFound',
}

export enum ErrorMessage {
    INTERNAL_SERVER_ERROR = 'Something went wrong, please contact support.',
    TIMED_OUT = 'Request took longer than expected.',
    FILE_NOT_FOUND = 'File not found',
}

export enum ErrorCode {
    FILE_NOT_FOUND = 'file_not_found',
}

export class CustomError extends Error {
    name: string;
    statusCode: number;

    constructor(
        message: string | SafeAny,
        name = 'Unknown Error',
        error: Error | null = null,
        statusCode = 400,
    ) {
        if (typeof message === 'object') {
            message = JSON.stringify(message, null, 2);
        }
        super(message);
        this.name = name;
        this.statusCode = statusCode;
        this.stack = error?.stack;
    }

    static get(
        errorType: ErrorType,
        error: Error | null = null,
        isBadRequest = true,
    ): CustomError {
        let errorMessage = ErrorMessage.INTERNAL_SERVER_ERROR;
        switch (errorType) {
            case ErrorType.INTERNAL_SERVER_ERROR:
                errorMessage = ErrorMessage.INTERNAL_SERVER_ERROR;
                break;
            case ErrorType.TIMED_OUT:
                errorMessage = ErrorMessage.TIMED_OUT;
                break;
        }

        return new CustomError(
            errorMessage,
            errorType,
            error,
            isBadRequest ? 400 : 500,
        );
    }
}
