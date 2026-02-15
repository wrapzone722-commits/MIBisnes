# Деплой MIbisnes на App Platform

## На чём делаем проект (стек)

| Что | Технология |
|-----|------------|
| Фронтенд | **React 18** |
| Сборка | **Vite 5** |
| Стили | CSS (без фреймворка) |
| Хранение данных | **localStorage** (в браузере) |
| Деплой | **Статический сайт** (папка `dist` после сборки) |

На App Platform проект собирается как **Static Site** с окружением **Node.js**: устанавливаются зависимости, выполняется `npm run build`, в прод отдаётся содержимое папки `dist`.

---

## Команды для деплоя

### 1. Подготовка репозитория (один раз)

Создайте репозиторий на **GitHub** (или GitLab) и запушьте проект. В корне MIbisnes выполните:

```powershell
cd C:\Users\дом\MIbisnes

git init
git add .
git commit -m "MIbisnes: учёт расходов детейлинг"

git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/MIbisnes.git
git push -u origin main
```

Создайте ветку для App Platform и запушьте её:

```powershell
git checkout -b app-platform
git push -u origin app-platform
```

### 2. Настройка в DigitalOcean App Platform

1. Откройте https://cloud.digitalocean.com/apps
2. **Create App** → **GitHub** → выберите репозиторий **MIbisnes**
3. Ветку укажите: **app-platform** (или `main`, если деплоите с неё)
4. Тип: **Static Site**
5. Заполните:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment:** Node.js (обычно подставляется по `package.json`)
6. **Launch App** и дождитесь сборки.

Либо используйте конфиг из репозитория: в настройках укажите, что приложение задаётся через **App Spec**, и загрузите/укажите файл `.do/app.yaml` (перед этим в `.do/app.yaml` замените `YOUR_GITHUB_USERNAME` на свой GitHub username и при необходимости ветку).

### 3. Локальная сборка (проверка перед деплоем)

```powershell
cd C:\Users\дом\MIbisnes
npm install
npm run build
```

Готовый сайт будет в папке **`dist/`**. Его можно залить на любой статический хостинг.

### 4. Деплой через doctl (по желанию)

Установите [doctl](https://docs.digitalocean.com/sections/developers-tools/doctl/), авторизуйтесь, затем:

```powershell
cd C:\Users\дом\MIbisnes
doctl apps create --spec .do/app.yaml
```

Или обновление уже созданного приложения:

```powershell
doctl apps update YOUR_APP_ID --spec .do/app.yaml
```

---

## Кратко: команды по шагам

```powershell
# Перейти в проект
cd C:\Users\дом\MIbisnes

# Сборка (для проверки)
npm install
npm run build

# Инициализация Git и первый пуш (подставьте свой репозиторий)
git init
git add .
git commit -m "MIbisnes"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/MIbisnes.git
git push -u origin main

# Ветка для App Platform
git checkout -b app-platform
git push -u origin app-platform
```

Дальше в панели App Platform создайте приложение из этого репозитория и ветки **app-platform**, указав Build Command `npm run build` и Output Directory `dist`.
