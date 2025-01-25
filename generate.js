import { parse } from "jsr:@std/yaml";
import { Marked } from "npm:marked@13";
import { webcrypto } from "node:crypto";

// Read quizzes and answers
const { quizzes } = parse(await Deno.readTextFile("./quizzes.yaml", "utf8"));
const { answers } = parse(await Deno.readTextFile(".secret.answers.yaml", "utf8"));

const marked = new Marked();

async function sha(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await webcrypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

const transforms = {
  mapEnglish: (w) => w.toUpperCase().replace(/ /g, "").trim().toUpperCase(),
  mapTamil: (w) =>
    w
      .toUpperCase()
      .replace(/ /g, "")
      .replace(/AE/g, "E")
      .replace(/AIY/g, "AY")
      .replace(/EA|EI|EY/g, "E")
      .replace(/IE/g, "I")
      .replace(/IU/g, "IYU")
      .replace(/OYI|OI|OY|OVI/g, "OI")
      .replace(/Y/g, "I")
      .replace(/([AEIOU])H([AEIOU])/g, "$1G$2")
      .replace(/KSH/g, "SH")
      .replace(/TCH/g, "SH")
      .replace(/CH/g, "S")
      .replace(/NDR/g, "NR")
      .replace(/H/g, "")
      .replace(/W/g, "V")
      .replace(/G/g, "K")
      .replace(/J/g, "C")
      .replace(/D/g, "T")
      .replace(/B/g, "P")
      .replace(/TIR/g, "TR")
      .replace(/(.)\1/g, "$1")
      .replace(/(.)\1/g, "$1")
      .replace(/[AEIOU]/g, ""),

  mapHindi: (w) =>
    (w + " ")
      .toUpperCase()
      .replace(/\s+/, " ")
      .replace(/W/g, "V")
      .replace(/KSH/g, "X")
      .replace(/Z/g, "J")
      .replace(/PH/g, "F")
      .replace(/([KGCJTDPBS])H/g, "$1")
      .replace(/(.)\1/g, "$1")
      .replace(/Y/g, "")
      .replace(/([AEIOU])N /g, "$1")
      .replace(/[AEIOU]/g, "")
      .replace(/ /g, ""),
};

function quizRow({ q, a }) {
  return /* html */ `
  <div class="list-group-item">
    <div class="row align-items-center">
      <div class="col-md-6">
        ${marked.parse(q)}
      </div>
      <div class="col-md-6">
        <input type="text" class="form-control" data-answer="${a}">
      </div>
    </div>
  </div>`;
}

const webPage = ({ home, title, body, transform, quiz, footer }) => /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Quizzes | s-anand.net</title>
  <link
    rel="icon"
    type="image/svg+xml"
    href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTUiIGZpbGw9IiMyNTYzZWIiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJtMTYgNyAyIDcgNyAyLTcgMi0yIDctMi03LTctMiA3LTJaIi8+PC9zdmc+"
  />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
  <style>
    #quiz p {
      margin-bottom: 0;
    }
  </style>
</head>
<body class="bg-light">
  <header class="text-bg-warning py-4 mb-4 text-center">
    <h1 class="display-4">
      ${home ?? ""} ${title}
    </h1>
  </header>

  <div class="container" style="max-width: 40em;">
    ${body ? marked.parse(body) : ""}
    <div class="list-group" id="quiz">${(quiz ?? []).map(quizRow).join("")}</div>
  </div>

  ${footer ?? ""}

  <script type="module">
    const webcrypto = window.crypto;
    ${sha.toString()}
    const transform = ${transforms[transform ?? "mapEnglish"]};
    const $quiz = document.querySelector("#quiz");

    $quiz.querySelectorAll("a[href]").forEach((a) => {
      a.setAttribute("target", "_blank");
      console.log(a.href, a.href.match(/j\\d+\\.jpg/));
      if (a.href.match(/j\\d+\\.jpg/)) {
        a.setAttribute("href", "../../jigsaw.html?" + a.href);
      }
    });
    $quiz.addEventListener("input", async (e) => {
      const input = e.target;
      input.classList.toggle("text-bg-success", await sha(transform(input.value)) === input.dataset.answer);
    });
  </script>
</body>
</html>
`;

// Generate home page
const readme = await Deno.readTextFile("./README.md");
Deno.writeTextFile("./index.html", webPage({ title: "Quizzes", body: readme }));

// Generate the quizzes
const footer = /* html */ `
  <div class="text-center my-5">
    <a href="../../" class="btn btn-primary"><i class="bi bi-house-fill"></i> Back to Quizzes</a>
  </div>
`;
for (const [folder, { title, date, blog, transform, body, questions }] of Object.entries(quizzes)) {
  if (!questions) continue;
  const quiz = await Promise.all(
    questions.map(async (q, i) => ({ q, a: await sha(transforms[transform ?? "mapEnglish"](answers[folder][i])) }))
  );
  await Deno.mkdir(folder, { recursive: true });
  Deno.writeTextFile(
    `./${folder}/index.html`,
    webPage({ home: /* html */ `<a href="../..">Quiz</a>:`, title, blog, body, transform, quiz, footer })
  );
}
