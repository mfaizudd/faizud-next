import { CodeComponent } from "react-markdown/lib/ast-to-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
// import SyntaxHighlighter from "react-syntax-highlighter";
// import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";

const CodeBlock: CodeComponent = ({className, children}) => {
    const match = /language-(\w+)/.exec(className ?? "");
    const lang = match ? match[1] : "auto";
    return (
        <SyntaxHighlighter language={lang} style={atomDark}>
            {children}
        </SyntaxHighlighter>
    )
}

export default CodeBlock;