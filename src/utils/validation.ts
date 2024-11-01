interface IValidationResult {
  allowed: boolean;
  validationMessage: string | undefined;
}

export const validateEmail = (email: string): IValidationResult => {
  if (email === '') {
    return { allowed: false, validationMessage: undefined };
  }
  return { allowed: false, validationMessage: 'Not implemented' };
};
export const validateNickname = (nickname: string): IValidationResult => {
  if (nickname === '') {
    return { allowed: false, validationMessage: undefined };
  }
  return { allowed: false, validationMessage: 'Not implemented' };
};
export const validatePassword = (password: string): IValidationResult => {
  if (password === '') {
    return { allowed: false, validationMessage: undefined };
  }
  return { allowed: false, validationMessage: 'Not implemented' };
};
