import { toHTML } from 'discord-markdown';
import hljs from 'highlight.js/lib/core';
import parseTimestamps from './parse-timestamps';

const languages: Record<string, () => Promise<typeof import("highlight.js/lib/languages/*")>> = {
    "1c": () => import("highlight.js/lib/languages/1c"),
    "abnf": () => import("highlight.js/lib/languages/abnf"),
    "accesslog": () => import("highlight.js/lib/languages/accesslog"),
    "actionscript": () => import("highlight.js/lib/languages/actionscript"),
    "ada": () => import("highlight.js/lib/languages/ada"),
    "angelscript": () => import("highlight.js/lib/languages/angelscript"),
    "apache": () => import("highlight.js/lib/languages/apache"),
    "applescript": () => import("highlight.js/lib/languages/applescript"),
    "arcade": () => import("highlight.js/lib/languages/arcade"),
    "arduino": () => import("highlight.js/lib/languages/arduino"),
    "armasm": () => import("highlight.js/lib/languages/armasm"),
    "xml": () => import("highlight.js/lib/languages/xml"),
    "asciidoc": () => import("highlight.js/lib/languages/asciidoc"),
    "aspectj": () => import("highlight.js/lib/languages/aspectj"),
    "autohotkey": () => import("highlight.js/lib/languages/autohotkey"),
    "autoit": () => import("highlight.js/lib/languages/autoit"),
    "avrasm": () => import("highlight.js/lib/languages/avrasm"),
    "awk": () => import("highlight.js/lib/languages/awk"),
    "axapta": () => import("highlight.js/lib/languages/axapta"),
    "bash": () => import("highlight.js/lib/languages/bash"),
    "basic": () => import("highlight.js/lib/languages/basic"),
    "bnf": () => import("highlight.js/lib/languages/bnf"),
    "brainfuck": () => import("highlight.js/lib/languages/brainfuck"),
    "c": () => import("highlight.js/lib/languages/c"),
    "cal": () => import("highlight.js/lib/languages/cal"),
    "capnproto": () => import("highlight.js/lib/languages/capnproto"),
    "ceylon": () => import("highlight.js/lib/languages/ceylon"),
    "clean": () => import("highlight.js/lib/languages/clean"),
    "clojure": () => import("highlight.js/lib/languages/clojure"),
    "clojure-repl": () => import("highlight.js/lib/languages/clojure-repl"),
    "cmake": () => import("highlight.js/lib/languages/cmake"),
    "coffeescript": () => import("highlight.js/lib/languages/coffeescript"),
    "coq": () => import("highlight.js/lib/languages/coq"),
    "cos": () => import("highlight.js/lib/languages/cos"),
    "cpp": () => import("highlight.js/lib/languages/cpp"),
    "crmsh": () => import("highlight.js/lib/languages/crmsh"),
    "crystal": () => import("highlight.js/lib/languages/crystal"),
    "csharp": () => import("highlight.js/lib/languages/csharp"),
    "csp": () => import("highlight.js/lib/languages/csp"),
    "css": () => import("highlight.js/lib/languages/css"),
    "d": () => import("highlight.js/lib/languages/d"),
    "markdown": () => import("highlight.js/lib/languages/markdown"),
    "dart": () => import("highlight.js/lib/languages/dart"),
    "delphi": () => import("highlight.js/lib/languages/delphi"),
    "diff": () => import("highlight.js/lib/languages/diff"),
    "django": () => import("highlight.js/lib/languages/django"),
    "dns": () => import("highlight.js/lib/languages/dns"),
    "dockerfile": () => import("highlight.js/lib/languages/dockerfile"),
    "dos": () => import("highlight.js/lib/languages/dos"),
    "dsconfig": () => import("highlight.js/lib/languages/dsconfig"),
    "dts": () => import("highlight.js/lib/languages/dts"),
    "dust": () => import("highlight.js/lib/languages/dust"),
    "ebnf": () => import("highlight.js/lib/languages/ebnf"),
    "elixir": () => import("highlight.js/lib/languages/elixir"),
    "elm": () => import("highlight.js/lib/languages/elm"),
    "ruby": () => import("highlight.js/lib/languages/ruby"),
    "erb": () => import("highlight.js/lib/languages/erb"),
    "erlang-repl": () => import("highlight.js/lib/languages/erlang-repl"),
    "erlang": () => import("highlight.js/lib/languages/erlang"),
    "excel": () => import("highlight.js/lib/languages/excel"),
    "fix": () => import("highlight.js/lib/languages/fix"),
    "flix": () => import("highlight.js/lib/languages/flix"),
    "fortran": () => import("highlight.js/lib/languages/fortran"),
    "fsharp": () => import("highlight.js/lib/languages/fsharp"),
    "gams": () => import("highlight.js/lib/languages/gams"),
    "gauss": () => import("highlight.js/lib/languages/gauss"),
    "gcode": () => import("highlight.js/lib/languages/gcode"),
    "gherkin": () => import("highlight.js/lib/languages/gherkin"),
    "glsl": () => import("highlight.js/lib/languages/glsl"),
    "gml": () => import("highlight.js/lib/languages/gml"),
    "go": () => import("highlight.js/lib/languages/go"),
    "golo": () => import("highlight.js/lib/languages/golo"),
    "gradle": () => import("highlight.js/lib/languages/gradle"),
    "graphql": () => import("highlight.js/lib/languages/graphql"),
    "groovy": () => import("highlight.js/lib/languages/groovy"),
    "haml": () => import("highlight.js/lib/languages/haml"),
    "handlebars": () => import("highlight.js/lib/languages/handlebars"),
    "haskell": () => import("highlight.js/lib/languages/haskell"),
    "haxe": () => import("highlight.js/lib/languages/haxe"),
    "hsp": () => import("highlight.js/lib/languages/hsp"),
    "http": () => import("highlight.js/lib/languages/http"),
    "hy": () => import("highlight.js/lib/languages/hy"),
    "inform7": () => import("highlight.js/lib/languages/inform7"),
    "ini": () => import("highlight.js/lib/languages/ini"),
    "irpf90": () => import("highlight.js/lib/languages/irpf90"),
    "isbl": () => import("highlight.js/lib/languages/isbl"),
    "java": () => import("highlight.js/lib/languages/java"),
    "javascript": () => import("highlight.js/lib/languages/javascript"),
    "jboss-cli": () => import("highlight.js/lib/languages/jboss-cli"),
    "json": () => import("highlight.js/lib/languages/json"),
    "julia": () => import("highlight.js/lib/languages/julia"),
    "julia-repl": () => import("highlight.js/lib/languages/julia-repl"),
    "kotlin": () => import("highlight.js/lib/languages/kotlin"),
    "lasso": () => import("highlight.js/lib/languages/lasso"),
    "latex": () => import("highlight.js/lib/languages/latex"),
    "ldif": () => import("highlight.js/lib/languages/ldif"),
    "leaf": () => import("highlight.js/lib/languages/leaf"),
    "less": () => import("highlight.js/lib/languages/less"),
    "lisp": () => import("highlight.js/lib/languages/lisp"),
    "livecodeserver": () => import("highlight.js/lib/languages/livecodeserver"),
    "livescript": () => import("highlight.js/lib/languages/livescript"),
    "llvm": () => import("highlight.js/lib/languages/llvm"),
    "lsl": () => import("highlight.js/lib/languages/lsl"),
    "lua": () => import("highlight.js/lib/languages/lua"),
    "makefile": () => import("highlight.js/lib/languages/makefile"),
    "mathematica": () => import("highlight.js/lib/languages/mathematica"),
    "matlab": () => import("highlight.js/lib/languages/matlab"),
    "maxima": () => import("highlight.js/lib/languages/maxima"),
    "mel": () => import("highlight.js/lib/languages/mel"),
    "mercury": () => import("highlight.js/lib/languages/mercury"),
    "mipsasm": () => import("highlight.js/lib/languages/mipsasm"),
    "mizar": () => import("highlight.js/lib/languages/mizar"),
    "perl": () => import("highlight.js/lib/languages/perl"),
    "mojolicious": () => import("highlight.js/lib/languages/mojolicious"),
    "monkey": () => import("highlight.js/lib/languages/monkey"),
    "moonscript": () => import("highlight.js/lib/languages/moonscript"),
    "n1ql": () => import("highlight.js/lib/languages/n1ql"),
    "nestedtext": () => import("highlight.js/lib/languages/nestedtext"),
    "nginx": () => import("highlight.js/lib/languages/nginx"),
    "nim": () => import("highlight.js/lib/languages/nim"),
    "nix": () => import("highlight.js/lib/languages/nix"),
    "node-repl": () => import("highlight.js/lib/languages/node-repl"),
    "nsis": () => import("highlight.js/lib/languages/nsis"),
    "objectivec": () => import("highlight.js/lib/languages/objectivec"),
    "ocaml": () => import("highlight.js/lib/languages/ocaml"),
    "openscad": () => import("highlight.js/lib/languages/openscad"),
    "oxygene": () => import("highlight.js/lib/languages/oxygene"),
    "parser3": () => import("highlight.js/lib/languages/parser3"),
    "pf": () => import("highlight.js/lib/languages/pf"),
    "pgsql": () => import("highlight.js/lib/languages/pgsql"),
    "php": () => import("highlight.js/lib/languages/php"),
    "php-template": () => import("highlight.js/lib/languages/php-template"),
    "plaintext": () => import("highlight.js/lib/languages/plaintext"),
    "pony": () => import("highlight.js/lib/languages/pony"),
    "powershell": () => import("highlight.js/lib/languages/powershell"),
    "processing": () => import("highlight.js/lib/languages/processing"),
    "profile": () => import("highlight.js/lib/languages/profile"),
    "prolog": () => import("highlight.js/lib/languages/prolog"),
    "properties": () => import("highlight.js/lib/languages/properties"),
    "protobuf": () => import("highlight.js/lib/languages/protobuf"),
    "puppet": () => import("highlight.js/lib/languages/puppet"),
    "purebasic": () => import("highlight.js/lib/languages/purebasic"),
    "python": () => import("highlight.js/lib/languages/python"),
    "python-repl": () => import("highlight.js/lib/languages/python-repl"),
    "q": () => import("highlight.js/lib/languages/q"),
    "qml": () => import("highlight.js/lib/languages/qml"),
    "r": () => import("highlight.js/lib/languages/r"),
    "reasonml": () => import("highlight.js/lib/languages/reasonml"),
    "rib": () => import("highlight.js/lib/languages/rib"),
    "roboconf": () => import("highlight.js/lib/languages/roboconf"),
    "routeros": () => import("highlight.js/lib/languages/routeros"),
    "rsl": () => import("highlight.js/lib/languages/rsl"),
    "ruleslanguage": () => import("highlight.js/lib/languages/ruleslanguage"),
    "rust": () => import("highlight.js/lib/languages/rust"),
    "sas": () => import("highlight.js/lib/languages/sas"),
    "scala": () => import("highlight.js/lib/languages/scala"),
    "scheme": () => import("highlight.js/lib/languages/scheme"),
    "scilab": () => import("highlight.js/lib/languages/scilab"),
    "scss": () => import("highlight.js/lib/languages/scss"),
    "shell": () => import("highlight.js/lib/languages/shell"),
    "smali": () => import("highlight.js/lib/languages/smali"),
    "smalltalk": () => import("highlight.js/lib/languages/smalltalk"),
    "sml": () => import("highlight.js/lib/languages/sml"),
    "sqf": () => import("highlight.js/lib/languages/sqf"),
    "sql": () => import("highlight.js/lib/languages/sql"),
    "stan": () => import("highlight.js/lib/languages/stan"),
    "stata": () => import("highlight.js/lib/languages/stata"),
    "step21": () => import("highlight.js/lib/languages/step21"),
    "stylus": () => import("highlight.js/lib/languages/stylus"),
    "subunit": () => import("highlight.js/lib/languages/subunit"),
    "swift": () => import("highlight.js/lib/languages/swift"),
    "taggerscript": () => import("highlight.js/lib/languages/taggerscript"),
    "yaml": () => import("highlight.js/lib/languages/yaml"),
    "tap": () => import("highlight.js/lib/languages/tap"),
    "tcl": () => import("highlight.js/lib/languages/tcl"),
    "thrift": () => import("highlight.js/lib/languages/thrift"),
    "tp": () => import("highlight.js/lib/languages/tp"),
    "twig": () => import("highlight.js/lib/languages/twig"),
    "typescript": () => import("highlight.js/lib/languages/typescript"),
    "vala": () => import("highlight.js/lib/languages/vala"),
    "vbnet": () => import("highlight.js/lib/languages/vbnet"),
    "vbscript": () => import("highlight.js/lib/languages/vbscript"),
    "vbscript-html": () => import("highlight.js/lib/languages/vbscript-html"),
    "verilog": () => import("highlight.js/lib/languages/verilog"),
    "vhdl": () => import("highlight.js/lib/languages/vhdl"),
    "vim": () => import("highlight.js/lib/languages/vim"),
    "wasm": () => import("highlight.js/lib/languages/wasm"),
    "wren": () => import("highlight.js/lib/languages/wren"),
    "x86asm": () => import("highlight.js/lib/languages/x86asm"),
    "xl": () => import("highlight.js/lib/languages/xl"),
    "xquery": () => import("highlight.js/lib/languages/xquery"),
    "zephir": () => import("highlight.js/lib/languages/zephir"),
}

