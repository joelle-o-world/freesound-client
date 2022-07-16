export function getEnvironmentVariable(variableName: string) {
  const value = process.env[variableName];
  if (value) return value;
  else throw new MissingEnvironmentVariableError(variableName);
}

export class MissingEnvironmentVariableError extends Error {
  constructor(variableName: string) {
    super(`Expected environment variable was missing: $${variableName}`);
  }
}
