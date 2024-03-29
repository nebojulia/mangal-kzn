# Сборщик для проектов (pug, html, hbs)

## Установка

Требуются установленный [git](https://git-scm.com/) и [Node.js (LTS)](https://nodejs.org/en/) не ниже 16 версии

1. Открыть терминал, попасть в папку проектов, клонировать этот репозиторий.
2. Перейти в папку нового проекта (пример — `cd my-new-project`).
3. Удалить историю разработки: `rm -rf .git`
4. Установить зависимости проекта: `npm i`.

В редакторе кода или IDE установить (если не установлены) и включить плагины [Prettier](https://prettier.io/) и [Stylelint](https://stylelint.io/).


## Команды

```bash
npm run start         # запуск сервера разработки
npm run deploy        # отправка содержимого папки сборки на gh-pages (нужен репозиторий на github.com)
npm run build         # сборка без запуска сервера разработки
npm run test          # проверка всех [pug- | html-], scss- и js-файлов на соответствие правилам (см. [.pug-lintrc | html-linter.json], .stylelintrc и eslintrc соответственно)
npm run test:pug      # проверить только pug-файлы (pug версия сборщика)
npm run test:html     # проверить только html-файлы (html версия сборщика)
npm run test:style    # проверить только scss-файлы
npm run test:js       # проверить только js-файлы
npx fix:style         # исправить только scss-файлы
npx fix:js            # исправить только js-файлы
npx prettier:js       # проверить только js-файлы через Prettier
npx prettier-fix:js   # исправить только js-файлы через Prettier

```


## Парадигма

- **Именование классов по БЭМ**, разметка в [pug](https://pugjs.org/) или в **html**, или [hbs](https://handlebarsjs.com/), стилизация [Sass](http://sass-lang.com/). См. [как работать с CSS-препроцессорами и БЭМ](http://nicothin.github.io/idiomatic-pre-CSS/).
- **Каждый БЭМ-блок находится в своей папке** внутри `src/blocks/`. Имена файлов в папке должны совпадать с именем блока. См. ниже про Блоки.
- **Есть файл конфигурации**, определяющий попадание в сборку дополнительных файлов и неиспользованных в разметке блоков. Смотри `config.js`.
- **Можно использовать глобальные файлы**:
  - `src/js/script.js` — общий js, берётся в сборку по умолчанию
- **Список pug-примесей `src/pug/mixins.pug` генерируется автоматически (pug версия сборщика)** и содержит `include` существующих pug-файлов всех блоков.
- **Диспетчер подключения стилей `src/scss/style.scss` генерируется автоматически** и содержит импорты стилевых файлов использованных в разметке блоков и импорты доп. файлов, указанных в `config.js`.
- **Входная точка обработки js (`src/js/entry.js`) генерируется автоматически** и содержит `require` js-файлов использованных в разметке блоков и доп. файлов, указанных в `config.js`.
- **Используется кодгайд** (относительно жёсткий), его проверка делается перед коммитом или вручную (`npm run test`), ошибки выводятся в терминал.
- **Есть механизм быстрого создания нового блока**: `node new.js new-block` (создаёт папки и scss-файл). После имени нового блока можно дописать нужные расширения.


## Структура

```bash
build/       # Папка сборки (результат работы над проектом)
src/         # Исходники
  assets/    # Файлы контента (то, что загружается пользователем)
  blocks/    # Блоки (подпапки с блоками)
  data       # Папка с базой данных json
  favicon/   # Фавиконки (копирование прописать в config.js)
  fonts/     # Шрифты (копирование прописать в config.js, подключение в src/blocks/page/page.scss)
  img/       # Общие изображения
  js/        # Общие js-файлы, в т.ч. точка сборки для webpack и общие модули
  json/      # Служебная папка для сборки страниц с json
  pages/     # Страницы проекта (при компиляции: src/pages/index.[pug | html | hbs] → build/index.html)
  templates/ # Служебные [pug- | html- | hbs-] файлы (шаблоны страниц, примеси)
  scss/      # Служебные стилевые файлы (диспетчер подключений, переменные, примеси)
  symbols/   # Иконки для svg-спрайта
```


## Как это работает

При `npm start` запускается дефолтная задача gulp:

1. Очищается папка сборки (`build/`).
2. Записывается файл `src/pug/mixins.pug` с includ-ами pug-файлов всех блоков (pug версия).
3. Компилируются файлы страниц (из `src/pages/**/*.[pug | html | hbs]` в `build/*.html`).
4. Из скомпилированных html-файлов извлекаются все классы уровня БЭМ-блока. На основании этого списка будут построены диспетчер подключения стилей и список всех js-файлов проекта.
5. Генерируется json файл для сборки html-страниц
6. Генерируется svg-спрайт, в папку сборки копируются картинки блоков и доп. файлы из секции `addAdditions` файла `config.js`.
7. Записывается диспетчер подключения стилей `src/scss/style.scss`, в котором:
- Импорты файлов из секции `addStyleBefore` файла `config.js`. По умолчанию — SCSS-переменные и примеси.
- Импорты файлов БЭМ-блоков, упомянутых в секции `alwaysAddBlocks` файла `config.js`. Таким образом, можно взять в сборку любой блок, даже если его css-класс не упоминается в разметке страниц.
- Импорты файлов БЭМ-блоков, использующихся в разметке.
- Импорты файлов из секции `addStyleAfter` файла `config.js`.
8. Записывается входная точка обработки скриптов `src/js/entry.js`, в которой:
- `require` файлов из секции `addJsBefore` файла `config.js`.
- `require` файлов БЭМ-блоков, использующихся в разметке.
- `require` файлов БЭМ-блоков, упомянутых в секции `alwaysAddBlocks` файла `config.js`.
- `require` файлов из секции `addJsAfter` файла `config.js`.
9. Компилируется диспетчер подключения стилей (`src/scss/style.scss`). Результат обрабатываются плагинами PostCSS.
10. Обрабатывается входная точка Javascript (`src/js/entry.js`). Используется Webpack.
11. Запускается локальный сервер и слежение за файлами для пересборки.


## Блоки

Каждый блок лежит в `src/blocks/` в своей папке.

Возможное содержимое блока:

```bash
demo-block/                       # Папка блока.
  img/                            # Изображения, используемые этим блоком (копируются в папку сборки).
  symbols/                        # Иконки, используемые этим блоком (попадают в общий спрайт).
  demo-block.[pug | html | hbs]   # Разметка (pug-примесь, отдающая разметку этого блока, описание API примеси).
  demo-block.scss                 # Стилевой файл этого блока (без стилей других блоков).
  demo-block.js                   # js-файл блока (без скриптов других блоков).
  readme.md                       # Описание для документации, подсказки.
```


### Создание нового блока

```bash
# формат: node new.js ИМЯБЛОКА [доп. расширения через пробел]
node new.js demo-block        # создаст папку блока, demo-block.scss
node new.js demo-block pug js # создаст папку блока, demo-block.scss, demo-block.pug, demo-block.js
```

Доступные опции при создании блока:

```
img       # создаёт подпапку img/ для этого блока
symbols   # создаёт подпапку symbols/ для этого блока
pug       # создаёт pug-файл (pug версия)
html      # создаёт html-файл (html версия)
hbs       # создаёт hbs-файл (hbs версия)
js        # создаёт js-файл
md        # создаёт md-файл
```

Если блок уже существует, файлы не будут затёрты, но создадутся те файлы, которые ещё не существуют.


## Сторонние npm-модули

Если нужно взять в сборку сторонний модуль, то после его установки (к примеру — `npm i package-name`) нужно:

1. Прописать `require` в js-файле проектного блока (там же писать всё, что касается работы с этим модулем). Если сторонний модуль нужен без привязки к какому-либо проектному блоку, прописать `require` в `src/js/script.js` (см. пример в файле).
2. Если нужно брать в сборку стилевые файлы модуля, прописать их в секции `addStyleBefore` файла `config.js` (пример в файле).
3. Если нужно брать в сборку дополнительные файлы модуля, прописать их в `addAssets` файла `config.js` с указанием в какую папку их копировать (пример в файле).


## Разметка

### [Pug](https://pugjs.org/api/getting-started.html) версия

Все страницы (см. `src/pages/index.pug`) являются расширениями шаблонов из `src/templates` (см. [наследование шаблонов](https://pugjs.org/language/inheritance.html)), в страницах описывается только содержимое контентной области (см. [блоки](https://pugjs.org/language/inheritance.html#block-append-prepend)).

Каждый блок (в `src/blocks/`) может (не обязан) содержать одноимённый pug-файл с одноименной примесью, который при старте сервера разработки будет взят includ-ом в файл `src/pug/mixins.pug`.


### HTML версия

Все страницы (см. `src/pages/index.html`) используют включения из `src/templates` и блоков `src/blocks/`. Для внедрения используется [gulp-file-include](https://www.npmjs.com/package/gulp-file-include).

Каждый блок (в `src/blocks/`) может (не обязан) содержать одноимённый html-файл, который нужно будет упомянуть на странице.


### [Hbs](https://handlebarsjs.com/guide/) версия

Все страницы (см. `src/pages/index.hbs`) являются расширениями шаблонов из `src/templates`, в страницах описывается только содержимое контентной области.

Каждый блок (в `src/blocks/`) может (не обязан) содержать одноимённый hbs-файл, который нужно будет упомянуть на странице.


## Стили

Диспетчер подключений (`src/scss/style.scss`) формируется автоматически при старте сервера разработки.

Каждый блок (в `src/blocks/`) может содержать одноимённый scss-файл со стилями этого блока. Если блок используется в разметке (или упомянут в `config.js#alwaysAddBlocks`), его scss-файл будет взят в сборку стилей.

Используемый постпроцессинг:

1. [autoprefixer](https://github.com/postcss/autoprefixer)
2. [css-mqpacker](https://github.com/hail2u/node-css-mqpacker)
3. [postcss-import](https://github.com/postcss/postcss-import)
4. [postcss-pxtorem](https://www.npmjs.com/package/postcss-pxtorem)

postcss-pxtorem —  генерирует rem-единицы из пикселей для ['font', 'font-size', 'line-height', 'letter-spacing'], настроить список css-свойств можно в `gulpfile.js`

### Стилевой код-гайд

Автопроверка с [stylelint](https://stylelint.io/) и плагинами. См. `.stylelintrc`.

1. БЭМ-именование: `__` — разделитель элемента, `--` — разделитель модификатора.
2. Один Блок = один стилевой файл.
3. Очередность селекторов:
- Инклуды примесей
- Стилевые правила сущности
- Медиаусловия
- Модификаторы блока
- Псевдоселекторы и псевдоэлементы
- Сторонние вложенные селекторы
- Элементы блока


## Скрипты

Точка входа (`src/js/entry.js`) формируется автоматически при старте сервера разработки. Точка входа обрабатывается webpack-ом (с babel-loader).

Для глобальных действий предусмотрен `src/js/script.js` (см. `config.js#addJsAfter` и `config.js#addJsBefore`).

Каждый блок (в `src/blocks/`) может (не обязан) содержать одноимённый js-файл. Если блок используется в разметке (или упомянут в `config.js#alwaysAddBlocks`), его js-файл будет взят в сборку стилей.

### Инлайн-скрипт

По умолчанию в шаблоне (`src/pug/layout.pug`) прописана вставка в `<head>` скрипта `src/js/head-script.js`, в котором для узла `<html>` указано:

- Убрать класс `no-js` и добавить класс `js`.
- Добавить класс с указанием названия браузера и ОС.
- Добавить класс `touch` или `no-touch`, в зависимости от типа интерфейса.
- Добавить кастомное свойство `--vh` со значением в 1% высоты вьюпорта (значение пересчитывается при изменении размеров).


## Задачи сборщика

### writePugMixinsFile (pug версия)

Собирает все pug-примеси и генерирует `src/pug/mixins.pug`

### compilePug (pug версия)

Компилирует pug из `src/pages/**/*.pug` в html-страницы в `build/**/*.html`, при компиляции страниц могут использоваться данные из `src/json/data.json`

### compilePugFast (pug версия)

То же самое, что и `compilePug`, но учитывает изменения файлов после последнего запуска

### htmlBuild (html версия)

Компилирует html из `src/pages/**/*.html` в html-страницы в `build/**/*.html`

### compileHbs (hbs версия)

Компилирует html из `src/pages/**/*.hbs` в html-страницы в `build/**/*.html`, при компиляции страниц могут использоваться данные из `src/json/data.json`

### copyAssets

Копирует все файлы из `src/assets/**/*.*` в `build/assets/**/*.*`

### copyBlockImg

Копирует все файлы из `src/blocks/**/img/*.[png,jpg,jpeg,svg,gif]` в `build/img/**/*.png,jpg,jpeg,svg,gif`

### copyAdditions

Копирует все файлы из `src/img/**/*.*` в `build/img/**/*.*`, а также файлы `src/favicon/*.*` в `build/img/favicon`

В файле `./config.js` можно настроить объекты копирования, их исходное и целевое расположения

### copyFonts

Копирует файлы шрифтов из `src/fonts/**/*.*` в `build/fonts/**/*.*`

### generateSvgSprite

Генерирует общий svg-спрайт из svg-файлов находящихся в `src/symbols` и `src/blocks/**/symbols/**/*.svg` в `build/img/svgSprite.svg`

### writeSassImportsFile

Собирает все sass-импорты и генерирует `src/scss/style.scss`

### compileSass

Компилирует scss из `src/scss/style.scss` в css в `build/css/style.css`

### writeJsRequiresFile

Собирает все js-зависимости и генерирует `src/js/entry.js`

### compileJs

Компилирует общий js файл `build/js/bundle.js`, используется при default задаче

### buildJs

То же что и compileJs, за исключением, что итоговый файл сжимается, используется при build задаче

### buildJson

Генерирует общий json-файл из `src/data/**/*.json` в `src/json/data.json`

### clearBuildDir

Очищает папку `build/`

### deploy

Отправляет содержимого папки сборки на gh-pages (нужен репозиторий на github.com)

### build

Build-сборка проекта с сжатием скриптов

### default

Dev-сборка проекта с live-сервером


## Переиспользуемые scss-миксины

1. Fluid function — scss-функция, которая позволяет гибко изменять числовое значение свойства от `min` до `max` в заданном диапазоне ширины экрана
2. Flexbox
3. Hide-text
4. List-reset


## Библиотека готовых блоков

1. button
2. input
3. textarea
4. select
5. checkbox
6. radio
7. field
8. form
9. tabs
#   m a n g a l - k z n  
 