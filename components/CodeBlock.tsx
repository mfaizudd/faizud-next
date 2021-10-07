import { CodeComponent } from "react-markdown/lib/ast-to-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";

const CodeBlock: CodeComponent = ({lang, children}) => {
    return (
        <SyntaxHighlighter language={lang} style={atomOneDark}>
            {children}
        </SyntaxHighlighter>
    )
}

export default CodeBlock;