# Visualising Bitcoin Transactions

Mar 16, 2018

To complete my BEng in Computing degree at Imperial, I chose to complete a thesis conducting a visual analysis of the Bitcoin blockchain. My thesis extended upon the work done by Imperial's Data Science Institute (DSI) and Centre for Cryptocurrency Research and Engineering (IC3RE) in their paper here.

**Note: These visualizations are from 2016, and the network has changed considerably since then.**

## Elements in the Network Graph

These visualizations focus on Bitcoin transactions, which have n inputs, represented in orange, and n outputs, represented in blue. The size of the node is relative to the amount in the input/output.

The transaction itself is represented as a green or red node. The node is green if the confirmation time is less than 20 mins.

In these graphs, address reuse is highlighted by grey edges from inputs/outputs to inputs/outputs. Below I have highlighted the address reuse edges in red, showing some of my first transactions using bitcoin.

In the three leftmost transactions I am receiving bitcoin from Circle to my address, and in the rightmost I am spending bitcoin from my address on Steam via BitPay.

<div data-viz="MyAddress.json" data-title="My Bitcoin Transactions — address reuse shown via grey edges"></div>

General address reuse will appear as grey edges in the network graphs.

## Visualising Blocks

Using these visualization techniques, I visualized blocks from the Bitcoin blockchain. Below are visualizations of the blockchain under light load conditions, and heavier use conditions.

<div data-viz="BlockViz154.json" data-title="Block under light load conditions"></div>

<div data-viz="SpamBlock2.json" data-title="Block under heavier use conditions"></div>

## Visualising Programmed Addresses

SatoshiDICE and LuckyBit are two provably fair betting games that managed their addresses in different ways.
SatoshiDICE paid out directly from the same wallet that received funds, while LuckyBit transferred the funds to another address.

<div data-viz="SpamAddress.json" data-title="Programmed address patterns (SatoshiDICE / LuckyBit)"></div>

<div data-viz="AggregationCluster.json" data-title="Aggregation cluster showing address management patterns"></div>

## FBI Seizure of the Silk Road

The FBI seized around 144,000 bitcoin from Silk Road hot wallets. The seizure occurred around block #261269. After applying this visualization to those blocks, I found two connect subgraphs. One I believe is a tumbler, and the other is the FBI seizing assets from the Silk Road hot wallets.

<div data-viz="SilkRoadBlock.json" data-title="Block #261269 — FBI seizure of Silk Road hot wallets"></div>

By focusing on this area and expanding the network graph, the two subgraphs become connected meaning that someone was at the time tumbling bitcoin and directly depositing it in a wallet that would soon be seized.

<div data-viz="FBIAddress.json" data-title="Expanded view — tumbler connected to seized Silk Road wallets"></div>

## Final Thoughts

These visualizations allow thousands of transactions to be analyzed at a glance. They can provide insights into how services on the Bitcoin blockchain manage and use their Bitcoin addresses.
