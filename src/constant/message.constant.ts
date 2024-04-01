//Exporting libraries used in project
export * as bcrypt from 'bcrypt';
export * as jwt from 'jsonwebtoken';

//All response messages
export const RES_MESSAGE = {
  EMAIL_IN_USE:
    'Email or UserName is already in use please use another mail or name',
  FIELDS_REQUIRED:
    'Invalid message data. SenderId, recipientId, and content are required.',
  REGISTERED: 'You are successfully registered please login..',
  UNEXPECTED_ERROR: 'An Unexpected error occured',
  USER_NOT_FOUND: 'User not found',
  PASSWORD_INCORRECT: 'Password is incorrect. Enter valid password',
  LOGIN: 'You are successfully logged in..!',
  PASSWORD_RESET: 'Password reset successfully!!',
  EXPIRE_TIME: '4h',
  SENDER_NOT_FOUND: 'Sender not found',
  RECIEVER_NOT_FOUND: 'Reciever not found',
  MESSAGE_SENT: 'Message sent successfully',
  NO_CHATS: 'No chats between this two users',
  YOUR_CHATS: 'Here are all your chats',
  MESSAGE_UPDATED: 'Your message is updated successfully',
  CHAT_NOT_FOUND: 'Chat with this id is not found',
  CHAT_DELETED: 'Chat has been deleted successfully',
  TOKEN_REQUIRED: 'Token is required',
  TOKEN_NOT_MATCHING_SENDER: 'Token does not match with senderId',
  TOKEN_INCORRECT: 'Token is incorrect for senderId or recipientId',
  NOT_ALLOWED: 'You are not allowed to update or delete the chat',
};

//All status code
export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  SUCCESS: 200,
  CREATED: 201,
  SERVER_ERROR: 500,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
};
