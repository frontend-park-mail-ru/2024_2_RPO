// import { Button } from '@/components/Button';
// import { Input } from '@/components/Input';
// import { ModalDialog } from '@/components/ModalDialog';
// import { useState } from '@/jsxCore/hooks';
// import { ComponentProps } from '@/jsxCore/types';
// import { noop } from '@/utils/noop';

// interface RegistrationDialogProps extends ComponentProps {
//   closeCallback?: () => any;
// }

// export const RegistrationDialog = (props: RegistrationDialogProps) => {
//   const [data, setData] = useState({
//     login: '',
//     email: '',
//     password: '',
//     repeatPassword: '',
//   });
//   const [isLoginTaken, setIsLoginTaken] = useState(false);
//   const [isEmailTaken, setIsEmailTaken] = useState(false);

//   const checkIfUserExists = async (field: 'login' | 'email', value: string) => {
//     const existingUsers = {
//       login: 'existingLogin',
//       email: 'existing@example.com',
//     };
//     if (field === 'login') {
//       setIsLoginTaken(value === existingUsers.login);
//     } else if (field === 'email') {
//       setIsEmailTaken(value === existingUsers.email);
//     }
//   };

//   const allowedCharactersRegex = /^[a-zA-Z1-9!#@<>]*$/;

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const validateAllowedCharacters = (value: string) => {
//     return allowedCharactersRegex.test(value)
//       ? ''
//       : 'Используйте только латинские буквы, цифры 1-9 и символы !, #, @, <';
//   };

//   const validateEmail = (email: string) => {
//     if (email === '') return;
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!allowedCharactersRegex.test(email)) {
//       return 'Используйте только латинские буквы, цифры 1-9 и символы !, #, @, <';
//     }
//     return emailRegex.test(email) ? '' : 'Введите корректный email';
//   };

//   const validatePasswordMatch = (password: string, repeatPassword: string) => {
//     if (repeatPassword === '') return;
//     return password === repeatPassword ? '' : 'Пароли не совпадают';
//   };

//   const getValidationMessage = () => {
//     if (isLoginTaken && isEmailTaken) return 'Логин и Email уже заняты';
//     if (isLoginTaken) return 'Логин уже занят';
//     if (isEmailTaken) return 'Email уже занят';
//     return '';
//   };

//   return (
//     <ModalDialog
//       key="modal_dialog"
//       closeCallback={props.closeCallback}
//       title="Добро пожаловать в Pumpkin!"
//       isOpened={true}
//     >
//       <div className="login-form__wrapper">
//         <div className="login-form">
//           <div style="display: flex; justify-content: end">
//             <label htmlFor="nickname">Логин:</label>
//           </div>
//           <Input
//             key="nickname_input"
//             onChanged={(newLogin) => {
//               setData({ ...data, login: newLogin });
//               checkIfUserExists('login', newLogin);
//             }}
//             validationMessage={(() => {
//               const errorMessage = getValidationMessage();
//               if (errorMessage) return errorMessage;
//               if (!allowedCharactersRegex.test(data.login)) {
//                 return 'Используйте только латинские буквы, цифры 1-9 и символы !, #, @, <';
//               }
//               if (data.login === '') return;
//               if (data.login.length < 3 || data.login.length > 30) {
//                 return 'Логин должен быть от 3 до 30 символов';
//               }
//             })()}
//           />
//           <div style="display: flex; justify-content: end">
//             <label htmlFor="email">Email:</label>
//           </div>
//           <Input
//             key="email_input"
//             onChanged={(newEmail) => {
//               setData({ ...data, email: newEmail });
//               checkIfUserExists('email', newEmail);
//             }}
//             validationMessage={(() => {
//               const errorMessage = getValidationMessage();
//               if (errorMessage) return errorMessage;
//               return validateEmail(data.email);
//             })()}
//           />
//           <div style="display: flex; justify-content: end">
//             <label htmlFor="password">Пароль:</label>
//           </div>
//           <Input
//             key="password_input"
//             onChanged={(newPassword) => {
//               setData({ ...data, password: newPassword });
//             }}
//             validationMessage={(() => {
//               if (!allowedCharactersRegex.test(data.password)) {
//                 return 'Используйте только латинские буквы, цифры 1-9 и символы !, #, @, <';
//               }
//               if (data.password === '') return;
//               if (data.password.length < 8) {
//                 return 'Пароль должен быть не менее 8 символов';
//               }
//             })()}
//           />
//           <div style="display: flex; justify-content: end">
//             <label htmlFor="repeat_password">Повторите пароль:</label>
//           </div>
//           <Input
//             key="repeat_password_input"
//             onChanged={(newRepeatPassword) => {
//               setData({ ...data, repeatPassword: newRepeatPassword });
//             }}
//             validationMessage={(() => {
//               if (!allowedCharactersRegex.test(data.repeatPassword)) {
//                 return 'Используйте только латинские буквы, цифры 1-9 и символы !, #, @, <';
//               }
//               return validatePasswordMatch(data.password, data.repeatPassword);
//             })()}
//           />
//         </div>
//         <div className="login-form__button-container">
//           <Button
//             key="submit_btn"
//             variant="positive"
//             callback={noop}
//             text="Войти!"
//           />
//         </div>
//       </div>
//     </ModalDialog>
//   );
// };

// import { Button } from '@/components/Button';
// import { Input } from '@/components/Input';
// import { ModalDialog } from '@/components/ModalDialog';
// import { useState } from '@/jsxCore/hooks';
// import { ComponentProps } from '@/jsxCore/types';
// import { noop } from '@/utils/noop';

// interface RegistrationDialogProps extends ComponentProps {
//   closeCallback?: () => any;
// }

// interface InputProps {
//   key: string;
//   onChanged: (value: string) => void;
//   validationMessage?: string;
// }

// // Обертка для Input, добавляющая поддержку type
// const CustomInput = ({ type, ...props }: InputProps & { type?: string }) => {
//   return <Input {...props} {...(type ? { type } : {})} />;
// };

// export const RegistrationDialog = (props: RegistrationDialogProps) => {
//   const [data, setData] = useState({
//     login: '',
//     email: '',
//     password: '',
//     repeatPassword: '',
//   });
//   const [isLoginTaken, setIsLoginTaken] = useState(false);
//   const [isEmailTaken, setIsEmailTaken] = useState(false);

//   const checkIfUserExists = async (field: 'login' | 'email', value: string) => {
//     const existingUsers = {
//       login: 'existingLogin',
//       email: 'existing@example.com',
//     };
//     if (field === 'login') {
//       setIsLoginTaken(value === existingUsers.login);
//     } else if (field === 'email') {
//       setIsEmailTaken(value === existingUsers.email);
//     }
//   };

//   const allowedCharactersRegex = /^[a-zA-Z1-9!#@<>]*$/;

//   const validateEmail = (email: string) => {
//     if (email === '') return;
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!allowedCharactersRegex.test(email)) {
//       return 'Используйте только латинские буквы, цифры 1-9 и символы !, #, @, <';
//     }
//     return emailRegex.test(email) ? '' : 'Введите корректный email';
//   };

//   const validatePasswordMatch = (password: string, repeatPassword: string) => {
//     if (repeatPassword === '') return;
//     return password === repeatPassword ? '' : 'Пароли не совпадают';
//   };

//   const getValidationMessage = () => {
//     if (isLoginTaken && isEmailTaken) return 'Логин и Email уже заняты';
//     if (isLoginTaken) return 'Логин уже занят';
//     if (isEmailTaken) return 'Email уже занят';
//     return '';
//   };

//   return (
//     <ModalDialog
//       key="modal_dialog"
//       closeCallback={props.closeCallback}
//       title="Добро пожаловать в Pumpkin!"
//       isOpened={true}
//     >
//       <div className="login-form__wrapper">
//         <div className="login-form">
//           <div style={{ display: 'flex', justifyContent: 'end' }}>
//             <label htmlFor="nickname">Логин:</label>
//           </div>
//           <CustomInput
//             key="login_input"
//             onChanged={(newLogin: string) => {
//               setData({ ...data, login: newLogin });
//               checkIfUserExists('login', newLogin);
//             }}
//             validationMessage={(() => {
//               const errorMessage = getValidationMessage();
//               if (errorMessage) return errorMessage;
//               if (!allowedCharactersRegex.test(data.login)) {
//                 return 'Используйте только латинские буквы, цифры 1-9 и символы !, #, @, <';
//               }
//               if (data.login === '') return;
//               if (data.login.length < 3 || data.login.length > 30) {
//                 return 'Логин должен быть от 3 до 30 символов';
//               }
//             })()}
//           />
//           <div style={{ display: 'flex', justifyContent: 'end' }}>
//             <label htmlFor="email">Email:</label>
//           </div>
//           <CustomInput
//             key="email_input"
//             onChanged={(newEmail: string) => {
//               setData({ ...data, email: newEmail });
//               checkIfUserExists('email', newEmail);
//             }}
//             validationMessage={(() => {
//               const errorMessage = getValidationMessage();
//               if (errorMessage) return errorMessage;
//               return validateEmail(data.email);
//             })()}
//           />
//           <div style={{ display: 'flex', justifyContent: 'end' }}>
//             <label htmlFor="password">Пароль:</label>
//           </div>
//           <CustomInput
//             key="password_input"
//             type="password" // Указываем тип напрямую
//             onChanged={(newPassword: string) => {
//               setData({ ...data, password: newPassword });
//             }}
//             validationMessage={(() => {
//               if (!allowedCharactersRegex.test(data.password)) {
//                 return 'Используйте только латинские буквы, цифры 1-9 и символы !, #, @, <';
//               }
//               if (data.password === '') return;
//               if (data.password.length < 8) {
//                 return 'Пароль должен быть не менее 8 символов';
//               }
//             })()}
//           />
//           <div style={{ display: 'flex', justifyContent: 'end' }}>
//             <label htmlFor="repeat_password">Повторите пароль:</label>
//           </div>
//           <CustomInput
//             key="repeat_password_input"
//             type="password" // Указываем тип напрямую
//             onChanged={(newRepeatPassword: string) => {
//               setData({ ...data, repeatPassword: newRepeatPassword });
//             }}
//             validationMessage={(() => {
//               if (!allowedCharactersRegex.test(data.repeatPassword)) {
//                 return 'Используйте только латинские буквы, цифры 1-9 и символы !, #, @, <';
//               }
//               return validatePasswordMatch(data.password, data.repeatPassword);
//             })()}
//           />
//         </div>
//         <div className="login-form__button-container">
//           <Button
//             key="submit_btn"
//             variant="positive"
//             callback={noop}
//             text="Войти!"
//           />
//         </div>
//       </div>
//     </ModalDialog>
//   );
// };

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ModalDialog } from '@/components/ModalDialog';
import { useState } from '@/jsxCore/hooks';
import { ComponentProps } from '@/jsxCore/types';
import { noop } from '@/utils/noop';

