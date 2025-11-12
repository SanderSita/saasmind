export function preprocessLaTeX(content) {
	return content
		.replace(/\\\[(.*?)\\\]/gs, (_, eq) => `$$${eq}$$`)
		.replace(/\\\((.*?)\\\)/gs, (_, eq) => `$${eq}$`);
}
