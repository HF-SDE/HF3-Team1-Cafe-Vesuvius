export interface IAPIResponse { 
    status: Status;
    message?: string;
}

export enum Status {
    UnAuthorized = 'Unauthorized',
    Forbidden = 'Forbidden',
    Success = 'Success',
    Failed = 'Failed',
    Found = 'Found',
    NotFound = 'NotFound',
    Created = 'Created',
    CreationFailed = 'CreationFailed',
    Deleted = 'Deleted',
    DeleteFailed = 'DeletionFailed',
    Updated = 'Updated',
    UpdateFailed = 'UpdateFailed',
    MissingDetails = 'MissingDetails',
    InvalidDetails = 'InvalidDetails',
    MissingCredentials = 'MissingCredentials',
    InvalidCredentials = 'InvalidCredentials',
}

export interface APIResponse<T> {
    status: Status;
    message?: string;
    data: T | null;
}
