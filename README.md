# MIbisnes

Веб-приложение учёта расходов для детейлинга. Учёт по автомобилям: доход (цена работы), расходы с комментариями, остаток.

## Возможности

- **Авто**: марка, модель, цена (доход), ₽
- **Расходы**: кнопка «Добавить расход» — сумма и комментарий по каждому авто
- **Итоги**: доход, расход и остаток по каждому авто и общий итог

Данные хранятся в браузере (localStorage).

## Репозиторий (GitHub)

- HTTPS: `https://github.com/wrapzone722-commits/MIBisnes.git`
- Пуш: `git push -u origin main` (при запросе — логин GitHub и пароль или Personal Access Token)

## Запуск локально

```bash
npm install
npm run dev
```

Откройте http://localhost:5173

## Сборка для деплоя (App Platform / статический хостинг)

```bash
npm install
npm run build
```

Папка `dist/` — статический сайт. Разместите её на любом хостинге (Team Web Cloud App Platform, Netlify, Vercel, nginx и т.д.).

- **Root**: папка `dist` или содержимое `dist`
- **Base path**: в проекте задан `base: './'` в `vite.config.js` для работы в подпапках

## Timeweb Cloud (App Platform)

Токен API сохранён в `.env` (переменная `TWC_API_TOKEN`). Файл `.env` в `.gitignore` и в репозиторий не попадает.

**Подключение CLI к Timeweb Cloud:**
```powershell
# Один раз: pip install twc-cli
.\timeweb-connect.ps1
```

**Деплой в панели:** [App Platform](https://timeweb.cloud/docs/apps) → Создать → тип **React**, репозиторий `https://github.com/wrapzone722-commits/MIBisnes`, ветка `main`. Команда сборки: `npm run build`, каталог вывода: `dist`.

## Ветка App Platform

Для деплоя в Team Web Cloud в ветке **App Platform** используйте эту ветку и загружайте собранный проект (результат `npm run build`) согласно инструкциям вашей платформы.
