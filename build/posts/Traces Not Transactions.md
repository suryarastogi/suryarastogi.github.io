# Ethereum Traces, not Transactions
Mar 26, 2018


The Bitcoin and Ethereum blockchains have been called “the world ledger” and “the world computer”, and this extends to their transactions as well.
## Bitcoin Transactions vs Ethereum Transactions
In Bitcoin, a transaction can be thought of as a row in a double-entry ledger. It is an atomic step that brings the blockchain to a new state. Calculating a balance for an address at any state is trivial with the ledger, you can just apply all the transactions (rows) involving an address. This, however, does not work in Ethereum.

In Ethereum, a transaction can be thought of as a punch card for *a machine*. The *machine* takes a transaction as an input. The transaction is then executed, changing the *machine* state, which potentially could trigger more executions that may continue to change the *machine* state. In order to calculate a balance, a *machine* is needed to apply all the preceding punch cards. Calculating a balance in this case is tricky, because the changes in *machine* state, including updates to a balance, are obfuscated.
## Ethereum Virtual Machine Traces

The *machine* mentioned above refers to the Ethereum Virtual Machine. Transactions can trigger smaller atomic actions that modify the internal state of the EVM. Information about the execution of these actions is logged and can be found stored as an EVM execution trace, or just a *trace*.
Some block explorers try to represent this abstraction with the concept of “internal transactions” however I feel that this is inaccurate and slightly confusing. You will not be able to accurately recalculate balances using only transactions and “internal transactions”. I believe that the human readable abstraction of *traces* provided by the Parity node implementation is a better representation.
By using the three main *trace* types (call, create, suicide), we can generalise the type of ether transfers that can occur:
* **call**: Used to **transfer** ether from one account to another and/or to call a smart contract function defined by parameters in the data field. This *trace* also encompasses **delegatecall** and **callcode**.
* **create**: Used to create a smart contract, and ether is **transferred** to the newly created smart contract
* **suicide**: Used by an owner of a smart contract to kill the smart contract. Triggers a **transfer** of ether for a refund for killing a contract. Additionally, killing a smart contract can free memory in the blockchain, which can also affects the value transferred.

## Final Thoughts
I therefore believe that block explorers and other Ethereum analysers should adopt the convention of the *trace* data type instead of “internal transactions”.