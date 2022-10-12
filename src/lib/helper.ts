import { validate, ValidationError } from 'class-validator';
import { ObjectLiteral, QueryRunner } from 'typeorm';
import { get, has, isObject, merge, each, isEmpty } from 'lodash';
import { Response } from 'express';


type CustomError = {
    message: string;
    data: unknown;
  };

export const readValidatePostBody = async <T>(
    Dto: { new (): T },
    body: unknown,
    validationOptions: Parameters<typeof validate>[2] = undefined,
  ): Promise<[T, ValidationError[]]> => {
    let dto = new Dto();
    dto = merge(dto, body);
    const validationErrors = await validate(dto as ObjectLiteral, validationOptions);
    return [dto, validationErrors];
  };


  
export const handleErrors = (res: Response, validationErrors: unknown): void => {
    const err: CustomError = {
      message: 'validation failed. see error data for details',
      data: validationErrors,
    };
  
    res.status(400).json(err);
    return;
  };

  export const sendSuccess = (res: Response, message: string, data:unknown) => {
    if (message === '') {
      return res.status(204).send();
    } else {
      return res.status(200).send({ message,data });
    }
  };
  
  export const handleClientError = (res: Response, message: string) => {
    const err: Partial<CustomError> = {
      message,
    };
  
    res.status(400).json(err);
    return;
  };
