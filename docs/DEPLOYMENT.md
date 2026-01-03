# Deployment & Testing Instructions

**Goal**: This guide enables judges and developers to run the full TSF demo locally, including custodial "platform" actions (contract anchoring, payment distribution) using their own test wallet.

> **General Demo Notes:**
> *   **Autofill**: For demo convenience, clicking anywhere on input pages will automatically fill them with preset data.
> *   **Hybrid Model**: Off-chain details are hardcoded for the demo; On-chain actions (anchoring, payments) are live on Mantle Testnet.
> *   **Role Switching**: Switch between Homeowner and Buyer profiles by clicking the profile icon in the top right.
> *   **Wallet**: MetaMask is the only supported wallet for this demo.
> *   **Investor Flow**: Investors re-onboard upon logout to demonstrate the verification flow.

## 1. Prerequisites

*   **Node.js**: v18 or higher
*   **Browser**: Google Chrome (Recommended)
*   **MetaMask**: Installed in your browser
*   **Testnet MNT (Mantle Sepolia)**: Required for gas fees.
    *   [Mantle Faucet](https://faucet.testnet.mantle.xyz/) (Get test MNT here)

## 2. Setup "Platform" Wallet (Required for End-to-End Test)
To fully test creating contracts and distributing payments, you must act as the "TSF Platform" and "SPV Admin".

1.  Create a **new, empty account** in your MetaMask (e.g., "TSF Demo Admin").
2.  Switch to **Mantle Sepolia Testnet**.
3.  Fund this wallet with some test MNT from the faucet.
4.  Export the **Private Key** of this test wallet.

## 3. Installation & Configuration

1.  **Clone/Download the Repository**:
    ```bash
    git clone https://github.com/TaegyuJEONG/TSF
    cd TSF
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    *   Copy the example file:
        ```bash
        cp .env.example .env
        ```
    *   Open `.env` and paste your test wallet private key:
        ```env
        # Use your test wallet private key here (must have MNT for gas)
        VITE_TSF_PRIVATE_KEY=0xYourPrivateKey...
        VITE_SPV_PRIVATE_KEY=0xYourPrivateKey...
        ```
    *(Note: You can use the same key for both for testing purposes)*

## 4. Running the Demo

1.  **Start the Local Server**:
    ```bash
    npm run dev
    ```
2.  Open `http://localhost:5173` in your browser.

## 5. End-to-End Testing Flow

The demo is structured into specific role-based workflows.

### A. Buyer Onboarding
1.  **Start**, create profile.
2.  **Authorize soft credit check**, upload income docs (simulated OCR/LLM extraction).
3.  System assigns **Risk Tier (A/B/C)**.
4.  **Verified Buyer Profile** is created.

*(To start Homeowner Onboarding: Click the profile icon in the top right of the Marketplace -> Select **"Create New Account"**)*

### B. Homeowner Onboarding & Listing
1.  **Start** as Homeowner, create profile.
2.  Enter **Property Details**, verify ownership docs, upload photos.
3.  Define **Financing Terms** (Price, Down Payment, Interest Rate, Term).
4.  **Preview** and **Publish Listing**.

### C. Deal Closing
1.  **Visit(Optional)**: Buyer requests visit -> Proposes time -> Homeowner accepts -> Confirmation.

    > **Note**: The steps below represent the **Core Functionality** of the TSF platform. For this section, a comprehensive walkthrough is available in our **[Demo Video](https://app.heygen.com/videos/9a6194f00e3b4eeb8adaf2b32014cbcc)**.

*(Please make it sure that you are Homeowner-Michael Johnson)*

2.  **Contract**: Homeowner clicks **"Build Contract"**.
3.  **Fees**: Homeowner pays contract fee (1% of principal).
4.  **Anchoring**: TSF anchors the contract hash + credit underwriting hash on-chain (Mantle Testnet).
5.  **Partners**: Docs shared with Trust & Servicer partners off-chain.

### D. Payments (Buyer -> Homeowner)

*(Please make it sure that you are Buyer-Chris R)*
1.  Buyer makes monthly **Principal & Interest (P&I)** payment.
2.  Payment processed off-chain (Buyer -> Servicer -> Homeowner).
3.  **Payment Hash Anchored**: Only the payment hash is anchored on-chain, linked to the registered contract ledger.

*(Please make it sure that you are Homeowner-Michael Johnson)*
4.  **Verify**: Homeowner checks **Leaf (Merkle Root)** to see payment history.
5.  **Snapshot**: "Contract Snapshot" tab displays hashes and anchor TX.

### E. Cash Out (Tokenization)

*(Please make it sure that you are Homeowner-Michael Johnson)*
1.  Homeowner clicks **"Cash Out"**.
2.  Reviews TSF valuation, selects note sale price.
3.  Reviews fees (Tokenization 0.5%, Success 1% upon full funding).
4.  **Lists Note** (30-day funding period). Fees strictly contingent on 100% funding.

### F. Investor Onboarding & Investing
*(To start Investor Onboarding: Click the profile icon in the top right of the Marketplace -> Select **"Create New Account"**)*

1.  **Connect Wallet** (MetaMask).
2.  **Verification**: Complete KYC/AML check via partner flow.
3.  **Marketplace**: Access investor-only notes.
4.  **Get Test dUSD**:
    *   Click the **"Get Test dUSD"** button in the top navigation bar.
    *   This will mint **1,000,000 dUSD** to your wallet (Features Public Minting for Demo).
    *   Confirm the transaction in MetaMask.
    *   *(If needed, Import Token manually)*:
        *   **Contract Address**: `0xD9EdFFE3DF3af8e7Ff6102DBA1c17b203F054160`
        *   **Symbol**: `dUSD`
        *   **Decimals**: `6`
5.  **Invest**:
    *   Select 1st Note -> Click Invest Button -> Review Documents -> Agree to terms -> Enter Amount -> Approve Stablecoin -> Confirm Transaction.
    *   Invested amount updates in real-time.
    *   (Tip: Use a second wallet to fill the remaining amount to hit 100%).
    *   (Tip: To change account, you should disconnect wallet and start investor onboarding again.)

### G. Claiming (Investor)
*(Please make it sure that you are Buyer-Chris R)*
1.  **Buyer payment** tab to make a payment.

*(Please make it sure that you are Investor account)*
2.  **Investor Payments** tab updates with claimable amount (based on ownership share).
3.  Click **"Claim Now"** -> Receive Stablecoins -> Status updates to "Claimed".
4.  **Verify Ledger**: Click to see ownership %, total invested, claimed P&I, and confirm transactions on **MantleScan**.



## Smart Contract Details (Deployed)

*   **Listing Contract**: `0xA6a9B419Ae205E57c2f6D45f6289287927195068`
*   **DemoUSD**: `0xD9EdFFE3DF3af8e7Ff6102DBA1c17b203F054160` (Public Mint Enabled)

*(To start a fresh demo cycle: Close the 'Contract Documents' modal on the Contract page, then click 'Build Contract' again. This will generate a new agreement and mint a fresh Note on the blockchain.)*
