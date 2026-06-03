"use client";

export class WalletNotFound extends Error {
  public readonly walletName: string;

  constructor(walletName: string) {
    super(`${walletName} extension is not installed or detected`);
    this.name = "WalletNotFound";
    this.walletName = walletName;
  }
}

export class UserRejectedTransaction extends Error {
  public readonly code: number;

  constructor(message?: string) {
    super(message ?? "User rejected the transaction signature request");
    this.name = "UserRejectedTransaction";
    this.code = 4001;
  }
}

export class InsufficientFUNDS extends Error {
  public readonly required: string;
  public readonly available: string;

  constructor(required: string, available: string) {
    super(
      `Insufficient XLM balance. Required: ${required}, Available: ${available}`
    );
    this.name = "InsufficientFUNDS";
    this.required = required;
    this.available = available;
  }
}
