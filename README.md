<div align="center">
  <h1>Dutch Trainer</h1>
  <p>Тренажер для вивчення нідерландської: дієслова, слова та тренування структури речень.</p>
</div>

## Можливості

### 1) Irregular Verbs
- Практика всіх дієслів або вибраного діапазону.
- Введення форм **Imperfectum** та **Perfectum**.
- Підсумок раунду з розбором помилок.

### 2) Words
- Режим карток: слово + переклад + транскрипція.
- Тест **UA → NL**.
- Тест **NL → UA**.

### 3) Sentence Builder
- **Learn**: Grammar Guide (cheat sheets із прикладами).
- **Practice**: drag-and-drop впорядкування слів у правильне речення.
- **Test**: текстовий режим перевірки (random exercises).

### 4) Прогрес навчання
- Збереження прогресу в `localStorage` для режиму дієслів.
- Метрики: кількість раундів, опрацьовані слова, точність, найкращий раунд.

## Локальний запуск

### Вимоги
- Node.js 20+
- npm

### Кроки
1. Встановити залежності:
   ```bash
   npm install
   ```
2. Запустити dev-сервер:
   ```bash
   npm run dev
   ```
3. Відкрити застосунок у браузері:
   - `http://localhost:3000`

## Команди

```bash
npm run dev      # запуск у режимі розробки
npm run build    # production-збірка
npm run preview  # превʼю зібраного застосунку
npm run lint     # перевірка TypeScript
```


## Швидке вирішення merge conflict

Для типового конфлікту в `src/App.tsx` та `src/components/Menu.tsx` можна використати скрипт:

```bash
./scripts/resolve-main-conflicts.sh
```

Скрипт:
- підтягне `origin/main`
- спробує merge
- при конфлікті в `App/Menu` автоматично залишить версію вашої feature-гілки
- створить merge commit

Після цього залишиться лише `git push`.

## Як вирішити merge conflict у PR (App.tsx / Menu.tsx)

Якщо GitHub показує `Branch has merge conflicts`, а конфлікти в `src/App.tsx` та `src/components/Menu.tsx`:

1. Оновіть локальну `main`:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Поверніться на вашу гілку PR:
   ```bash
   git checkout <your-branch>
   ```
3. Змерджіть `main` у вашу гілку:
   ```bash
   git merge main
   ```
4. Відкрийте конфліктні файли й залиште актуальну логіку режимів:
   - `verbs`
   - `wordsStudy`
   - `wordsQuizUaToNl`
   - `wordsQuizNlToUa`
   - `sentenceBuilder`
5. Після виправлення:
   ```bash
   git add src/App.tsx src/components/Menu.tsx
   git commit -m "Resolve merge conflicts with main"
   git push
   ```

> Примітка: у CI/контейнері без доступу до `origin` (наприклад, 403 на GitHub) потрібно виконати ці кроки локально або в середовищі з доступом до репозиторію.
