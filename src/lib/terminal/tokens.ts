export function lastToken(input: string): string {
  const match = input.match(/(\S*)$/);
  return match ? match[1] : "";
}

export function replaceLastToken(input: string, token: string): string {
  return input.replace(/(\S*)$/, token);
}
