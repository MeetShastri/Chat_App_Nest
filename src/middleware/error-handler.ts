import { Response } from 'express';
import { HTTP_STATUS, RES_MESSAGE } from 'src/constant/message.constant';

//We made this function to avoid repetition of code so it can be reused..
export function handleServerError(res: Response, error: Error) {
  console.error('Server Error:', error);
  return res.status(HTTP_STATUS.SERVER_ERROR).json({
    message: RES_MESSAGE.UNEXPECTED_ERROR,
    error: error.message,
  });
}
