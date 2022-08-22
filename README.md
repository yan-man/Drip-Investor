<img src="./img/DripInvestor-logos/Drip%20Investor-logos.jpeg" alt="Drip Investor" style="width:150px;"/>

For the majority of crypto investors, it isn’t about degenerate day trading with 5x leverage. Or about flipping NFT poop emojis for profit. Instead, the commonly preferred method is the tried and true Dollar-Cost-Averaging - a simple, unemotional albeit boring approach.

Dollar-Cost-Averaging is the practice of purchasing the same amount of an underlying asset at regular intervals, regardless of its price. It is designed to lower the average cost per share and reduce volatility, which is especially important to onboarding the non-degenerates amongst us into crypto.

Drip Investor is a dapp that allows permissionless Dollar-Cost-Averaging of tokenized assets. Users can deposit stablecoins, which earn passive lending yield. During regular intervals, stablecoin tokens are withdrawn and swapped using decentralized exchanges to convert into investment tokens of choice.

Drip Investor is built via integrations with Aave, Uniswap, and Chainlink Keepers.

## Table of Contents

- [System Requirements](#system-requirements)
- [Quick Start](#quick-start)
  - [Initial Setup and Dependencies](#initial-setup-and-dependencies)
  - [Local Hardhat Node](#local-hardhat-node)
  - [Deploy Smart Contracts](#deploy-smart-contracts)
- [User Guide](#user-guide)
  - [Read Reviews](#read-reviews)
- [Smart Contract & Mechanics](#smart-contract--mechanics)
  - [Contract Deployment](#contract-deployment)
  - [Local Hardhat Node](#local-hardhat-node)
- [Initial Configuration Settings](#initial-configuration-settings)
- [Testing](#testing)
- [Design Patterns](#design-patterns)
- [Troubleshooting](#troubleshooting)
- [Further/Next Steps](#further--next-steps)

## System Requirements

- [Node](https://nodejs.org/en/download/) v16.14.0
- [Hardhat](https://hardhat.org/) v2.10.1
- [Hardhat-Waffle](https://www.npmjs.com/package/@nomiclabs/hardhat-waffle) v2.0.3

## Quick Start

### Initial Setup and Dependencies

On Terminal 1 clone this repository and install its dependencies:

```sh
$ git clone https://github.com/yan-man/Drip-Investor.git
$ cd Drip-Investor
$ npm install
```