// hljs.listLanguages().map(l => ([l, hljs.getLanguage(l).aliases])).filter(([, b]) => b).map(([n, a]) => a.map(al => ([al, n]))).flat().map(([a, n]) => `"${a}": languages["${n}"]`).join(",\n")
const aliases:  Record<string, typeof languages[keyof typeof languages]> = {
    "as": languages["actionscript"],
    "asc": languages["angelscript"],
    "apacheconf": languages["apache"],
    "osascript": languages["applescript"],
    "ino": languages["arduino"],
    "arm": languages["armasm"],
    "html": languages["xml"],
    "xhtml": languages["xml"],
    "rss": languages["xml"],
    "atom": languages["xml"],
    "xjb": languages["xml"],
    "xsd": languages["xml"],
    "xsl": languages["xml"],
    "plist": languages["xml"],
    "wsf": languages["xml"],
    "svg": languages["xml"],
    "adoc": languages["asciidoc"],
    "ahk": languages["autohotkey"],
    "x++": languages["axapta"],
    "sh": languages["bash"],
    "bf": languages["brainfuck"],
    "h": languages["c"],
    "capnp": languages["capnproto"],
    "icl": languages["clean"],
    "dcl": languages["clean"],
    "clj": languages["clojure"],
    "edn": languages["clojure"],
    "cmake.in": languages["cmake"],
    "coffee": languages["coffeescript"],
    "cson": languages["coffeescript"],
    "iced": languages["coffeescript"],
    "cls": languages["cos"],
    "cc": languages["cpp"],
    "c++": languages["cpp"],
    "h++": languages["cpp"],
    "hpp": languages["cpp"],
    "hh": languages["cpp"],
    "hxx": languages["cpp"],
    "cxx": languages["cpp"],
    "crm": languages["crmsh"],
    "pcmk": languages["crmsh"],
    "cr": languages["crystal"],
    "cs": languages["csharp"],
    "c#": languages["csharp"],
    "md": languages["markdown"],
    "mkdown": languages["markdown"],
    "mkd": languages["markdown"],
    "dpr": languages["delphi"],
    "dfm": languages["delphi"],
    "pas": languages["delphi"],
    "pascal": languages["delphi"],
    "patch": languages["diff"],
    "jinja": languages["django"],
    "bind": languages["dns"],
    "zone": languages["dns"],
    "docker": languages["dockerfile"],
    "bat": languages["dos"],
    "cmd": languages["dos"],
    "dst": languages["dust"],
    "ex": languages["elixir"],
    "exs": languages["elixir"],
    "rb": languages["ruby"],
    "gemspec": languages["ruby"],
    "podspec": languages["ruby"],
    "thor": languages["ruby"],
    "irb": languages["ruby"],
    "erl": languages["erlang"],
    "xlsx": languages["excel"],
    "xls": languages["excel"],
    "f90": languages["fortran"],
    "f95": languages["fortran"],
    "fs": languages["fsharp"],
    "f#": languages["fsharp"],
    "gms": languages["gams"],
    "gss": languages["gauss"],
    "nc": languages["gcode"],
    "feature": languages["gherkin"],
    "golang": languages["go"],
    "gql": languages["graphql"],
    "hbs": languages["handlebars"],
    "html.hbs": languages["handlebars"],
    "html.handlebars": languages["handlebars"],
    "htmlbars": languages["handlebars"],
    "hs": languages["haskell"],
    "hx": languages["haxe"],
    "https": languages["http"],
    "hylang": languages["hy"],
    "i7": languages["inform7"],
    "toml": languages["ini"],
    "jsp": languages["java"],
    "js": languages["javascript"],
    "jsx": languages["javascript"],
    "mjs": languages["javascript"],
    "cjs": languages["javascript"],
    "wildfly-cli": languages["jboss-cli"],
    "jldoctest": languages["julia-repl"],
    "kt": languages["kotlin"],
    "kts": languages["kotlin"],
    "ls": languages["lasso"],
    "lassoscript": languages["lasso"],
    "tex": languages["latex"],
    "mk": languages["makefile"],
    "mak": languages["makefile"],
    "make": languages["makefile"],
    "mma": languages["mathematica"],
    "wl": languages["mathematica"],
    "m": languages["mercury"],
    "moo": languages["mercury"],
    "mips": languages["mipsasm"],
    "pl": languages["perl"],
    "pm": languages["perl"],
    "moon": languages["moonscript"],
    "nt": languages["nestedtext"],
    "nginxconf": languages["nginx"],
    "nixos": languages["nix"],
    "mm": languages["objectivec"],
    "objc": languages["objectivec"],
    "obj-c": languages["objectivec"],
    "obj-c++": languages["objectivec"],
    "objective-c++": languages["objectivec"],
    "ml": languages["ocaml"],
    "scad": languages["openscad"],
    "pf.conf": languages["pf"],
    "postgres": languages["pgsql"],
    "postgresql": languages["pgsql"],
    "text": languages["plaintext"],
    "txt": languages["plaintext"],
    "pwsh": languages["powershell"],
    "ps": languages["powershell"],
    "ps1": languages["powershell"],
    "pde": languages["processing"],
    "pp": languages["puppet"],
    "pb": languages["purebasic"],
    "pbi": languages["purebasic"],
    "py": languages["python"],
    "gyp": languages["python"],
    "ipython": languages["python"],
    "pycon": languages["python-repl"],
    "k": languages["q"],
    "kdb": languages["q"],
    "qt": languages["qml"],
    "re": languages["reasonml"],
    "graph": languages["roboconf"],
    "instances": languages["roboconf"],
    "mikrotik": languages["routeros"],
    "rs": languages["rust"],
    "scm": languages["scheme"],
    "sci": languages["scilab"],
    "console": languages["shell"],
    "shellsession": languages["shell"],
    "st": languages["smalltalk"],
    "stanfuncs": languages["stan"],
    "do": languages["stata"],
    "ado": languages["stata"],
    "p21": languages["step21"],
    "step": languages["step21"],
    "stp": languages["step21"],
    "styl": languages["stylus"],
    "yml": languages["yaml"],
    "tk": languages["tcl"],
    "craftcms": languages["twig"],
    "ts": languages["typescript"],
    "tsx": languages["typescript"],
    "vb": languages["vbnet"],
    "vbs": languages["vbscript"],
    "v": languages["verilog"],
    "sv": languages["verilog"],
    "svh": languages["verilog"],
    "tao": languages["xl"],
    "xpath": languages["xquery"],
    "xq": languages["xquery"],
    "zep": languages["zephir"]
}

