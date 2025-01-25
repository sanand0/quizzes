# Interactive Quizzes

These are interactive quizzes that I've created over the years, mostly about films and music.

- Tamil Songs
  - [1975s Tamil Songs](tamil-songs/1975/)
  - [1980s Tamil Songs](tamil-songs/1980/)
  - [1980s Tamil Songs by Ilayaraaja](tamil-songs/1980-ilayaraaja/)
  - [1990s Tamil Songs](tamil-songs/1990/)
  - [2000s Tamil Songs](tamil-songs/2000/)
  - [2006s Tamil Songs](tamil-songs/2006/)
  - [2008s Tamil Songs](tamil-songs/2008/)
  - [2012s Tamil Songs](tamil-songs/2012/)
  - [AM Raja Tamil Songs](tamil-songs/am-raja/)
  - [AR Rahman Tamil Songs](tamil-songs/ar-rahman/)
  - [Enchanting First Interludes](tamil-songs/enchanting-first-interludes/)
  - [Harris Jayaraj First Interludes](tamil-songs/harris-jayaraj-first-interludes/)
  - [MGR Tamil Songs](tamil-songs/mgr/)
  - [PB Srinivas Tamil Songs](tamil-songs/pb-srinivas/)
- Tamil Song Lyrics
  - [Song lyrics](tamil-lyrics/songs/)
  - [1980s Dappanguthus song lyrics](tamil-lyrics/1980-dappanguthus/)
  - [1985s Tamil song lyrics](tamil-lyrics/1985-songs/)
  - [1990s Tamil song lyrics](tamil-lyrics/1990-songs/)
  - [1995s Tamil song lyrics](tamil-lyrics/1995-songs/)
  - [2000s Tamil song lyrics](tamil-lyrics/2000-songs/)
  - [Old song lyrics](tamil-lyrics/old-songs/)
  - [TMS MGR song lyrics](tamil-lyrics/tms-mgr-songs/)
  - [TMS Sivaji song lyrics](tamil-lyrics/tms-sivaji-songs/)
- Dialogues
  - [Nagesh comedy dialogues](dialogues/nagesh-comedy-dialogues/)
  - [Vadivelu comedy dialogues](dialogues/vadivelu-comedy-dialogues/)
  - [Book quotes](dialogues/book-quotes/)
  - [English movie romances](dialogues/english-movie-romances/)
  - [English movie dialogues](dialogues/english-movie-dialogues/)
  - [English movie quotes](dialogues/english-movie-quotes/)
- Hindi Songs
  - [1995s Hindi Songs](hindi-songs/1995/)
  - [2000s Hindi Songs](hindi-songs/2000/)
  - [AR Rahman Hindi Songs](hindi-songs/ar-rahman/)
  - [SD Burman Hindi Songs](hindi-songs/sd-burman/)
- Jigsaw
  - [Bollywood Actors](jigsaw/bollywood-actors/)
  - [Bollywood Actresses](jigsaw/bollywood-actresses/)
  - [Hollywood Actors](jigsaw/hollywood-actors/)
  - [Hollywood Movies 1](jigsaw/hollywood-movies-1/)
  - [Hollywood Movies 2](jigsaw/hollywood-movies-2/)
  - [Hollywood Movies 4](jigsaw/hollywood-movies-4/)
  - [Kamal Tamil Movies](jigsaw/kamal-tamil-movies/)
  - [Tamil Movies](jigsaw/tamil-movies/)

## About the quizzes

- [Source code](https://github.com/sanand0/quizzes)
- [quizzes.yaml](https://github.com/sanand0/quizzes/blob/main/quizzes.yaml) has this structure:
  ```yaml
  questions:
    (path/to/quiz):  # Path to quiz
      title: Title of the quiz
      date: 2006-05-24  # Date the quiz was authored,
      blog: https://www.s-anand.net/blog/movie-jigsaw-quiz-1/  # URL of the blog post
      body: ...  # Quiz description in Markdown
      transform: mapTamil  # Transformation function. Can be `mapEnglish`, `mapTamil`, or `mapHindi`
      questions:  # List of questions, each in Markdown. For example:
        - "[Song 1](AMRaja-01.opus)"  # Links open in a new window
        - "[Jigsaw 1](j01.jpg)"  # `j*.jpg` are treated as jigsaw puzzles
        - "Any other Markdown content"
  ```
- Answers are in a GitHub secret `ANSWERS_BASE64`, created via `base64 .secret.answers.yaml` with this structure:
  ```yaml
  answers:
    (path/to/quiz):  # Path to quiz
      - (answer 1)
      - (answer 2)
      - ...
  ```
- [`generate.js`](https://github.com/sanand0/quizzes/blob/main/generate.js) generates the HTML files from the YAML files.
- Adding `?embed=1` to the URL hides the header, footer, and body.
