import { Fixture, MockContract } from "ethereum-waffle";
import { Wallet } from "@ethersproject/wallet";
import { DCAManager } from "../../typechain-types";

export interface Signers {
  deployer: Wallet;
  alice: Wallet;
  bob: Wallet;
}

export interface Mocks {
  mockUsdc: MockContract;
}
