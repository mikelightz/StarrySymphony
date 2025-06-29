// server/logger.ts
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(
    `<span class="math-inline">\{formattedTime\} \[</span>{source}] ${message}`
  );
}
