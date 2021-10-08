import { useEffect, useRef } from "react";
import { CodeJar } from "codejar";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/"
loadLanguages(["markdown"]);

interface EditorProps {
    value: string;
    onChange: (value: string) => void
}

const Editor: React.FC<EditorProps> = ({value, onChange}) => {
    let editor = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (editor != null) {
            const highlight = (editor: HTMLElement) => {
                let code = editor.textContent;
                code = Prism.highlight(code ?? "", Prism.languages.markdown, "markdown");
                editor.innerHTML = code;
            }
            let jar = CodeJar(editor.current as HTMLDivElement, highlight);
            jar.updateCode(value);
            jar.onUpdate(onChange);
        }
    });
    return (
        <div ref={editor}></div>
    )
}

export default Editor;