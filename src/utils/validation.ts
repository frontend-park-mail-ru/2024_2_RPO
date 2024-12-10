interface IValidationResult {
  allowed: boolean;
  validationMessage: string | undefined;
}

const EMAIL_ALLOWED_SYMBOLS = /[a-zA-Z0-9_.@-]*/;
const NICKNAME_ALLOWED_SYMBOLS = /^[a-zA-Z0-9_.]*$/;
const EMAIL_REGEX =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

const hasUpperCase = /[A-Z]+/;

const hasLowerCase = /[a-z]+/;

const hasDigits = /\d+/;

// eslint-disable-next-line no-useless-escape
const hasSpecialSymbol = /[!#&.,?/\\(){}\[\]"'`;:|<>*^%~]+/;

export const validateEmail = (email: string): IValidationResult => {
  if (email === '') {
    return { allowed: false, validationMessage: undefined };
  }
  if (!EMAIL_ALLOWED_SYMBOLS.test(email)) {
    return {
      allowed: false,
      validationMessage: 'Содержит недопустимые символы',
    };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { allowed: false, validationMessage: 'Некорректный email' };
  }
  return { allowed: true, validationMessage: undefined };
};

export const validateNickname = (nickname: string): IValidationResult => {
  if (nickname === '') {
    return { allowed: false, validationMessage: undefined };
  }
  if (!NICKNAME_ALLOWED_SYMBOLS.test(nickname)) {
    return {
      allowed: false,
      validationMessage: 'Содержит недопустимые символы',
    };
  }
  if (nickname.length < 3) {
    return {
      allowed: false,
      validationMessage: 'Не менее 3 символов',
    };
  }
  if (nickname.length > 20) {
    return {
      allowed: false,
      validationMessage: 'Не более 20 символов',
    };
  }
  return { allowed: true, validationMessage: undefined };
};

export const validatePassword = (password: string): IValidationResult => {
  if (password === '') {
    return { allowed: false, validationMessage: undefined };
  }

  if (password.length > 50) {
    return {
      allowed: false,
      validationMessage: 'должен быть не более 50 символов',
    };
  }

  const validationMessage: string[] = [];
  if (password.length < 8) {
    validationMessage.push('должен быть не менее 8 символов');
  }
  if (!hasUpperCase.test(password) && !hasLowerCase.test(password)) {
    validationMessage.push(
      'должен содержать заглавную и строчную латинские буквы'
    );
  } else if (!hasUpperCase.test(password)) {
    validationMessage.push('должен содержать заглавную латинскую букву');
  } else if (!hasLowerCase.test(password)) {
    validationMessage.push('должен содержать строчную латинскую букву');
  }
  if (!hasDigits.test(password)) {
    validationMessage.push('должен содержать цифру');
  }
  if (!hasSpecialSymbol.test(password)) {
    validationMessage.push('должен содержать специальный символ');
  }
  if (validationMessage.length > 0) {
    return { allowed: false, validationMessage: validationMessage.join(', ') };
  }
  return { allowed: true, validationMessage: undefined };
};
