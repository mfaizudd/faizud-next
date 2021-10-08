import { useRef } from "react";
import { CodeJar } from "codejar";
import hljs from "highlight.js";

const Editor: React.FC = () => {
    let editor = useRef<HTMLDivElement>(null);
    if (editor != null) {
        // TODO: Change highlight.js to Prism
        // let jar = CodeJar(editor.current as HTMLDivElement, hljs.highlight)
    }
    return (
        <div ref={editor}></div>
    )
}

export default Editor;