interface RegistrationDialogProps extends ComponentProps {
  closeCallback?: () => any;
}

export const RegistrationDialog = (props: RegistrationDialogProps) => {
  const [data, setData] = useState({
    login: '',
    email: '',
    password: '',
    repeatPassword: '',
  });
  const [isLoginTaken, setIsLoginTaken] = useState(false);
  const [isEmailTaken, setIsEmailTaken] = useState(false);

  const checkIfUserExists = async (field: 'login' | 'email', value: string) => {
    const existingUsers = {
      login: 'existingLogin',
      email: 'existing@example.com',
    };
    if (field === 'login') {
      setIsLoginTaken(value === existingUsers.login);
    } else if (field === 'email') {
      setIsEmailTaken(value === existingUsers.email);
    }
  };

  const allowedCharactersRegex = /^[a-zA-Z1-9!#@<>]*$/;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const validateAllowedCharacters = (value: string) => {
    return allowedCharactersRegex.test(value)
      ? ''
      : 'Используйте только латинские буквы, цифры 1-9 и символы !, #, @, <';
  };

  const validateEmail = (email: string) => {
    if (email === '') return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!allowedCharactersRegex.test(email)) {
      return 'Используйте только латинские буквы, цифры 1-9 и символы !, #, @, <';
    }
    return emailRegex.test(email) ? '' : 'Введите корректный email';
  };

  const validatePasswordMatch = (password: string, repeatPassword: string) => {
    if (repeatPassword === '') return;
    return password === repeatPassword ? '' : 'Пароли не совпадают';
  };

  const getValidationMessage = () => {
    if (isLoginTaken && isEmailTaken) return 'Логин и Email уже заняты';
    if (isLoginTaken) return 'Логин уже занят';
    if (isEmailTaken) return 'Email уже занят';
    return '';
  };

  return (
    <ModalDialog
      key="modal_dialog"
      closeCallback={props.closeCallback}
      title="Добро пожаловать в Pumpkin!"
      isOpened={true}
    >
      <div className="login-form__wrapper">
        <div className="login-form">
          <div style="display: flex; justify-content: end">
            <label htmlFor="nickname">Логин:</label>
          </div>
          <Input
            key="nickname_input"
            onChanged={(newLogin) => {
              setData({ ...data, login: newLogin });
              checkIfUserExists('login', newLogin);
            }}
            validationMessage={(() => {
              const errorMessage = getValidationMessage();
              if (errorMessage) return errorMessage;
              if (!allowedCharactersRegex.test(data.login)) {
                return 'Используйте только латинские буквы, цифры 1-9 и символы !, #, @, <';
              }
              if (data.login === '') return;
              if (data.login.length < 3 || data.login.length > 30) {
                return 'Логин должен быть от 3 до 30 символов';
              }
            })()}
          />
          <div style="display: flex; justify-content: end">
            <label htmlFor="email">Email:</label>
          </div>
          <Input
            key="email_input"
            onChanged={(newEmail) => {
              setData({ ...data, email: newEmail });
              checkIfUserExists('email', newEmail);
            }}
            validationMessage={(() => {
              const errorMessage = getValidationMessage();
              if (errorMessage) return errorMessage;
              return validateEmail(data.email);
            })()}
          />
          <div style="display: flex; justify-content: end">
            <label htmlFor="password">Пароль:</label>
          </div>
          <Input
            key="password_input"
            onChanged={(newPassword) => {
              setData({ ...data, password: newPassword });
            }}
            validationMessage={(() => {
              if (!allowedCharactersRegex.test(data.password)) {
                return 'Используйте только латинские буквы, цифры 1-9 и символы !, #, @, <';
              }
              if (data.password === '') return;
              if (data.password.length < 8) {
                return 'Пароль должен быть не менее 8 символов';
              }
            })()}
          />
          <div style="display: flex; justify-content: end">
            <label htmlFor="repeat_password">Повторите пароль:</label>
          </div>
          <Input
            key="password_input"
            type="password" // добавлен атрибут type для скрытия ввода
            onChanged={(newPassword) => {
              setData({ ...data, password: newPassword });
            }}
            validationMessage={(() => {
              if (!allowedCharactersRegex.test(data.password)) {
                return 'Используйте только латинские буквы, цифры 1-9 и символы !, #, @, <';
              }
              if (data.password === '') return;
              if (data.password.length < 8) {
                return 'Пароль должен быть не менее 8 символов';
              }
            })()}
          />
          <Input
            key="repeat_password_input"
            type="password" // добавлен атрибут type для скрытия ввода
            onChanged={(newRepeatPassword) => {
              setData({ ...data, repeatPassword: newRepeatPassword });
            }}
            validationMessage={(() => {
              if (!allowedCharactersRegex.test(data.repeatPassword)) {
                return 'Используйте только латинские буквы, цифры 1-9 и символы !, #, @, <';
              }
              return validatePasswordMatch(data.password, data.repeatPassword);
            })()}
          />
        </div>
        <div className="login-form__button-container">
          <Button
            key="submit_btn"
            variant="positive"
            callback={noop}
            text="Войти!"
          />
        </div>
      </div>
    </ModalDialog>
  );
};
