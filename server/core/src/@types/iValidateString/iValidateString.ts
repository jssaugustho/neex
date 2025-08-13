interface iValidateString {
  regex: RegExp;
  value: string;

  getValue(): string;
}

export default iValidateString;