interface ParseMarkdownOptions {
    parseTimestamps?: boolean;
    embed?: boolean;
}

const parseMarkdown = async (raw: string, opts?: ParseMarkdownOptions) => {
    if (opts?.parseTimestamps) {
        raw = parseTimestamps(raw);
    }

    const markdownUnparsed = toHTML(raw, { embed: opts?.embed });
    const markdownUnparsedDom = new DOMParser().parseFromString(markdownUnparsed, "text/html");

    const codeBlocks = markdownUnparsedDom.querySelectorAll("pre code[data-code]");

    const promies = Array.from(codeBlocks).map(async (codeBlock) => {
        let code: string = window.atob(codeBlock.getAttribute("data-code"));

        codeBlock.classList.add("hljs");

        const specifiedLanguage = codeBlock.getAttribute("data-code-language");
        const languageImportFn = languages[specifiedLanguage] ?? aliases[specifiedLanguage];

        if (languageImportFn) {
            if (!hljs.getLanguage(specifiedLanguage)) {
                const languageImport = await languageImportFn();

                hljs.registerLanguage(specifiedLanguage, languageImport.default);
            }

            codeBlock.classList.add(specifiedLanguage);
            codeBlock.innerHTML = hljs.highlight(code, {language: specifiedLanguage}).value;
        } else {
            codeBlock.textContent = code;
        }

        codeBlock.removeAttribute("data-code");
        codeBlock.removeAttribute("data-code-language");
    });

    await Promise.all(promies);

    return markdownUnparsedDom.body.innerHTML;
}

export default parseMarkdown;