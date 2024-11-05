# Pumpkin - облачный канбан

Управляйте проектами и задачами с помощью современных сервисов!

В этом репозитории находится фронтовая часть проекта. Фронт сделан на pure js (+jsx +ts).

### Участники проекта

Менторы:

- [Сергей Щербаков](https://github.com/f4lkr4m)
- Ирина Кабаева

Студенты:

- [Георгий Жуков](https://github.com/dedxyk594)
- [Константин Сафронов](https://github.com/kosafronov)
- [Валентин Стремин](https://github.com/supchaser)

### Ресурсы

<a href="https://www.figma.com/design/ItV72t8ctm64h9y5KBSGrt/Pumpkin?m=auto&t=lbxUX0Ehi3psw172-1">Макеты интерфейса (Figma)</a>

<a href="https://github.com/go-park-mail-ru/2024_2_RPO/blob/swagger_dev/openapi.yaml">Swagger (описание API)</a>

### Запуск Development Server

Перед запуском надо создать файл `src/config.ts` и в нём разместить конфигурацию:

```ts
export const apiUrl="https://mysite.com" // Без замыкающего слеша! Если значение будет 'mock', будут использованы моки
```

`npm i` - установить все зависимости

`npm run start` - запустить Development Server

### Дополнительные команды

`npm run lint` - запустить линтер
