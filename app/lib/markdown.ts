import { remark } from "remark"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"
import { visit } from "unist-util-visit"
import { Root, Element } from "hast"

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkParse)
    .use(remarkRehype)
    .use(() => (tree: Root) => {
      visit(tree, (node) => {
        // Check for element nodes (which are the HTML elements like <a>)
        if (node.type === "element" && node.tagName === "a") {
          // Type assertion here
          const elementNode = node as Element
          elementNode.properties = elementNode.properties || {}
          elementNode.properties.target = "_blank"
          elementNode.properties.rel = "noopener noreferrer"
        }
      })
    })
    .use(rehypeStringify)
    .process(markdown)

  return result.toString()
}
