import { CodeComponent } from "react-markdown/lib/ast-to-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
// import SyntaxHighlighter from "react-syntax-highlighter";
// import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";

const CodeBlock: CodeComponent = ({ className, children, inline }) => {
    const match = /language-(\w+)/.exec(className ?? "");
    const lang = match ? match[1] : "auto";
    let block = (
        <SyntaxHighlighter language={lang} style={atomDark} showLineNumbers={true}>
            {children}
        </SyntaxHighlighter>
    );
    if (inline) {
        block = (
            <span
                style={
                    { 
                        backgroundColor: "#1d1f21",
                        paddingTop: "0.1rem",
                        paddingBottom: "0.1rem"
                    }
                }
                className="text-gray-300 font-mono px-1 rounded-md">
                    
                {children}
            </span>
        )
    }
    return (
        block
    )
}

export default CodeBlock;