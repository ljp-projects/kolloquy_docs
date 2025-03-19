import { writeFile, readFile } from 'node:fs/promises';
import markdownit from 'markdown-it'
import hljs from 'highlight.js'
import markdownItKatex from 'markdown-it-katex'

const convertMarkdown = async (inputFile, outputFile) => {
    const md = markdownit()

    md.use(markdownItKatex)

    const result = md.render(await readFile(inputFile, "utf-8"), {
        highlight: function (str, lang) {
            console.log(lang)

            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(str, { language: lang }).value;
                } catch (__) {}
            }

            return ''; // use external default escaping
        }
    });

    const template = `
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css">
</head>
<body>
${result.slice(null, -1)}
</body>
</html>
`;

    await writeFile(outputFile, template);
}

convertMarkdown(process.argv[2], process.argv[3]);